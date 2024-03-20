const peer = new Peer({
    host: 'localhost',
    port: 9000,
    debug: 3,
    config: {
        iceServers: []
    }
});

// Handle incoming call
peer.on('call', (call) => {
    console.log("Incoming call from Client B");
});

// Make a call to Client B
document.getElementById('callButton').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            // Get local video element
            const localVideo = document.getElementById('localVideo');
            // Display local stream
            localVideo.srcObject = stream;

            // Make a call to Client B with the stream
            const call = peer.call('clientB', stream);
            console.log("Call made to Client B");

            // When remote stream is received, display it
            call.on('stream', (remoteStream) => {
                const remoteVideo = document.getElementById('remoteVideo');
                // Display remote stream
                remoteVideo.srcObject = remoteStream;
            });
        })
        .catch((err) => {
            console.error("Error accessing webcam/microphone:", err);
        });
});
