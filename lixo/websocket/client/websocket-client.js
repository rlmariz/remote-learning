const WebSocket = require('ws');
//const setTimeout = require('timers/promises');

var username = "";
var appliedusername = "";
//var ws;
//document.getElementById("say_message").style.display = "none";
//window.onload = load;


function load() {
  ws = addwebsocket("ws");
  ws.onmessage = function (e) { receiveMessage(e.data) }
} // load

async function connection(socket, timeout = 10000) {
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
      console.log(`timeout: ${timeout}`)
      console.log(`intrasleep: ${intrasleep}`)
      console.log(`ttl: ${ttl}`)
      console.log(`loop: ${loop}`)
    }
    return isOpened()
  }
}

function receiveMessage(msgdata) {
  if (username == "") {
    if (msgdata == appliedusername) {
      username = msgdata;
      console.log(`username ${username}`)
      //document.getElementById("username").innerHTML = "<h1>" + username + "</h1>";
      //document.getElementById("welcome").style.display = "none";
      //document.getElementById("content").style.display = "";
      //document.getElementById("say_message").style.display = ""
    } else {
      if (msgdata == "Username taken!") {
        addContent(msgdata)
      }
    } // if
  } else {
    addContent("received: " + msgdata)
  } // if
} // receiveMessage

function addwebsocket(instancename, subprotocol) {
  //var wsuri = document.URL.replace("http:", "ws:");
  var wsuri = 'ws://localhost:2812';
  //if (typeof subprotocol === "undefined") {
    ws = new WebSocket(wsuri)
  //} else {
 //   ws = new WebSocket(wsuri, subprotocol, perMessageDeflate = false)
  //} //if
  ws.mmynam = instancename;
  ws.onerror = function (e) {
    addContent("WebSocket " + instancename + ".onerror: " +
      "Websocket state is now " + e.target.readyState +
      " " + readystateDesc[e.target.readyState])
  }
  ws.onopen = function (e) {
    addContent("WebSocket " + instancename + ".onopen: " +
      "Websocket state is now " + e.target.readyState +
      " " + readystateDesc[e.target.readyState])
  }
  ws.onclose = function (e) {
    addContent("WebSocket " + instancename + ".onclose: Reload page to chat again.");
    //document.getElementById("say_message").style.display = "hidden"
    //document.getElementById("welcome").style.display = "hidden"
  }

  ws.onmessage = function (e) { 
    console.log(e.data)
  }

  return ws
} // addwebsocket

function addContent(html) {
  //var div = document.createElement("div");
  //div.innerHTML = html;
  //document.getElementById("content").appendChild(div);
  console.log(html);
} // addContent

function applyUserName(applyfor) {
  if (!applyfor.replace(/\s/gi, '').length) {
    //alert("Please select a valid user name")
    console.log('alert: Please select a valid user name')
  } else {
    if (sendonws(ws, "userName:" + applyfor)) {
      appliedusername = applyfor
    }
  }
} // applyUserName

function sendonws(websocket, msg) {
  if (websocket.readyState == 1) {
    websocket.send(msg);
    return true;
  } else {
    //alert("WebSocket not ready. Reload page or check server!");
    console.log('WebSocket not ready. Reload page or check server!')
    return false
  } // if
} // sendonws


// document.getElementById("pick_username").addEventListener("submit", function (e) {
//   e.preventDefault();
//   e.stopImmediatePropagation();
//   applyUserName(e.target.firstElementChild.value);
//   return false;
// })

// document.getElementById("say_message").addEventListener("submit", (e) => {
//   e.preventDefault();
//   e.stopImmediatePropagation();
//   var content = e.target.firstElementChild.value;
//   if (sendonws(ws, content)) {
//     addContent("<p class='sent'>" + username + " : " + content + "</p>")
//   }
//   e.target.firstElementChild.value = "";
//   return false;
// })


var codeDesc = {
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

var readystateDesc = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED"
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start(tfs) {

  console.log('**** Inicio ****** ');

  //load()

  let ws = addwebsocket("ws");

  console.log(`readystate: ${readystateDesc[ws.readyState]}`)

  // while (ws.readyState != WebSocket.OPEN) {
  //   console.log(`readystate-loop: ${readystateDesc[ws.readyState]}`)
  // }

  //const res = await setTimeout(3000, 'Whait 3 secounds')

  //console.log(res);
  await new Promise(r => setTimeout(r, 3000));

  console.log(`readystate: ${readystateDesc[ws.readyState]}`)

  const opened = await connection(ws, 10000)
  if (opened) {
    console.log("opened true")
  }
  else {
    console.log("the socket is closed OR couldn't have the socket in time, program crashed");
    //return
  }

  //applyUserName('myuser')

  // sendonws(ws, 'msg test 1')
  // sendonws(ws, 'msg test 2')
  // sendonws(ws, 'msg test 3')
  sendonws(ws, `tfs:${tfs}`)

  // await new Promise(r => setTimeout(r, 2000));

  // sendonws(ws, 'msg test 1')

  //sendonws(ws, `tfc:${1}`)

  for (let index = 0; index <= 60; index++) {
    sendonws(ws, `tfc:${index}`)
  }

  //sendonws(ws, `tfc:${valueCalc}`)
  //await new Promise(r => setTimeout(r, 1000));
  //ws.close()

  console.log('**** Fim ****** ');
}

start("8 / (8s + 1)")
start("4 / (4s + 1)")
// start(10)
// start(20)
// start(30)
// start(40)
// start(50)
// start(60)

// let ws = new WebSocket('ws://172.19.108.11:2812');


// ws.onerror = function(e){
//   console.log('onerror');
// }

// ws.onopen = function(e){
//   console.log('onopen');
// }

// ws.onclose = function(e){  
//   console.log('onclose');
//   ws.send('teste')
// }

// ws.onmessage = function( message ){
//   console.log(message.data);
// }

// //ws.send('teste')


