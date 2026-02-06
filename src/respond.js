//making this so all the response files can use this general function
function respond(request, response, status, content, type) {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    response.write(content);
    response.end();
}

module.exports = {
    respond,
}