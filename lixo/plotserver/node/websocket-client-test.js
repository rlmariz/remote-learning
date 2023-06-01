import { createSocket, connectSocket, readyStateDesc, sendSocket } from "../lib/websocket-client.js";
//const ws = require('./websocket-client');
//require('./websocket-client.js')
//import {createSocket} from "./websocket-client.js";
//var fs = require('websocket-client');


async function start(tfs, name) {

  console.log('**** Inicio ****** ');

  let ws = createSocket("ws");

  console.log(`readystate: ${readyStateDesc[ws.readyState]}`)

  await new Promise(r => setTimeout(r, 3000));

  console.log(`readystate: ${readyStateDesc[ws.readyState]}`)

  const opened = await connectSocket(ws, 10000)
  if (opened) {
    console.log("opened true")
  }
  else {
    console.log("the socket is closed OR couldn't have the socket in time, program crashed");
  }

  sendSocket(ws, `tfn:${name}`)
  sendSocket(ws, `tfs:${tfs}`)

  for (let index = 0; index <= 60; index++) {
    sendSocket(ws, `tfc:${index}`)
  }

  console.log('**** Fim ****** ');
}

start("8 / (8s + 1)", "plot-1")

//start("4 / (4s + 1)", "plot-2")