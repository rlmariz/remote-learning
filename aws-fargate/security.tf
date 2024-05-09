# ALB security Group: Edit to restrict access to the application
resource "aws_security_group" "lb" {
    name        = "remote-learning-load-balancer-security-group"
    description = "controls access to the load banacer"
    vpc_id      = aws_vpc.main.id

    ingress {
        protocol    = "tcp"
        from_port   = 1880
        to_port     = 1880
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        protocol    = "tcp"
        from_port   = 3000
        to_port     = 3000
        cidr_blocks = ["0.0.0.0/0"]
    }    

    egress {
        protocol    = "-1"
        from_port   = 0
        to_port     = 0
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# Traffic to the ECS cluster should only come from the load balancer
resource "aws_security_group" "ecs_tasks" {
    name        = "remote-learning-ecs-tasks-security-group"
    description = "allow inbound access from the load balancer only"
    vpc_id      = aws_vpc.main.id

    ingress {
        protocol        = "tcp"
        from_port       = 1880
        to_port         = 1880
        security_groups = [aws_security_group.lb.id]
    }

    ingress {
        protocol        = "tcp"
        from_port       = 3000
        to_port         = 3000
        security_groups = [aws_security_group.lb.id]
    }

    egress {
        protocol    = "-1"
        from_port   = 0
        to_port     = 0
        cidr_blocks = ["0.0.0.0/0"]
    }
}