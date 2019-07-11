// code away!
require('dotenv').config();

const server = require('./server');
const port = process.env.PORT || 6000;

server.listen(port, ()=> {
    console.log(`server running on port ${port}`);
});