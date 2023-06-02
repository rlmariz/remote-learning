Clear-Host

docker rmi --force rlmariz/virtual-lab:latest

docker build --no-cache -t virtual-lab .

# docker login --username <username> --password <password>

docker tag virtual-lab rlmariz/virtual-lab:latest

docker push rlmariz/virtual-lab
