output "public_ip" {
  value = aws_instance.server.public_ip
}

output "public_dns" {
  value = aws_instance.server.public_dns
}

output "ssh_connection" {
  value = "ssh -i remote-learning.pem ec2-user@${aws_instance.server.public_dns}"
}

output "nodered" {
  value = "${aws_instance.server.public_dns}:1880"
}

output "supervisory" {
  value = "${aws_instance.server.public_dns}:3000"
}

