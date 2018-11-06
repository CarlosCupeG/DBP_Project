var controlledEvent = false;
var controlledKey = false;
var current_document_id;
var current_user_id;
var cursor_pointer = '<span id=Cursor.>|</span>';
var msg = '';
var pre_msg = '';
var pos_msg = '';

window.onload = function() {

    $.getJSON("/current_document", function(data)
    {
        current_document_id = data['id'];
        control.innerHTML = data['content'];

        msg = data['content'];
    });

    $.getJSON("/current_user", function(data)
    {
        current_user_id = data['id'];
        cursor_pointer = cursor_pointer.replace("Cursor.", current_user_id);
    });

    document.onkeypress = onKeyPress;
    document.onkeydown = onKeyDown;
}


function getDocument()
{
    $.getJSON('/current_document', function(data)
    {
        msg = data['content'];
        control.innerHTML = msg;
        getDocument();
    });
}
//setInterval(getDocument() ,10);



function onKeyPress(evObject) {
    var s = $('.Editor-editor').wysiwyg();
    var n = $('.Editor-editor').val();
    console.log(s);

    var character = String.fromCharCode(evObject.which);
    var cursor_pos = msg.search(cursor_pointer);

    pre_msg = msg.substring(0, cursor_pos);
    pos_msg = msg.substring(cursor_pos + cursor_pointer.length, msg.length);

    if (evObject.which!=0 && evObject.which!=8) {

        if (evObject.which==32) {
            updateDocument("&nbsp", "write", 1); }
        else if (evObject.which==13) {
            updateDocument("<br/>", "write", 1); }
        else if (evObject.which==60) {
            updateDocument("<span><</span>", "write", 1); }
        else {
            updateDocument(character, "write", 1); }
    }

    controlledEvent=true;
}


function onKeyDown(evObject) {

    var key = evObject.keyCode;
    var len_pre = 1;
    var len_pos = 1;
    var character;

    var cursor_pos = msg.search(cursor_pointer);

    pre_msg = msg.substring(0, cursor_pos);
    pos_msg = msg.substring(cursor_pos + cursor_pointer.length, msg.length);

    if (key == 8 || key == 37 || key == 39)
    {
        console.log(pre_msg.substring(pre_msg.length - 9, pre_msg.length));
        if (pre_msg.substring(pre_msg.length - 5, pre_msg.length) == "<br/>" || pre_msg.substring(pre_msg.length - 5, pre_msg.length) == "&nbsp") {
            len_pre = 5; }
        else if (pre_msg.substring(pre_msg.length - 14, pre_msg.length) == "<span><</span>") {
            len_pre = 14; }
        else if (pre_msg.substring(pre_msg.length - 9, pre_msg.length) == ">|</span>") {
            len_pre = 24; }

        if (pos_msg.substring(0, 5) == "<br/>" || pos_msg.substring(0, 5) == "&nbsp") {
            len_pos = 5; }
        else if (pos_msg.substring(0, 14) == "<span><</span>") {
            len_pos = 14; }
        else if (pos_msg.substring(0, 9) == "<span id=") {
            len_pos = 24; }


        if (key == 8) {
            updateDocument("", "delete", len_pre); }
        if (key == 37) {
            updateDocument("", "left", len_pre); }
        if (key == 39) {
            updateDocument("", "right", len_pos); }
    }
    controlledEvent=true;
}


function updateDocument(value, event, len)
{
    $.ajax({
        url: '/document/' + current_document_id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "value": value,
            "event": event,
            "len": len
            }),
        });
}
