variable "environment" {}
variable "aws_region" {}

variable "vpc_id" {}
variable "public_subnet_id" {}

variable "instance_name" {
  default     = "jump-box"
  description = "Jump box to access resources in private subnets via SSH"
}
