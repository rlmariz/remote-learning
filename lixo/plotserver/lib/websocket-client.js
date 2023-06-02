import { WebSocket } from 'ws';
//const WebSocket = require('ws')

var wsuri = 'ws://localhost:2812 ';

export const codeDesc = {
  1000: "Normal",
  1001: "Going Away",
  1002: "Protocol Error",
  1003: "Unsupported Data",
  1004: "Reserved",
  1005: "No Status Recvd- reserved",
  1006: "Abnormal Closure- reserved",
  1007: "Invalid frame payload data",
  1008: "Policy Violation",
  1009: "Message too big",
  1010: "Missing Extension",
  1011: "Internal Error",
  1012: "Service Restart",
  1013: "Try Again Later",
  1014: "Bad Gateway",
  1015: "TLS Handshake"
};

export const readyStateDesc = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED"
};

function logSocketEvent(event) {
  console.log(event);
}

export async function connectSocket(socket, timeout = 10000) {
  const isOpened = () => (socket.readyState === WebSocket.OPEN)

  if (socket.readyState !== WebSocket.CONNECTING) {
    return isOpened()
  }
  else {
    const intrasleep = 100
    const ttl = timeout / intrasleep // time to loop
    let loop = 0
    while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
      await new Promise(resolve => setTimeout(resolve, intrasleep))
      loop++
      logSocketEvent(`timeout: ${timeout}`)
      logSocketEvent(`intrasleep: ${intrasleep}`)
      logSocketEvent(`ttl: ${ttl}`)
      logSocketEvent(`loop: ${loop}`)
    }
    return isOpened()
  }
}

export function createSocket(instanceName) {
  let ws = new WebSocket(wsuri)
  ws.instanceName = instanceName;

  ws.onerror = function (e) {
    logSocketEvent("WebSocket " + instanceName + ".onerror: " + "Websocket state is now " + e.target.readyState + " " + readyStateDesc[e.target.readyState])
  }

  ws.onopen = function (e) {
    logSocketEvent("WebSocket " + instanceName + ".onopen: " + "Websocket state is now " + e.target.readyState + " " + readyStateDesc[e.target.readyState])
  }

  ws.onclose = function (e) {
    logSocketEvent("WebSocket " + instanceName + ".onclose: Reload page to chat again.");
  }

  ws.onmessage = function (e) {
    logSocketEvent(e.data)
  }  

  return ws
}

function receiveSocket(msgdata) {
  logSocketEvent("received: " + msgdata)
}


export function sendSocket(websocket, msg) {
  if (websocket.readyState == 1) {
    websocket.send(msg);
    return true;
  } else {
    logSocketEvent('WebSocket not ready!')
    return false
  }
}

