
var current_user_id;
var current_server_id;

function getPosition()
{

}


function createServer()
{
    $.ajax({
        url: '/server',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "admin": current_user_id,
            "status": "Online"
    	})
	});

	$.getJSON("/current_server", function(data)
    {
        current_server_id = data['id'];
        $('#currentServer').html(data['id']);
    });

}


function findServer(id)
{
    $.ajax({
        url: '/server/' + current_server_id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "pos_x": "Posicion en x",
            "pos_y": "Posicion en y"
    	})
	});

	$.getJSON("/server/" + id, function(data)
    {
        current_server_id = data['id'];
        $('#currentServer').html(data['id']);
    });

}


$.getJSON("/server", function(data)
{
    var i = 0;
    $.each(data, function()
    {
        user_from = current_from_id;
        user_to = data[i]['id'];

        if (data[i]['id'] != current_from_id)
        {
        var text ="<li class='contact' onclick='get_message(User_from., User_to.)'><div class='wrap'><div class='meta'><p class='name'>Name.</p><p class='preview'>Text.</p></div></div></li>";
        $('.contact_list').append(text.replace("Name.", data[i]['username']).replace("User_from.", user_from).replace("User_to.", user_to));
        }
        i = i + 1;
    })

});

