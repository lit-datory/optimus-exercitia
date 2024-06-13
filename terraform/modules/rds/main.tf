resource "aws_db_subnet_group" "rds_postgres" {
  name       = "${var.environment}-rds-postgres-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "${var.environment}-rds-postgres-subnet-group"
  }
}

resource "aws_security_group" "rds_postgres" {
  name        = "${var.environment}-rds-postgres-security-group"
  description = "RDS Postgres security group"
  vpc_id      = var.vpc_id

  tags = {
    "Name" = "${var.environment}-rds-postgres-security-group"
  }
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4" {
  security_group_id = aws_security_group.rds_postgres.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}

resource "aws_vpc_security_group_ingress_rule" "allow_jump_box_traffic" {
  security_group_id            = aws_security_group.rds_postgres.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = var.jump_box_security_group_id
}

resource "aws_vpc_security_group_ingress_rule" "allow_app_traffic" {
  security_group_id            = aws_security_group.rds_postgres.id
  from_port                    = 5432
  to_port                      = 5432
  ip_protocol                  = "tcp"
  referenced_security_group_id = var.app_security_group_id
}

resource "aws_db_parameter_group" "rds_postgres" {
  name   = "${var.environment}-rds-postgres-parameter-group"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "random_password" "db_password" {
  length = 16
}

resource "aws_db_instance" "rds_postgres" {
  identifier             = "${var.environment}-rds-postgres"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "16.2"
  username               = "postgres"
  password               = random_password.db_password.result
  db_name                = var.db_name
  db_subnet_group_name   = aws_db_subnet_group.rds_postgres.name
  vpc_security_group_ids = [aws_security_group.rds_postgres.id]
  parameter_group_name   = aws_db_parameter_group.rds_postgres.name
  availability_zone      = var.availability_zone
  publicly_accessible    = false
  skip_final_snapshot    = true
}


