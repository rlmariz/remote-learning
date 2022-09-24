#!/bin/bash

cd server
julia server.jl &
CHILD_SERVER_PID="$!"
cd ..

trap stop SIGINT SIGTERM

function stop() {
	kill $CHILD_PID
	wait $CHILD_PID

    kill $CHILD_SERVER_PID
	wait $CHILD_SERVER_PID
}

/usr/local/bin/node $NODE_OPTIONS node_modules/node-red/red.js --userDir /data $FLOWS "${@}" &

CHILD_PID="$!"

wait "${CHILD_PID}"