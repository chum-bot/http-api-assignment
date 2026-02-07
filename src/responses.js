const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

function respond(request, response, status, content, type) {
    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    response.write(content);
    response.end();
}

//making my own message builder/parser
function buildResponse(message, type, errorId = '') {
    let parsedResp = '';
    if(type === "text/xml") {
        let respXML = `<response>`;
        respXML += `<message>${message}</message>`;
        if(errorId !== ""){
            respXML += `<id>${errorId}</id>`
        }
        respXML += `</response>`;
        parsedResp = respXML;
    }
    else if (type === "application/json") {
        const jsonResp = { message }; //message: <the message>
        
        if(errorId !== ""){
            jsonResp.id = errorId;
        }
        parsedResp = JSON.stringify(jsonResp);
    }
    return parsedResp;
}

function getIndex(request, response) {
    respond(request, response, 200, index, 'text/html');
}
function getCSS(request, response) {
    respond(request, response, 200, css, 'text/css');
}
function getOther(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    const message = buildResponse("The page you were looking for was not found.", type, "notFound");
    respond(request, response, 404, message, type)
}
function getSuccess(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    const message = buildResponse("This is a successful response", type);
    respond(request, response, 200, message, type)
}
async function getBadRequest(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    await request.query;

    if(!request.query || request.query.valid !== "true"){
        const message = buildResponse("Missing valid query parameter set to true", type, 'badRequest');
        return respond(request, response, 400, message, type)
    }
    else if(request.query.valid === 'true'){
        const message = buildResponse("This request has the required parameters.", type);
        return respond(request, response, 200, message, type)
    }
}
async function getUnauthorized(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    await request.query;
    //this felt weird to do but
    //this in conjunction with the client.html query stuff
    //allows the user to type in the unauthorized/bad request queries at the top of the page
    //and it would actually send the success messages on the main page
    //i don't think this was part of the assignment, nor do i think it would be practical in an irl application
    //(because who types queries in manually)
    //but hey i guess i can do that now

    if(!request.query || request.query.loggedIn !== 'yes'){
        const message = buildResponse("Missing loggedIn query parameter set to yes", type, 'unauthorized');
        return respond(request, response, 401, message, type)
    }
    else if(request.query.loggedIn === "yes"){
        const message = buildResponse("You have successfully viewed the content.", type);
        return respond(request, response, 200, message, type)
    }
}
function getForbidden(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    const message = buildResponse("You do not have access to this content.", type, 'forbidden');
    respond(request, response, 403, message, type)
}
function getInternal(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    const message = buildResponse("Internal Server Error. Something went wrong.", type, 'internalError');
    respond(request, response, 500, message, type)
}
function getNotImplemented(request, response) {
    const type = request.acceptedTypes.includes('text/xml') ? request.acceptedTypes[0] : 'application/json';
    const message = buildResponse("A get request for this page has not been implemented yet. Check again later for updated content.", type, 'notImplemented');
    respond(request, response, 501, message, type)
}

module.exports = {
    getIndex,
    getCSS,
    getSuccess,
    getOther,
    getNotImplemented,
    getBadRequest,
    getForbidden,
    getInternal,
    getUnauthorized
}
