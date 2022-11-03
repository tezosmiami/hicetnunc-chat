const express = require('express');
const { Server } = require('ws');
// const cors = require("cors");

const PORT = process.env.PORT || 3000;

const server = express()
    // .use(cors({
    //     origin: [
    //     'https://www.henmiami.xyz', 'https://www.hicetnunc.miami',
    //     'https://www.hic.miami','https://www.hen.miami',
    //     'https://henmiami.xyz/', 'https://hicetnunc.miami',
    //     'https://hic.miami','https://hen.miami'
    //     ]
    // }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });
const users = new Set();
wss.on('connection', (socket) => {
    const userRef = {
        socket: socket, 
    };
    users.add(userRef);

    socket.on('message', (message) => {
        try {
            const data = JSON.parse(message); 
            if (data.alias) {
                userRef.alias = data.alias
                const messageToSend = {
                    sender: data.alias,
                    body: 'joined the conversation. . .',
                    sentAt: Date.now()
                }
             const online = {body:[] }
                for (user of users.values()){
                     online.body.push(user.alias+' : ')  
                }
                sendMessage(online, socket)
                sendMessage(messageToSend)

                return
            }
            if (
                typeof data.sender !== 'string' ||
                typeof data.body !== 'string'
            ) {
                console.error('Invalid message');
                return;
            }
            else {
                const messageToSend = {
                    sender: data.sender,
                    body: data.body,
                    sentAt: Date.now()
                }
            sendMessage(messageToSend);
            }
        } catch (e) {
            console.error('Error passing message!', e)
        }
    });

    socket.on('close', (code, reason) => {
        const messageToSend = {
            sender: user.alias,
            body: 'left the conversation. . .',
            sentAt: Date.now()
        }
        sendMessage(messageToSend)
        users.delete(userRef);
        console.log(`Connection closed: ${code} ${reason}!`);
    });
});

const sendMessage = (message, socket) => {
    console.log(message)
    Array.isArray(message.body) ? socket.send(JSON.stringify(message)) :
    users.forEach((user) => {
        user.socket.send(JSON.stringify(message));
    });
}