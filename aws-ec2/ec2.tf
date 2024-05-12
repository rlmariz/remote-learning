data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

   filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }

  owners = ["amazon"]

}

# RSA key of size 4096 bits
resource "tls_private_key" "rsa-4096-deploy" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = var.key_pair_name
  public_key = tls_private_key.rsa-4096-deploy.public_key_openssh
}

resource "local_file" "deployer" {
  content  = tls_private_key.rsa-4096-deploy.private_key_pem
  filename = var.key_file_name
}

resource "aws_instance" "server" {
  ami                         = data.aws_ami.amazon_linux_2.id
  instance_type               = var.instance_type
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.allow.id]
  subnet_id                   = element(aws_subnet.public.*.id, var.az_count)
  associate_public_ip_address = true 

  tags = {
    Name        = var.name
    Environment = var.env
    Provisioner = "Terraform"
  }

  instance_market_options {
    market_type = "spot"
    spot_options {      
      max_price   = var.max_price
    }
  }

  provisioner "remote-exec" {
    inline = [
      "set -ex",
      "sudo yum update -y",
      "sudo yum install docker -y",
      "sudo service docker start",
      "sudo usermod -a -G docker ec2-user",
      "sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo curl -o compose.yml https://raw.githubusercontent.com/rlmariz/remote-learning/main/compose.yaml",
      "sudo docker-compose up -d"
    ]
  }
  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file(var.key_file_name)
    timeout     = "4m"
  }

}
