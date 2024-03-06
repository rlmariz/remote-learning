Clear-Host
docker exec -it -u root:root virtual-lab /bin/bash -c "cd /data;npm install /node-red-contrib-virtual-lab;exit"
docker restart virtual-lab
 