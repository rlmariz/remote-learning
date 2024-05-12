variable "region" {
  description = "Define what region the instance will be deployed"
  default     = "us-east-2"
}

variable "name" {
  description = "Name of the Application"
  default     = "remote-learning"
}

variable "env" {
  description = "Environment of the Application"
  default     = "prod"
}

variable "instance_type" {
  description = "AWS Instance type defines the hardware configuration of the machine"
  # https://aws.amazon.com/pt/ec2/instance-types/
  # default     = "t2.micro"
  default     = "t2.medium"  
}

variable "key_pair_name" {
  description = "key_pair_name"
  type        = string
  default     = "remote-learning"
}

variable "key_file_name" {
  description = "Name of the key pair"
  type        = string
  default     = "./remote-learning.pem"
}

variable "az_count" {
    description = "Number of AZs to cover in a given region, min valur is 2"
    default = "1"
}

variable "max_price" {
    description = "The maximum hourly price that you're willing to pay for a Spot"
    default = "0.020"
}




