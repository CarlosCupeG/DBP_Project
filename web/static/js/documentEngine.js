var controlledEvent = false;
var controlledKey = false;
var msg = ''

window.onload = function() {
    document.onkeypress = onKeyPress;
    document.onkeydown = onKeyDown
    document.onkeyup = onKeyUp;
}

function onKeyPress(evObject) {

    var character = String.fromCharCode(evObject.which);

    if (evObject.which!=0 && evObject.which!=8) {
        ;
        if (evObject.which==32) {
            msg += "&nbsp" ; }
        else if (evObject.which==13) {
            msg += "<br/>"; }
        else if (evObject.which==60) {
            msg += "<span><</span>"; }
        else {
            msg += character; }
        control.innerHTML = msg; }
    controlledEvent=true;
}


function onKeyDown(evObject) {

    var key = evObject.keyCode;

    if (key == 8) {
        if (msg.substring(msg.length - 5, msg.length) == "<br/>" || msg.substring(msg.length - 5, msg.length) == "&nbsp") {
            msg = msg.substring(0, msg.length - 5); }
        else if (msg.substring(msg.length - 14, msg.length) == "<span><</span>") {
            msg = msg.substring(0, msg.length - 14); }
        else {
            msg = msg.substring(0, msg.length - 1); }

        control.innerHTML = msg; }
    console.log(msg);
    controlledEvent=true;
}


function onKeyUp(evObject) {

}





function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}

selectElementText(document.getElementById("someElement"));
selectElementText(elementInIframe, iframe.contentWindow);



function seleccionaTexto(element){
    var doc = document,
    text = doc.getElementById(element),
    range,
    selection;
    if(doc.body.createTextRange){ //ms
        range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    }else if(window.getSelection){ //all others
        selection = window.getSelection();
        range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
     selection.addRange(range);
    }
}


/*

window.onload = function() { document.onkeypress = mostrarInformacionCaracter;

document.onkeyup = mostrarInformacionTecla; }

function mostrarInformacionCaracter(evObject)
{
    var msg = ''; var elCaracter = String.fromCharCode(evObject.which);

    if (evObject.which!=0 && evObject.which!=13) {

    msg = 'Tecla pulsada: ' + elCaracter;

    control.innerHTML += msg + '-----------------------------<br/>'; }

    else { msg = 'Pulsada tecla especial';

    control.innerHTML += msg + '-----------------------------<br/>';}

    controlledEvent=true;
}

function mostrarInformacionTecla(evObject)
{
    var msg = ''; var teclaPulsada = evObject.keyCode;

    if (teclaPulsada == 20) { msg = 'Pulsado caps lock (act/des mayúsculas)';}

    else if (teclaPulsada == 16) { msg = 'Pulsado shift';}

    else if (controlledEvent == false) { msg = 'Pulsada tecla especial';}

    if (msg) {control.innerHTML += msg + '-----------------------------<br/>';}

    controlledEvent = false;

}

*/



//$(function()
//{
//});