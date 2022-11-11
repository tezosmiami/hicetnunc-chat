const express = require('express');
const { Server } = require('ws');
const cors = require('cors');

const PORT = process.env.PORT || 3000;

const server = express()

// server.use(cors({
//         origin: [
//         'https://www.henmiami.xyz', 'https://www.hicetnunc.miami',
//         'https://www.hic.miami','https://www.hen.miami',
//         'https://henmiami.xyz/', 'https://hicetnunc.miami',
//         'https://hic.miami', 'https://hen.miami', 'https://www.henmiami.netlify.app'
//         ]
//     }))

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

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
                const online = {body:[]}
                    for (user of users.values()){
                        !online.body.includes(user.alias)
                            && online.body.push(user.alias)  
                    }
                sendMessage(online)
               
                // if(data.counter == 0){
                //     const messageToSend = {
                //         sender: data.alias,
                //         body: 'joined the conversation. . .',
                //         sentAt: Date.now()
                //     }
                // sendMessage(messageToSend)
                // } 
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
        // const messageToSend = {
        //     sender: user.alias,
        //     body: 'left the conversation. . .',
        //     sentAt: Date.now()
        // }
        // sendMessage(messageToSend)
        users.delete(userRef);
        const online = {body:[]}
                for (user of users.values()){
                    !online.body.includes(user.alias)
                        && online.body.push(user.alias)  
                }
        sendMessage(online)
        console.log(`Connection closed: ${code} ${reason}!`);
    });
});

const sendMessage = (message) => {
    console.log(Array.isArray(message))
    // Array.isArray(message) ? socket.send(JSON.stringify(message)) :
    users.forEach((user) => {
        // console.log(message)
        user.socket.send(JSON.stringify(message));
    });
}