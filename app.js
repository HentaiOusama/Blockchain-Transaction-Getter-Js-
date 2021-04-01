const express = require('express');
const socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, () => {
  console.log('Listening to prot 4000');
});

// Static files
app.use(express.static('./public'));
/*When the website is opened, the localhost:4000/ is same as
* localhost:4000/index.html. So, the above middleware links
* the request to the respective index.html file in ./public
* folder.
*
* This is THE Entry point of the WEBSITE (not the app)*/

// Socket setup
var io = socket(server);

io.on('connection', (socket) => {
  console.log('Socket connection made.', socket.id);
});
