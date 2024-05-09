resource "aws_ecs_cluster" "remote-learning" {
    name = "remote-learning-cluster"
}

data "template_file" "remote-learning" {
    template = file("./deploy.json.tpl")

    vars = {
        aws_region     = var.aws_region
    }
}

resource "aws_ecs_task_definition" "remote-learning" {
    family                   = "remote-learning-task"
    execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
    network_mode             = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu                      = 4096
    memory                   = 8192
    container_definitions    = data.template_file.remote-learning.rendered
}

resource "aws_ecs_service" "nodered" {
    name            = "nodered"
    cluster         = aws_ecs_cluster.remote-learning.id
    task_definition = aws_ecs_task_definition.remote-learning.arn
    desired_count   = var.app_count
    launch_type     = "FARGATE"

    network_configuration {
        security_groups  = [aws_security_group.ecs_tasks.id]
        subnets          = aws_subnet.private.*.id
        assign_public_ip = true
    }

    load_balancer {
        target_group_arn = aws_alb_target_group.nodered.id
        container_name   = "nodered"
        container_port   = 1880
    }

    depends_on = [aws_alb_listener.nodered, aws_iam_role_policy_attachment.ecs-task-execution-role-policy-attachment]
}

resource "aws_ecs_service" "supervisory" {
    name            = "supervisory"
    cluster         = aws_ecs_cluster.remote-learning.id
    task_definition = aws_ecs_task_definition.remote-learning.arn
    desired_count   = var.app_count
    launch_type     = "FARGATE"

    network_configuration {
        security_groups  = [aws_security_group.ecs_tasks.id]
        subnets          = aws_subnet.private.*.id
        assign_public_ip = true
    }

    load_balancer {
        target_group_arn = aws_alb_target_group.supervisory.id
        container_name   = "supervisory"
        container_port   = 3000
    }

    depends_on = [aws_alb_listener.supervisory, aws_iam_role_policy_attachment.ecs-task-execution-role-policy-attachment]
}

resource "aws_ecs_service" "controller" {
    name            = "controller"
    cluster         = aws_ecs_cluster.remote-learning.id
    task_definition = aws_ecs_task_definition.remote-learning.arn
    desired_count   = var.app_count
    launch_type     = "FARGATE"

    network_configuration {
        security_groups  = [aws_security_group.ecs_tasks.id]
        subnets          = aws_subnet.private.*.id
        assign_public_ip = true
    }

    depends_on = [aws_alb_listener.nodered, aws_alb_listener.supervisory, aws_iam_role_policy_attachment.ecs-task-execution-role-policy-attachment]
}