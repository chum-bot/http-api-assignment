const http = require('http')
const respHandler = require('./responses.js')

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': respHandler.getIndex,
    index: respHandler.getIndex,
    '/style.css': respHandler.getCSS,
    '/success': respHandler.getSuccess,
    '/internal': respHandler.getInternal,
    '/forbidden': respHandler.getForbidden,
    '/badRequest': respHandler.getBadRequest,
    '/unauthorized': respHandler.getUnauthorized,
    '/notImplemented': respHandler.getNotImplemented,
};

function onRequest(request, response) {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    if(request.headers.accept) {
        request.acceptedTypes = request.headers.accept.split(',');
    }
    request.query = Object.fromEntries(parsedUrl.searchParams);
    //handler for urls
    const handler = urlStruct[parsedUrl.pathname];
    if(handler) {
        handler(request, response);
    }
    else if(!(Object.keys(urlStruct).includes(parsedUrl.pathname))){
        respHandler.getOther(request, response)
    }
    else {
        urlStruct.index(request, response)
    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
})