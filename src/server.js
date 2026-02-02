const http = require('http')
const respHandler = require('./responses.js')

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    index: respHandler.getIndex,
};

function onRequest(request, response) {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    
    //handler
    const handler = urlStruct[parsedUrl.pathname];
    if (handler) handler(request, response);
    else urlStruct.index(request, response);
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`)
})