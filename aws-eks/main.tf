provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {}

locals {
  cluster_name = "eks-${random_string.suffix.result}"
}

resource "random_string" "suffix" {
  length  = 8
  special = false
}

# data "aws_eks_cluster" "remoteleaning" {
#   name = module.eks.cluster_name
# }

# data "aws_eks_cluster_auth" "remoteleaning" {
#   name = module.eks.cluster_name
# }

# provider "kubernetes" {
#   host                   = data.aws_eks_cluster.remoteleaning.endpoint
#   cluster_ca_certificate = base64decode(data.aws_eks_cluster.remoteleaning.certificate_authority[0].data)
#   token                  = data.aws_eks_cluster_auth.remoteleaning.token
# }