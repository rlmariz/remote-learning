#!/bin/bash
clear
kill -9 $(pgrep -f "julia server.jl")
julia server.jl