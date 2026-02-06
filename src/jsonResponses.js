const fs = require('fs');
const resp = require('./respond.js')

const index = fs.readFileSync(`${__dirname}/../client/client.html`)
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

function getIndex(request, response) {
    resp.respond(request, response, 200, index, 'text/html');
}
function getCSS(request, response) {
    resp.respond(request, response, 200, css, 'text/css');
}
//wait i can set the type in here right
//nah but i have to parse it anyway
//maybe i could make my own parser?
function getSuccess(request, response) {
    //const type = request.headers.accept;
    resp.respond(request, response, 200)
}

module.exports = {
    getIndex,
    getCSS,
    getSuccess,
}