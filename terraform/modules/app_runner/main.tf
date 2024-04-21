resource "random_uuid" "secret_key" {
}

resource "aws_ssm_parameter" "database_url" {
  name        = "/${var.environment}/app/DATABASE_URL"
  description = "Database url for use as DATABASE_URL env variable"
  type        = "SecureString"
  value       = "postgresql://${var.db_user}:${var.db_password}@${var.db_endpoint}/${var.db_name}?schema=public"

  tags = {
    environment = var.environment
    Terraform   = true
  }
}
resource "aws_ssm_parameter" "secret_key" {
  name        = "/${var.environment}/app/SECRET_KEY"
  description = "Secret key to sign JWT and CSRF token"
  type        = "SecureString"
  value       = random_uuid.secret_key.result

  tags = {
    environment = var.environment
    Terraform   = true
  }
}
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["tasks.apprunner.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

data "aws_iam_policy_document" "access_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["build.apprunner.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "access_role" {
  name        = "app_runner_access"
  description = "App Runner Access to ECR"

  assume_role_policy    = data.aws_iam_policy_document.access_assume_role.json
  force_detach_policies = true
}

resource "aws_iam_role" "instance_role" {
  name               = "${var.environment}-app-instance-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "ssm_policy" {
  statement {
    effect    = "Allow"
    actions   = ["ssm:GetParameters"]
    resources = [aws_ssm_parameter.database_url.arn, aws_ssm_parameter.secret_key.arn]
  }
}

data "aws_iam_policy_document" "read_ecr_access" {
  statement {
    sid = "ReadPrivateEcr"
    actions = [
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:GetDownloadUrlForLayer",
    ]
    resources = [var.repository_arn]
  }

  statement {
    sid = "AuthPrivateEcr"
    actions = [
      "ecr:DescribeImages",
      "ecr:GetAuthorizationToken",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "ssm_policy" {
  name        = "get-ssm-secrets-app"
  description = "Get SSM secrets"
  policy      = data.aws_iam_policy_document.ssm_policy.json
}

resource "aws_iam_policy" "access_policy" {
  name        = "access-app-runner-policy"
  description = "Access app runner ecr"
  policy      = data.aws_iam_policy_document.read_ecr_access.json
}

resource "aws_iam_role_policy_attachment" "attach_instance_role" {
  role       = aws_iam_role.instance_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}

resource "aws_iam_role_policy_attachment" "attach_access_role" {
  role       = aws_iam_role.access_role.name
  policy_arn = aws_iam_policy.access_policy.arn
}

resource "aws_apprunner_auto_scaling_configuration_version" "app" {
  auto_scaling_configuration_name = "${var.environment}_app_scaling"

  max_concurrency = 100
  max_size        = 1
  min_size        = 1

  tags = {
    Name = "${var.environment}-app-scaling-configuration"
  }
}

resource "aws_apprunner_vpc_connector" "connector" {
  vpc_connector_name = "${var.environment}-app-vpc-connector"
  subnets            = var.private_subnet_ids
  security_groups    = [var.app_security_group_id]
}

resource "aws_apprunner_service" "app" {
  service_name = "${var.environment}-app"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.access_role.arn
    }
    image_repository {
      image_configuration {
        port = var.image_port

        runtime_environment_variables = {
          "FRONTEND_URL" : "http://localhost:3000"
          "SWAGGER_TITLE" : "Optimus Exercitia"
          "SWAGGER_DESCRIPTION" : "Best practices in Latin"
          "SWAGGER_VERSION" : "0.1"
          "HTTP_COOKIE_DOMAIN" : "localhost"
          "HTTP_COOKIE_SAME_SITE" : "Strict"
          "JWT_ACCESS_TOKEN_EXPIRE_TIME" : 300
          "JWT_REFRESH_TOKEN_EXPIRE_TIME" : 604800
          "HTTP_COOKIE_EXPIRE_TIME" : 604800
        }

        runtime_environment_secrets = {
          "DATABASE_URL" : aws_ssm_parameter.database_url.arn,
          "JWT_SECRET_KEY" : aws_ssm_parameter.secret_key.arn
          "CSRF_TOKEN_SECRET_KEY" : aws_ssm_parameter.secret_key.arn
        }
      }

      image_identifier      = "${var.image_identifier}:latest"
      image_repository_type = "ECR"
    }
    auto_deployments_enabled = true
  }





  auto_scaling_configuration_arn = aws_apprunner_auto_scaling_configuration_version.app.arn

  instance_configuration {
    cpu               = "0.25 vCPU"
    memory            = "0.5 GB"
    instance_role_arn = aws_iam_role.instance_role.arn
  }

  network_configuration {
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = aws_apprunner_vpc_connector.connector.arn
    }
  }

  tags = {
    Name = "${var.environment}-app"
  }
}
