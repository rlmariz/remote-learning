[
  {
    "name": "cb-app",
    "image": "rlmariz/remote-learning-nodered:latest",
    "cpu": 512,
    "memory": 1024,
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cb-app",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },

    "environment": [
        {
          "name": "MODBUS_HOST",
          "value": "127.0.0.1"
        },
        {
          "name": "MODBUS_PORT",
          "value": "5502"
        }
      ],    
    
    "portMappings": [
      {
        "containerPort": 1880,
        "hostPort": 1880
      }

    ]
  },

   {
    "name": "supervisory",
    "image": "rlmariz/remote-learning-supervisory:latest",
    "cpu": 512,
    "memory": 1024,
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cb-app",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },

    "environment": [
        {
          "name": "MODBUS_HOST",
          "value": "127.0.0.1"
        },
        {
          "name": "MODBUS_PORT",
          "value": "5502"
        }
      ],    

    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000
      },
      {
        "containerPort": 5502,
        "hostPort": 5502
      }
    ]
  },

   {
    "name": "controller",
    "image": "rlmariz/remote-learning-controller:latest",
    "cpu": 1024,
    "memory": 2048,
    "networkMode": "awsvpc",
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cb-app",
          "awslogs-region": "${aws_region}",
          "awslogs-stream-prefix": "ecs"
        }
    },

    "environment": [
        {
          "name": "MODBUS_HOST",
          "value": "127.0.0.1"
        },
        {
          "name": "MODBUS_PORT",
          "value": "5502"
        }
      ],    

    "portMappings": [
      {
        "containerPort": 8000,
        "hostPort": 8000
      }
    ]
  }
]