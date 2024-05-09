# provider.tf

terraform {
  required_providers {

    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.48.0"
    } 

    template = {
      source  = "hashicorp/template"
      version = "~> 2.2.0"
    } 

  }

  required_version = "~> 1.8.2"
}

# Specify the provider and access details
provider "aws" {
    region     = var.aws_region
    # shared_credentials_files = ["aws_credentials.txt"]
}