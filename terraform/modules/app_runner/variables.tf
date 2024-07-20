variable "environment" {}
variable "image_identifier" {}
variable "repository_arn" {}
variable "private_subnet_ids" {}
variable "app_security_group_id" {}

variable "db_port" {}
variable "db_endpoint" {}
variable "db_user" {}
variable "db_password" {}
variable "db_name" {}

variable "image_port" {
  type    = string
  default = "3100"
}
