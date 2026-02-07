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

module "vpc" {
  source = "./modules/vpc"

  aws_region  = var.aws_region
  environment = var.environment
}

module "jump_box" {
  source = "./modules/jump_box"

  aws_region       = var.aws_region
  environment      = var.environment
  public_subnet_id = element(module.vpc.public_subnet_ids, 0)
  vpc_id           = module.vpc.vpc_id
}

module "rds" {
  source = "./modules/rds"

  aws_region                 = var.aws_region
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  private_subnet_ids         = module.vpc.private_subnet_ids
  jump_box_security_group_id = module.jump_box.security_group_id
  app_security_group_id      = module.vpc.app_security_group_id
  availability_zone          = module.jump_box.availability_zone
}

module "ecr" {
  source = "./modules/ecr"

  environment = var.environment
}

module "app_runner" {
  source = "./modules/app_runner"

  environment           = var.environment
  repository_arn        = module.ecr.arn
  image_identifier      = module.ecr.repository_url
  image_port            = 3100
  db_name               = module.rds.db_name
  db_port               = module.rds.db_port
  db_user               = module.rds.db_user
  db_password           = module.rds.db_password
  db_endpoint           = module.rds.endpoint
  private_subnet_ids    = module.vpc.private_subnet_ids
  app_security_group_id = module.vpc.app_security_group_id
}

module "frontend" {
  source = "./modules/s3"

  environment = var.environment
  bucket_name = "app"
}
