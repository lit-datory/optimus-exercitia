terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.46"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

#Push image to repository before deploying the lambda. It will fail without a latest image deployed
resource "aws_ecr_repository" "image-repository" {
  name                 = "${var.environment}-${var.function_name}-image-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    "Name"        = "${var.environment}-${var.function_name}-image-repository"
    "Environment" = "${var.environment}"
  }
}

resource "aws_lambda_function" "puppeteer" {
  function_name = "${var.environment}-${var.function_name}"
  timeout       = 120
  memory_size   = 2048
  image_uri     = "${aws_ecr_repository.image-repository.repository_url}:latest"
  publish       = true
  package_type  = "Image"

  role = aws_iam_role.puppeteer_function_role.arn

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_cloudwatch_log_group.log_group,
  ]
}

#resource "aws_lambda_provisioned_concurrency_config" "puppeteer" {
#  function_name                     = aws_lambda_function.puppeteer.function_name
#  provisioned_concurrent_executions = 1
#  qualifier                         = aws_lambda_function.puppeteer.version
#}

resource "aws_lambda_function_url" "puppeteer" {
  function_name      = aws_lambda_function.puppeteer.function_name
  authorization_type = "AWS_IAM"
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "puppeteer_function_role" {
  name = "${var.environment}-${var.function_name}-role"

  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_cloudwatch_log_group" "log_group" {
  name              = "/aws/lambda/${var.function_name}"
  retention_in_days = 1
}

# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.puppeteer_function_role.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_s3_bucket" "bucket" {
  bucket = "puppeteerz"

  tags = {
    Name        = "puppeteerz"
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

data "aws_iam_policy_document" "s3_write_policy" {
  statement {
    actions   = ["s3:PutObject", "s3:ListBucket"]
    resources = [aws_s3_bucket.bucket.arn, "${aws_s3_bucket.bucket.arn}/*"]
  }
}

resource "aws_iam_policy" "s3-policy" {
  name   = "lambda-write-s3-deploy"
  policy = data.aws_iam_policy_document.s3_write_policy.json
}

resource "aws_iam_role_policy_attachment" "attach" {
  role       = aws_iam_role.puppeteer_function_role.name
  policy_arn = aws_iam_policy.s3-policy.arn
}

