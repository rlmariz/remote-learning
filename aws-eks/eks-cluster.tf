module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = local.cluster_name
  cluster_version = "1.29"

  cluster_endpoint_public_access = true

  cluster_addons = {
     coredns = {
       most_recent = true
     }
     kube-proxy = {
       most_recent = true
     }
     vpc-cni = {
       most_recent = true
     }
   }  

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets  

  eks_managed_node_group_defaults = {
    ami_type = "AL2_x86_64"

  }

  eks_managed_node_groups = {
    one = {
      name = "node-group-spot"

      instance_types = ["t3.small"]
      capacity_type  = "SPOT"

      min_size     = 1
      max_size     = 1
      desired_size = 1
    }

  }

   tags = {
    Environment = "dev"
    Terraform   = "true"
  }
}

# resource "null_resource" "update_kubeconfig" {
#   provisioner "local-exec" {
#     command = "aws eks --region=${var.region} update-kubeconfig --name=${local.cluster_name}"
#   }
# }