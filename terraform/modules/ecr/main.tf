resource "aws_ecr_repository" "image-repository" {
  name                 = "${var.environment}-image-repository"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    "Name"        = "${var.environment}-image-repository"
    "Environment" = "${var.environment}"
  }
}

resource "aws_iam_user" "github-actions" {
  name = "${var.environment}-github-actions"
  path = "/ci/"

  tags = {
    Terraform     = true
    "Environment" = "${var.environment}"
  }
}

resource "aws_iam_access_key" "github-actions" {
  user = aws_iam_user.github-actions.name
}

resource "aws_iam_user_policy_attachment" "ecr-full-access" {
  user       = aws_iam_user.github-actions.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryFullAccess"
}
