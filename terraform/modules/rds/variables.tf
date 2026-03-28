variable "environment" {}
variable "aws_region" {}

variable "vpc_id" {}
variable "private_subnet_ids" {}
variable "availability_zone" {}
variable "jump_box_security_group_id" {}
variable "app_security_group_id" {}

variable "db_name" {
  default     = "test"
  description = "Database name"
}
