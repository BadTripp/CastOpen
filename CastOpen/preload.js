const { contextBridge, ipcRenderer } = require('electron');
const { PeerServer } = require('peer');
const { Peer } = require('peerjs');


let screenStream;
let serverStatus = false;
let clientStatus = false;
let peerServer;

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => ipcRenderer.invoke(channel, data),
    getIp: (callback) => ipcRenderer.on('getIp', (_event, value) => callback(value)),
});

ipcRenderer.on('serverStop', async (event, data) => {
    closePeerServer();
});

ipcRenderer.on('SET_SOURCE', async (event, sourceId, testMode) => {
    try {
        const screenConstraints = {
            audio: {
                mandatory: {
                    chromeMediaSource: 'desktop'
                }
            },
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId,
                    minWidth: 1280,
                    maxWidth: 1920,
                    minHeight: 720,
                    maxHeight: 1080
                },
                quality : 6,

            }
        };
        screenStream = await navigator.mediaDevices.getUserMedia(screenConstraints);
        handleStream(screenStream);

        if (!testMode) {
            initializePeerServer();
        }

    } catch (e) {
        handleError(e);
    }
});

function initializePeerServer() {
    peerServer = PeerServer({
        secure: false,
        host: '0.0.0.0',
        port: 9000,
        debug: 3,
        allow_discovery: true,
    });

    serverStatus = true;

    peerServer.on('connection', (client) => {
        if (client.id !== 'clientB') {
            startMediaServer();
        }
        if(client.id == 'clientA'){
          clientStatus = true;
          window.postMessage({
            serverStatus : serverStatus,
            clientStatus : clientStatus
          }, '*');
        }
        console.log('Nuova connessione:', client.getId());
    });

    peerServer.on('disconnect', (client) => {
        console.log('Connessione terminata:', client.getId());
        if(client.id == 'clientA'){
            clientStatus = false;
            window.postMessage({
              serverStatus : serverStatus,
              clientStatus : clientStatus
            }, '*');
          }
    });

    peerServer.on('error', (error) => {
        console.error('Errore server:', error);
    });

    window.postMessage({
        serverStatus : serverStatus,
        clientStatus : clientStatus
      }, '*');
}



function handleStream(stream) {
    const video = document.querySelector('video');
    video.srcObject = stream;
    console.log(stream);
    video.onloadedmetadata = (e) => video.play();
}

function startMediaServer() {
    const peer = new Peer('clientB', {
        secure: false,
        host: 'localhost',
        port: 9000,
        debug: 3,
        config: {
            iceServers: []
        }
    });

    peer.on("call", (call) => {
        call.answer(screenStream);
        call.on("stream", (remoteStream) => {
            handleStream(remoteStream);
        });
    });
}

function handleError(e) {
    console.log(e);
}
