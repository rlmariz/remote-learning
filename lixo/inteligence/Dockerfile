# docker build --no-cache -t virtual-iclab .
# docker build --no-cache -t virtual-iclab .
# docker build -t virtual-iclab . -f ./inteligence/Dockerfile
# docker run --rm -p 2812:2812 -p 1880:1880 --name iclab virtual-iclab -format
# docker exec -it iclab bash
FROM nodered/node-red:latest

ENV TZ=America/Sao_Paulo

# Julia Install

USER root

ENV JULIA_PATH /usr/local/julia
ENV PATH $JULIA_PATH/bin:$PATH

RUN set -eux;
RUN apk add --no-cache --virtual .fetch-deps gnupg;
RUN wget -O julia.tar.gz 'https://julialang-s3.julialang.org/bin/musl/x64/1.8/julia-1.8.5-musl-x86_64.tar.gz';
RUN	mkdir "$JULIA_PATH";
RUN	tar -xzf julia.tar.gz -C "$JULIA_PATH" --strip-components 1;
RUN rm julia.tar.gz;
RUN	apk del --no-network .fetch-deps;
RUN julia --version

RUN mkdir server
# COPY ./plotserver/julia/* server/
COPY ./plotserver/julia/ ./server/
COPY inteligence/entrypoint.sh .
RUN chmod +x entrypoint.sh
# COPY ./plotserver/julia/packages.jl server/

USER node-red

RUN julia server/packages.jl
# RUN npm install node-red-contrib-modbus
# RUN npm install node-pid-controller
# RUN npm install node-red-contrib-virtuallab

#WORKDIR /usr/src/node-red

ENTRYPOINT ["./entrypoint.sh"]