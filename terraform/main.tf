terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.5.0"
    }
  }
  required_version = ">= 1.2"

  backend "s3" {
    bucket         = "pete-l-endgame-tf-state-1010"
    key            = "pl-endgame-frontend/terraform.tfstate"  # different key to avoid state collision
    region         = "eu-west-2"
    dynamodb_table = "pete-l-endgame-terraform-lock"
  }
}

provider "aws" {
  region = "eu-west-2"
}

data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
  owners = ["099720109477"]
}

# Read the existing VPC and subnet from the API stack's state
data "terraform_remote_state" "api" {
  backend = "s3"
  config = {
    bucket = "pete-l-endgame-tf-state-1010"
    key    = "pl-endgame/terraform.tfstate"
    region = "eu-west-2"
  }
}

resource "aws_key_pair" "deployer" {
  key_name   = "terraform-key-frontend"
  public_key = var.ssh_public_key
}

resource "aws_instance" "frontend_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  subnet_id              = data.terraform_remote_state.api.outputs.public_subnet_id
  vpc_security_group_ids = [aws_security_group.frontend_sg.id]
  key_name               = aws_key_pair.deployer.key_name

  user_data = templatefile("${path.module}/cloud-init.yaml.tmpl", {
    instance_name = "pete-endgame-frontend"
    API_URL       = var.api_url
  })

  tags = {
    Name = "pete-endgame-frontend"
  }

  lifecycle {
    ignore_changes = [ami, user_data]
  }
}

resource "aws_eip" "frontend_eip" {
  instance = aws_instance.frontend_server.id
  domain   = "vpc"

  tags = {
    Name = "endgame-frontend-static-ip"
  }
}