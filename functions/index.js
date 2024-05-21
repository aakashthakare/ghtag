const { DOMImplementation, XMLSerializer } = require('xmldom');
const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);

const rough = require('roughjs');

const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");

initializeApp();

exports.generateTag = onRequest((req, res) => {
    var text = req.query.title.trim().toUpperCase();
    var color = '#BEEDF3';
   
    let svgXML = xmlSerializer.serializeToString(createSVG(text, color));
    
    res.type('application/xml');
    res.set('Content-Type', 'image/svg+xml');
    res.send(svgXML);
});


function createSVG(text, color) {
    const factor = 12;
    
    if(text.length > 10) {
        text = text.substr(0, 10);
    }

    var textLength = text.length;

    var width = (textLength * factor * 0.6) + factor;
    var height = factor + (factor * 0.5);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rc = rough.svg(svg);
    
    var tagName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tagName.setAttribute("x", (factor * 0.6));
    tagName.setAttribute("y", factor);
    tagName.setAttribute('style', 'font-size:'+factor+'px;padding:1px;font-family:monospace;font-weight:bold;background:'+color+';');
    tagName.textContent = text;

    var rectangle = rc.rectangle(0, 0, width, height, {roughness: 0, fill : color, fillStyle: 'solid', stroke: 'white'});
    rectangle.appendChild(tagName);

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/svg");
    svg.appendChild(rectangle);
    return svg;
}