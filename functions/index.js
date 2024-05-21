const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);

const rough = require('roughjs');

const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");

const fontWidth = 16 * 0.6;
const fontSize = 16;
const maxTagSize = 30;

initializeApp();

exports.generateTag = onRequest((req, res) => {
    var text = req.query.title;
    var color = '#BEEDF3';
   
    let svgXML = xmlSerializer.serializeToString(createSVG(text, color));
    
    res.type('application/xml');
    res.set('Content-Type', 'image/svg+xml');
    res.send(svgXML);
});


function createSVG(text, color) {
    if(!text || text.length == 0) {
        text = '?';
    }

    if(text.length > maxTagSize) {
        text = text.substr(0, maxTagSize);
    }

    text = text.trim().toUpperCase();

    var textLength = text.length;

    var width = (fontWidth * textLength) + fontWidth;
    var height = fontSize * 1.5;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rc = rough.svg(svg);
    
    var tagName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tagName.setAttribute("x", (fontWidth / 2));
    tagName.setAttribute("y", fontSize + 1);
    tagName.setAttribute('style', 'font-family:monospace;font-weight:bold;font-size:'+fontSize+'px;');
    tagName.textContent = text;

    var rectangle = rc.rectangle(0, 0, width , height, {roughness: 0, fill : color, fillStyle: 'solid', stroke: '#8BD8E2'});
    
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.appendChild(rectangle);
    svg.appendChild(tagName);
    return svg;
}