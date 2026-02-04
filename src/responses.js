const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`)
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

function respond(request, response, status, content, type) {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    response.write(content);
    response.end();
}

function getIndex(request, response) {
    respond(request, response, 200, index, 'text/html');
    respond(request, response, 200, css, 'text/css');
}
function getSuccess(request, response) {
    const type = request.headers.accept;
    respond(request, response, 200)
}

module.exports = {
    getIndex,
}