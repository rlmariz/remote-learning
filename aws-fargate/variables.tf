variable "aws_access_key" {
    description = "The IAM public access key"
}

variable "aws_secret_key" {
    description = "IAM secret access key"
}

variable "aws_region" {
    description = "The AWS region things are created in"
}

variable "ecs_auto_scale_role_name" {
    description = "ECS auto scale role name"
    default = "remote-learning-auto-scale"
}

variable "az_count" {
    description = "Number of AZs to cover in a given region, min valur is 2"
    default = "2"
}

variable "app_count" {
    description = "Number of docker containers to run"
    default = 1
}