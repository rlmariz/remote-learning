# logs.tf

# Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "remote-learning-log-group" {
  name              = "/ecs/remote-learning-app"
  retention_in_days = 30

  tags = {
    Name = "remote-learning-log-group"
  }
}

resource "aws_cloudwatch_log_stream" "remote-learning-log-stream" {
  name           = "remote-learning-log-stream"
  log_group_name = aws_cloudwatch_log_group.remote-learning-log-group.name
}