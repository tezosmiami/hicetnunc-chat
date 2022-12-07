const express = require('express')
const { ExpressPeerServer } = require('peer')
const cors = require('cors')

var port = process.env.PORT || 443
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res, next) => res.send('hicetnunc'));

const server = app.listen(port);

var options = {
    debug: true,
    path: '/hicetnunc',
    allow_discovery: true,
    alive_timeout: 80000,
}
const peerServer = ExpressPeerServer(server, options);
app.use('/', peerServer)

// peerServer.on('connection', (client) => {
// })
// peerServer.on('disconnect', (client) => {
// })