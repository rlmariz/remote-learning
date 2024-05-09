resource "aws_alb" "remote-learning" {
    name        = "remote-learning-load-balancer"
    subnets         = aws_subnet.public.*.id
    security_groups = [aws_security_group.lb.id]
}

# Redirect port 1880 to nodered
resource "aws_alb_target_group" "nodered" {
    name        = "nodered"
    port        = 80
    protocol    = "HTTP"
    vpc_id      = aws_vpc.main.id
    target_type = "ip"

    health_check {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/"
        unhealthy_threshold = "2"
    }
}

resource "aws_alb_listener" "nodered" {
  load_balancer_arn = aws_alb.remote-learning.id
  port              = 1880
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.nodered.id
    type             = "forward"
  }
}

##########################

# Redirect port 3000 to supervisory
resource "aws_alb_target_group" "supervisory" {
    name        = "supervisory"
    port        = 3000
    protocol    = "HTTP"
    vpc_id      = aws_vpc.main.id
    target_type = "ip"

    health_check {
        healthy_threshold   = "3"
        interval            = "30"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/"
        unhealthy_threshold = "2"
    }
}

resource "aws_alb_listener" "supervisory" {
  load_balancer_arn = aws_alb.remote-learning.id
  port              = 3000
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_alb_target_group.supervisory.id
    type             = "forward"
  }
}


