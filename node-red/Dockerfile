# docker build --no-cache -t rlmariz/remote-learning-nodered:ts-0.3 .
# docker run --rm -it -p 1880:1880 -p 502:502 -e MODBUS_HOST=host.docker.internal -e MODBUS_PORT=502 -v ${pwd}/node-red-data:/data -v ${pwd}/nodes:/node-red-contrib-remote-learning --name remote-learning-nodered rlmariz/remote-learning-nodered:latest
# docker run --rm -it -p 1880:1880 -p 5502:5502 --name remote-learning-nodered rlmariz/remote-learning-nodered:latest
# docker run --rm -it -p 1880:1880 -p 5502:5502 -p 502:502 --name remote-learning-nodered nodered/node-red:latest
# docker push databelli/caixaentradaweb.front4
FROM nodered/node-red:latest

ENV TZ=America/Sao_Paulo
ENV MODBUS_HOST=host.docker.internal
ENV MODBUS_PORT=502

USER root

RUN mkdir -p /data
RUN mkdir -p /node-red-contrib-remote-learning 

COPY ./data /data
COPY ./nodes /node-red-contrib-remote-learning 

RUN npm install node-red-contrib-modbus
RUN npm install node-pid-controller
RUN npm install /node-red-contrib-remote-learning

USER node-red