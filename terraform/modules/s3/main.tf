resource "aws_s3_bucket" "bucket" {
  bucket = "${var.environment}-${var.bucket_name}"

  tags = {
    Name        = var.bucket_name
    Environment = var.environment
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    bucket_key_enabled = true
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "access" {
  name                              = "S3 AOC"
  description                       = "AOC"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

locals {
  s3_origin_id = "S3 - Origin"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.access.id
    origin_id                = local.s3_origin_id
  }

  enabled = true

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  tags = {
    Environment = var.environment
  }

  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 0
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 0
    response_code         = 200
    response_page_path    = "/index.html"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  price_class = "PriceClass_200"

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${self.id} --paths '/*'"
  }
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.bucket.arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "cdn-oac-bucket-policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}

data "aws_iam_policy_document" "s3_write_policy" {
  statement {
    actions   = ["s3:GetObject", "s3:PutObject", "s3:ListBucket", "cloudfront:CreateInvalidation"]
    resources = [aws_s3_bucket.bucket.arn, "${aws_s3_bucket.bucket.arn}/*", aws_cloudfront_distribution.s3_distribution.arn]
  }
}

resource "aws_iam_user" "github-actions" {
  name = "${var.environment}-github-actions-s3-deploy"
  path = "/ci/"

  tags = {
    Terraform     = true
    "Environment" = "${var.environment}"
  }
}

resource "aws_iam_policy" "s3-cloudfront-policy" {
  name        = "s3-deploy"
  description = "Deploy S3 Cloudfront"
  policy      = data.aws_iam_policy_document.s3_write_policy.json
}

resource "aws_iam_user_policy_attachment" "s3-deploy" {
  user       = aws_iam_user.github-actions.name
  policy_arn = aws_iam_policy.s3-cloudfront-policy.arn
}

resource "aws_iam_access_key" "github-actions" {
  user = aws_iam_user.github-actions.name
}
