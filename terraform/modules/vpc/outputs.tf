output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.vpc.id
}

output "public_subnet_ids" {
  description = "ID's of the public subnets"
  value       = aws_subnet.public_subnet.*.id
}

output "private_subnet_ids" {
  description = "ID's of the private subnets"
  value       = aws_subnet.private_subnet.*.id
}

output "app_security_group_id" {
  description = "ID of the default app security group"
  value       = aws_security_group.app_sg.id
}
