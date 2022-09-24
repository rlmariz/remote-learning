var ws;
window.onload = load;

function load() {
   ws = addwebsocket("ws");
   ws.onmessage = function (e) { receiveMessage(e.data) }
}

function receiveMessage(msgdata) {
   console.log("received: " + msgdata)  
   plotValue(msgdata) 
}

function addwebsocket(instancename, subprotocol) {
   var wsuri = 'ws://localhost:2812';
   ws = new WebSocket(wsuri)
   ws.mynam = instancename;

   ws.onerror = function (e) {
      console.log("WebSocket " + instancename + ".onerror: Websocket state is now " + e.target.readyState + " " + readystateDesc[e.target.readyState])
   }

   ws.onopen = function (e) {
      console.log("WebSocket " + instancename + ".onopen: Websocket state is now " + e.target.readyState + " " + readystateDesc[e.target.readyState]);
   }

   ws.onclose = function (e) {
      console.log("WebSocket " + instancename + ".onclose: Reload page to chat again.");
   }
   return ws
}

function sendonws(websocket, msg) {
   if (websocket.readyState == 1) {
      websocket.send(msg);
      return true;
   } else {
      alert("WebSocket not ready. Reload page or check server!");
      return false
   }
}

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