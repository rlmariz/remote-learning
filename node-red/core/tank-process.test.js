const TankProcess = require('./tank-process.js')

const tankProcess = new TankProcess(
    area = 4,
    maxLevel = 8,  
    valveK = 2, 
    valveOpen = 50, 
    integrationInterval = 1,
    intervalUpdate = 1000, 
    inputFlow = 4,
    level = 6
);

for (var i = 0; i < 2; i++) {
        console.log(`Level ${tankProcess.step()}`)
}
