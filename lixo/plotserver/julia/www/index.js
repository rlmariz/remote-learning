//import { addWebSocket, connectWebSocket, readyStateDesc, sendSocket } from "./websocket-client.js";

async function load() {
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
  
    sendSocket(ws, `tfs:${tfs}`)
  
    for (let index = 0; index <= 60; index++) {
      sendSocket(ws, `tfc:${index}`)
    }
  
    console.log('**** Fim ****** ');
  }