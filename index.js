const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

const server = express()
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });
const users = new Set();

server.on('connection', (ws) => {
    const userRef = {
        ws,
    };
    users.add(userRef);

    ws.on('message', (message) => {
        console.log(message);
        try {

            // Parsing the message
            const data = JSON.parse(message);

            // Checking if the message is a valid one

            if (
                typeof data.sender !== 'string' ||
                typeof data.body !== 'string'
            ) {
                console.error('Invalid message');
                return;
            }

            // Sending the message

            const messageToSend = {
                sender: data.sender,
                body: data.body,
                sentAt: Date.now()
            }

            sendMessage(messageToSend);

        } catch (e) {
            console.error('Error passing message!', e)
        }
    });

    ws.on('close', (code, reason) => {
        users.delete(userRef);
        console.log(`Connection closed: ${code} ${reason}!`);
    });
});

const sendMessage = (message) => {
    users.forEach((user) => {
        user.ws.send(JSON.stringify(message));
    });
}