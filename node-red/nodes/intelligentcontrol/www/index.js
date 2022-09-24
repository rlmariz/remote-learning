var socket;

window.onload = load;

function load() {
    if (location.protocol === "https:") {
        socket = io({path:location.pathname + 'socket.io', secure:true});
    }
    else {
        socket = io({path:location.pathname + 'socket.io'});
    }
    
    socket.on('plot', function (data) {
        //console.log(data);
        plotValue(data)
    });
    
    // socket.on('ui-replay-done', function() {
    //     replaydone();
    // });
    
    socket.on('connect', function() {
        console.log("Websocket plot conected");
        socket.io.emit("buffer");
    })

    socket.on('disconnect', function() {
        console.log("Websocket disconnect");
    })
}
