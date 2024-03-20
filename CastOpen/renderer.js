// Get DOM elements
const ipElement = document.getElementById('ip');
const sourceList = document.getElementById('sourceList');
const buttonTestSource = document.getElementById('buttonTestSource');
const buttonRunServer = document.getElementById('buttonRunServer');
const buttonStopServer = document.getElementById('buttonStopServer');
const ServerStatus = document.getElementsByClassName('server-status');
const ClientStatus = document.getElementsByClassName('client-status');
const info = document.getElementById('info');

// Disable the stop server button by default
buttonStopServer.disabled = true;

// Fetch IP address and available sources
getIp();
getSources();

// Event listeners for buttons
buttonStopServer.addEventListener('click', () => {
    stopServer();
});

buttonTestSource.addEventListener('click', () => {
    setSource(true);
});

buttonRunServer.addEventListener('click', () => {
    setSource(false);
    buttonTestSource.disabled =  true;
});

// Event listener for receiving messages
window.addEventListener("message", (event) => {
    console.log(event.data);
    if (event.data.serverStatus) {
        ServerStatus[0].style.backgroundColor = 'GREEN';
        buttonRunServer.disabled = true;
        buttonStopServer.disabled = false;
    }
    if (event.data.clientStatus) {
        ClientStatus[0].style.backgroundColor = 'GREEN';
        info.hidden = false;
    } else {
        ClientStatus[0].style.backgroundColor = 'RED';
        info.hidden = true;
    }

    if (event.source === window) {
        console.log("from preload:", event.data);
    }
});

// Function to set the source
function setSource(test) {
    api.send('setSource', { sourceName: sourceList.value, testMode: test });
}

// Function to stop the server
function stopServer() {
    api.send('quitServer', '');
}

// Function to fetch IP address
async function getIp() {
    try {
        const ip = await api.send('getIp', 'prova');
        ipElement.textContent = ip;
    } catch (error) {
        console.error("Error while fetching IP:", error);
    }
}

// Function to fetch available sources
async function getSources() {
    try {
        const sources = await api.send('getSources', '');
        console.log(sources);
        // Clear select before adding new options
        sourceList.innerHTML = '';
        sources.forEach(source => {
            // Create an option for each source and append it to the select
            const option = document.createElement('option');
            option.value = source.name;
            option.textContent = source.name;
            sourceList.appendChild(option);
        });
    } catch (error) {
        console.error("Error while fetching sources:", error);
    }
}
