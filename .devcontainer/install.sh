#!/bin/bash

cd /remote-learning/node-red-debug 
npm install 

cd data 
npm install 

cd /remote-learning/node-red-debug/nodes/intelligentcontrol 
npm install 

cd /remote-learning/julia-service 
julia packages.jl