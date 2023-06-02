// import { sio_create } from "./socket-io.js";
const {sio_create} = require("../nodes/socket-io.js");

async function run(tf) {

  console.log('**** Inicio ****** ');

  tf.func = tf.func.replaceAll('^', '**');

  
  let sio = sio_create('http://127.0.0.1:2812', 'virtual-lab')

  while (!sio.connected) {
    console.log('Connecting... ');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  await sio.emit('tfset', tf, (result) => {
    console.log(result);
  });

  for (let t = 0; t <= 60; t++) {

    tfinput = {
      name: tf.name,
      t: t
    }

    await sio.emit('tfinput', tfinput, (result) => {
      console.log(result);
    });
  }

  await sio.emit('tfplot', tf, (result) => {
    console.log(result);
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  sio.disconnect();

  while (!sio.disconnected) {
    console.log('Disconnecting... ');
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('**** Fim ****** ');

}

var tf1 = {
  name: 'tf-1',
  func: '8/(8*s**2+s)'
}

// run(tf1);

// var tf2 = {
//   name: 'tf-2',
//   func: '4/(s^2+2*s+3)'
// }

// run(tf2);

// var tf3 = {
//   name: 'tf-3',
//   func: '1/s-(1/(s+2)^2)+3/(s^2+9)'
// }

// run(tf3);