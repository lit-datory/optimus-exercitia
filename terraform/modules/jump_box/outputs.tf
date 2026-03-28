output "ssh_private_key_pem" {
  value     = tls_private_key.ssh.private_key_pem
  sensitive = true
}

output "ssh_public_key_pem" {
  value = tls_private_key.ssh.public_key_pem
}

output "security_group_id" {
  value = aws_security_group.security_group.id
}

output "public_dns" {
  value = aws_instance.jump_box.public_dns
}

output "availability_zone" {
  value = aws_instance.jump_box.availability_zone
}

output "ssh_command" {
  value = "ssh -i ${local.instance_name}-key.pem ec2-user@${aws_instance.jump_box.public_dns}"

}
