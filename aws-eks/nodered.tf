
# resource "kubernetes_stateful_set" "nodered" {
#   metadata {
#     name = "nodered"
#   }

#   spec {
#     selector {
#       match_labels = {
#         app = "nodered-app"
#       }
#     }

#     service_name = "nodered"
#     replicas    = 1

#     template {
#       metadata {
#         labels = {
#           app = "nodered-app"
#         }
#       }

#       spec {
#         container {
#           name  = "nodered-app"
#           image = "rlmariz/remote-learning-nodered:latest"

#           port {
#             container_port = 1880
#           }

#           port {
#             container_port = 5502
#           }

#           env {
#             name  = "TZ"
#             value = "America/Sao_Paulo"
#           }

#           env {
#             name  = "MODBUS_HOST"
#             value = "nodered-modbus.default.svc.cluster.local"
#           }

#           env {
#             name  = "MODBUS_PORT"
#             value = "5502"
#           }

#           image_pull_policy = "Always"
#         }
#       }
#     }
#   }
# }

# resource "kubernetes_service" "nodered_modbus" {
#   metadata {
#     name = "nodered-modbus"
#   }

#   spec {
#     selector = {
#       app = "nodered-app"
#     }

#     port {
#       protocol    = "TCP"
#       port        = 5502
#       target_port = 5502
#     }

#     type = "ClusterIP"
#   }
# }

# resource "kubernetes_service" "nodered_service" {
#   metadata {
#     name = "nodered-service"
#   }

#   spec {
#     selector = {
#       app = "nodered-app"
#     }

#     port {
#       protocol    = "TCP"
#       port        = 1880
#       target_port = 1880
#     }

#     type = "LoadBalancer"
#   }
# }

# resource "kubectl_manifest" "nodered" {
#     yaml_body = file("${path.module}/nodered.yaml")
# }