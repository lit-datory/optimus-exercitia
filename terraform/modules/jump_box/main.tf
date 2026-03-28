locals {
  instance_name = "${var.environment}-${var.instance_name}"
  key_name      = "${local.instance_name}-key"
  key_file      = "${local.key_name}.pem"
}

resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ssh" {
  key_name   = local.key_name
  public_key = tls_private_key.ssh.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.ssh.private_key_pem
  filename = local.key_file
  file_permission = "0400"
}

resource "aws_security_group" "security_group" {
  name        = "${local.instance_name}-security-group"
  description = "Allows inbound SSH"
  vpc_id      = var.vpc_id

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    "Name" = "${local.instance_name}-security-group"
  }
}

resource "aws_vpc_security_group_ingress_rule" "allow_all_traffic_ssh" {
  security_group_id = aws_security_group.security_group.id
  cidr_ipv4         = "0.0.0.0/0"
  from_port         = 22
  to_port           = 22
  ip_protocol       = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.security_group.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_network_interface" "jump_box" {
  subnet_id   = var.public_subnet_id
  private_ips = ["10.0.0.12"]

  security_groups = [aws_security_group.security_group.id]

  tags = {
    Name = "primary_network_interface"
  }
}

resource "aws_instance" "jump_box" {
  ami           = "ami-0f7204385566b32d0"
  instance_type = "t2.micro"

  key_name = aws_key_pair.ssh.key_name

  network_interface {
    network_interface_id = aws_network_interface.jump_box.id
    device_index         = 0
  }

  tags = {
    Name        = local.instance_name
    Environment = var.environment
  }
}
