var current_document_id;
var current_user_id;
var cursor_pointer = '<span id=Cursor.>|</span>';
var user_pointer;
var other_pointer;
var msg;
var cursor_pos;
var init = true;
var last_change = 0;
var con = false
var pre_msg;
var pos_msg;


var socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function() {
    socket.emit('client_connected', {data: 'New client!'});
});


window.onload = function() {

    $.getJSON("/current_user", function(data)
    {
        current_user_id = data['id'];
        user_pointer = cursor_pointer.replace("Cursor.", current_user_id);
    });

    $.getJSON("/current_document", function(data)
    {
        current_document_id = data['id'];
        msg = data['content'];
        $('#document-name').html(data['name']);
        control.innerHTML = msg;

        var temp_text = "Shared with: ";
        $.getJSON("/user_document/" + current_document_id, function(data)
        {
            var i = 0;
            $.each(data, function()
            {
                temp_text = temp_text + data[i].first_name + ", ";
                i++;
            });
            $('#doc-info').html(temp_text);
        });
    });

    document.onkeypress = onKeyPress;
    document.onkeydown = onKeyDown;
    getChanges();
}




function getChanges() {

    $.getJSON('/document_change/' + last_change, function(data)
    {

        var i = 0;
        var character;
        $.each(data, function()
        {
            if (data[i].user != current_user_id || init)
            {
                other_pointer = cursor_pointer.replace('Cursor.', data[i].user);
                cursor_pos = msg.replace(other_pointer, ".TextNative").search(".TextNative");

                pre_msg = msg.substring(0, cursor_pos);
                pos_msg = msg.substring(cursor_pos + other_pointer.length, msg.length);

                if (last_change < data[i].id) { last_change = data[i].id; }
                if (data[i].event == 'write') {
                    msg = msg.replace(other_pointer, data[i].val + other_pointer);

                } else if (data[i].event == 'delete') {
                    pre_msg = pre_msg.substring(0, pre_msg.length - parseInt(data[i].val));
                    pos_msg = msg.substring(cursor_pos, msg.length);
                    msg = pre_msg + pos_msg;
                } else if (data[i].event == 'left') {
                    character = pre_msg.substring(pre_msg.length - parseInt(data[i].val), pre_msg.length);
                    pre_msg = pre_msg.substring(0, pre_msg.length - parseInt(data[i].val));
                    pos_msg = character + pos_msg;
                    msg = pre_msg + other_pointer + pos_msg;
                } else if (data[i].event == 'right') {
                    character = pos_msg.substring(0, parseInt(data[i].val));
                    pre_msg = pre_msg + character;
                    pos_msg = pos_msg.substring(parseInt(data[i].val), pos_msg.length);
                    msg = pre_msg + other_pointer + pos_msg;
                }
                control.innerHTML = msg;
            }
            i++;
        });
        init = false;
    });

}


function onKeyPress(evObject) {

    var character = String.fromCharCode(evObject.which);

    cursor_pos = msg.replace(user_pointer, ".TextNative").search(".TextNative");

    pre_msg = msg.substring(0, cursor_pos);
    pos_msg = msg.substring(cursor_pos + user_pointer.length, msg.length);

    if (evObject.which!=0 && evObject.which!=8) {

        if (evObject.which==32) {
            pre_msg += "&nbsp" ;
            createChange("&nbsp", 'write'); }
        else if (evObject.which==13) {
            pre_msg += "<br/>";
            createChange("<br/>", 'write'); }
        else if (evObject.which==60) {
            pre_msg += "<span><</span>";
            createChange("<span><</span>", 'write'); }
        else {
            pre_msg += character;
            createChange(character, 'write'); }
    }
    msg = pre_msg + user_pointer + pos_msg;
    control.innerHTML = msg;
}


function onKeyDown(evObject) {

    var key = evObject.keyCode;
    var len_pre = 1;
    var len_pos = 1;
    var character;

    cursor_pos = msg.replace(user_pointer, ".TextNative").search(".TextNative");

    pre_msg = msg.substring(0, cursor_pos);
    pos_msg = msg.substring(cursor_pos + user_pointer.length, msg.length);

    if (key == 8 || key == 37 || key == 39)
    {
        if (pre_msg.substring(pre_msg.length - 5, pre_msg.length) == "<br/>" || pre_msg.substring(pre_msg.length - 5, pre_msg.length) == "&nbsp") {
            len_pre = 5; }
        else if (pre_msg.substring(pre_msg.length - 14, pre_msg.length) == "<span><</span>") {
            len_pre = 14; }
        else if (pre_msg.substring(pre_msg.length - 9, pre_msg.length) == ">|</span>") {
            len_pre = 24; }


        if (pos_msg.substring(0, 5) == "<br/>" || pos_msg.substring(0, 5) == "&nbsp") {
            len_pos = 5;
             }
        else if (pos_msg.substring(0, 14) == "<span><</span>") {
            len_pos = 14; }
        else if (pos_msg.substring(0, 9) == "<span id=") {
            len_pos = 24; }


        if (key == 8) {
            pre_msg = pre_msg.substring(0, pre_msg.length - len_pre);
            createChange(String(len_pre), 'delete'); }
        if (key == 37) {
            character = pre_msg.substring(pre_msg.length - len_pre, pre_msg.length);
            pre_msg = pre_msg.substring(0, pre_msg.length - len_pre);
            pos_msg = character + pos_msg;
            createChange(String(len_pre), 'left'); }
        if (key == 39) {
            character = pos_msg.substring(0, len_pos);
            pre_msg = pre_msg + character;
            pos_msg = pos_msg.substring(len_pos, pos_msg.length);
            createChange(String(len_pos), 'right'); }

        msg = pre_msg + user_pointer + pos_msg;
        control.innerHTML = msg;
    }
}


function createChange(value, event)
{
    socket.emit('change_out', {
        "value": value,
        "event": event,
        "user": current_user_id
    });
}


$(document).ready(function() {
    socket.on('alert', function(data) {
        if (data == current_user_id) {return;}

        getChanges();
        console.log(data);
        setTimeout(function(){}, 1500);

    });
});