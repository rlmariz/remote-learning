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

# provider "kubernetes" {
#   config_context_cluster = local.cluster_name
# }

# provider "kubernetes" {
#   host                   = data.aws_eks_cluster.cluster.endpoint
#   cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
#   token                  = data.aws_eks_cluster_auth.cluster.token
# }

# data "aws_eks_cluster" "cluster" {  
#   name = module.eks.cluster_id
# }

# data "aws_eks_cluster_auth" "cluster" {
#   name = module.eks.cluster_id
# }
#data "aws_region" "selected" {}

# provider "kubernetes" {
#   host                   = module.eks.cluster_endpoint
#   cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
#   exec {
#     api_version = "client.authentication.k8s.io/v1"
#     #args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_id, "--region", data.aws_region.selected.name]
#     args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_id, "--region", var.region]
#     command     = "aws"
#   }
# }

# provider "kubernetes" {
#   host                   = module.eks.cluster_endpoint
#   cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
#   exec {
#     api_version = "client.authentication.k8s.io/v1beta1"
#     args        = ["eks", "get-token", "--cluster-name", local.cluster_name]
#     command     = "aws"
#   }
# }

# data "aws_eks_cluster" "example" {
#   name = local.cluster_name
# }



# provider "kubernetes" {
#   host                   = data.aws_eks_cluster.example.endpoint
#   cluster_ca_certificate = base64decode(data.aws_eks_cluster.example.certificate_authority[0].data)
#   token                  = data.aws_eks_cluster_auth.example.token
# }

# data "aws_eks_cluster_auth" "example" {
#   name = local.cluster_name
# }
# provider "kubernetes" {
#   host                   = module.eks.cluster_endpoint
#   cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
#   exec {
#     api_version = "client.authentication.k8s.io/v1beta1"
#     args        = ["eks", "update-kubeconfig", "--name", local.cluster_name, "--region", var.region]
#     command     = "aws"
#   }
# }

# # Same parameters as kubernetes provider
# provider "kubectl" {
#   load_config_file       = false
#   host                   = "${module.eks.cluster_endpoint}"
#   token                  = "${data.aws_eks_cluster_auth.example.token}"
#   cluster_ca_certificate = "${base64decode(module.eks.cluster_certificate_authority_data)}"
# }

