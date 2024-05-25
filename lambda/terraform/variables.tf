variable "aws_region" {
  type        = string
  default = "eu-central-1"
}

variable "function_name" {
  type        = string
  default = "puppeteer"
}

variable "environment" {
  type        = string
  default = "development"
}
