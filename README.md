# CastOpen

CastOpen is a desktop application developed with **Node.js** and **Electron** that allows you to stream your desktop sources to one or more clients using **PeerJS** and **WebRTC** technology.

## Features

- Stream desktop sources to clients
- Supports video transmission with or without audio (audio support may require additional setup on certain platforms)
- Tested on Windows and macOS
- Test folder with simple implementation for testing purposes
- Optimized for local network performance
- Minimal impact on system resources

## Requirements

- **Node.js** installed
- **Electron** installed globally (`npm install electron -g`)

## Usage

1. Install dependencies:

npm install


2. Start the application:

npm start

## How It Works

CastOpen hosts a PeerJS server and constructs a PeerJS client to connect and transmit the desktop to one or more peers.


## Known Issues

- Audio transmission may require additional setup on macOS
- Performance may vary on different platforms and network conditions
- Possible delay and audio-video desync issues

## Testing

The application has been tested on Windows and macOS. However, it has not been tested on Linux. Contributions for testing and improving compatibility are welcome.

## License

This project is licensed under the [MIT License](LICENSE).
