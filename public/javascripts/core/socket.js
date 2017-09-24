// Connect to the Node.js Server
io = io.connect('/');
var socket = io.connect('http://137.74.162.113:8080/');
// (1): Send a ping event with
// some data to the server
