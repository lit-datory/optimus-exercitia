output "db_user" {
  description = "Master username"
  value       = aws_db_instance.rds_postgres.username
}

output "db_password" {
  description = "Master password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "endpoint" {
  description = "Endpoint of db"
  value       = aws_db_instance.rds_postgres.endpoint
}

output "db_port" {
  description = "Port"
  value       = aws_db_instance.rds_postgres.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.rds_postgres.db_name
}


