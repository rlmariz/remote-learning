Clear-Host
docker-compose -f ./node-red-compose.yml up -d
docker cp ./uploads/5.png scadalts:/usr/local/tomcat/webapps/Scada-LTS/uploads/5.png