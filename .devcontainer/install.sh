#!/bin/bash

cd /remote-learning/node-red
npm install 

cd data 
npm install 

cd /remote-learning/node-red/nodes/intelligentcontrol 
npm install 

cd /remote-learning/node-red/nodes/labcontrol
npm install 

cd /remote-learning/julia-service 
julia packages.jl