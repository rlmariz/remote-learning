output "nodered_hostname" {
  value = "${aws_lb.remote-learning.dns_name}:${1880}"
}

output "controller_hostname" {
  value = "${aws_lb.remote-learning.dns_name}:${3000}"
}