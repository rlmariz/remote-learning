# docker build --no-cache -t virtual-iclab .

FROM nodered/node-red:latest
ENV TZ=America/Sao_Paulo

# Julia Install

USER root

ENV JULIA_PATH /usr/local/julia
ENV PATH $JULIA_PATH/bin:$PATH

# https://julialang.org/juliareleases.asc
# Julia (Binary signing key) <buildbot@julialang.org>
ENV JULIA_GPG 3673DF529D9049477F76B37566E3C7DC03D6E495

# https://julialang.org/downloads/
ENV JULIA_VERSION 1.8.5

RUN set -eux;

# RUN npm install node-red-contrib-modbus
# RUN npm install node-pid-controller
# RUN npm install node-red-contrib-virtuallab