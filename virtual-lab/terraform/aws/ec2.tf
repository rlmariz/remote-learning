data "aws_ami" "amazon_linux_2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-ebs"]
  }

  owners = ["amazon"]

}

resource "aws_instance" "server" {
  ami                    = data.aws_ami.amazon_linux_2.id
  instance_type          = var.instance_type
  key_name               = "aws_virtuallab_key"
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]

  tags = {
    Name        = var.name
    Environment = var.env
    Provisioner = "Terraform"
  }

  provisioner "remote-exec" {
    inline = [
      "set -ex",
      "sudo yum update -y",
      "sudo amazon-linux-extras install docker -y",
      "sudo service docker start",
      "sudo usermod -a -G docker ec2-user",
      "sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "sudo chmod +x /usr/local/bin/docker-compose",
      "sudo yum install git -y",
      "cd /home",
      "sudo git clone https://github.com/rlmariz/virtual-lab-deploy.git virtuallab",
      "cd /home/virtuallab",
      "sudo chown -R 1000:1000 ./node-red-data",
      "sudo setfacl --modify user:$USER:rw /var/run/docker.sock",
      "docker-compose up -d",
      "docker stop scadalts",
      "sleep 30s",
      "docker start scadalts",
      "sleep 30s",
      "curl -sSf http://127.0.0.1:8080/Scada-LTS > /dev/null",      
      "sudo mv *.sql ./scadalts-data",
      "docker exec -it mysql sh -c 'exec mysql -uroot -proot -f scadalts < /var/lib/mysql/scadalts_table_dataSources.sql'",
      "docker exec -it mysql sh -c 'exec mysql -uroot -proot -f scadalts < /var/lib/mysql/scadalts_table_dataPoints.sql'",
      "docker exec -it mysql sh -c 'exec mysql -uroot -proot -f scadalts < /var/lib/mysql/scadalts_table_watchLists.sql'",
      "docker exec -it mysql sh -c 'exec mysql -uroot -proot -f scadalts < /var/lib/mysql/scadalts_table_watchListPoints.sql'",
      "docker exec -it mysql sh -c 'exec mysql -uroot -proot -f scadalts < /var/lib/mysql/scadalts_table_mangoViews.sql'",      
      "docker cp ./uploads/5.png scadalts:/usr/local/tomcat/webapps/Scada-LTS/uploads/5.png",
      "docker stop scadalts",
      "docker start scadalts"
    ]
  }
  connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    private_key = file("./aws.key")
    timeout     = "4m"
  }

}
