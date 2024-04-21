variable "aws_region" {
  type        = string
  default = "eu-central-1"
}

variable "environment" {
  type        = string
  default = "development"
}

variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type        = string
  default     = "jump-box-test"
}

