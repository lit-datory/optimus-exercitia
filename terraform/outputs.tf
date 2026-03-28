output "ssh_private_key_pem" {
  value     = module.jump_box.ssh_private_key_pem
  sensitive = true
}

output "jump_box_public_dns" {
  value = module.jump_box.public_dns
}

output "jump_box_ssh_command" {
  value = module.jump_box.ssh_command
}

output "db_user" {
  value = module.rds.db_user
}

output "db_password" {
  value     = module.rds.db_password
  sensitive = true
}

output "db_endpoint" {
  value = module.rds.endpoint
}

output "access_key_id_github_actions" {
  value = module.ecr.access_key_id_github_actions
}

output "access_key_secret_github_actions" {
  value     = module.ecr.access_key_secret_github_actions
  sensitive = true
}
output "access_key_id_github_actions_s3_cloudfront" {
  value = module.frontend.access_key_id_github_actions
}

output "access_key_secret_github_actions_s3_cloudfront" {
  value     = module.frontend.access_key_secret_github_actions
  sensitive = true
}
