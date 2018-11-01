
var documentTemplate =
        '<div class="col-md-4">' +
          '<div class="card mb-4 shadow-sm">' +
            '<img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_166c5a8b476%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_166c5a8b476%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2295%22%20y%3D%22119.1%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true" style="height: 225px; width: 100%; display: block;">' +
            '<div class="card-body">' +
              '<p class="card-text">Text.</p>' +
              '<div class="d-flex justify-content-between align-items-center">' +
                '<div class="btn-group">' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary">View</button>' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>' +
                '</div>' +
                '<small class="text-muted">Date.</small>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

var current_user_id;
var current_document_id;

$.getJSON("/current_user", function(data)
{
    current_user_id = data['id'];
    //$('#currentUser').html(data['username']);
    console.log(current_user_id);
    documentUser();
});


$('#exampleModal').on('show.bs.modal')


function documentUser()
{
    $.getJSON("/document_user/" + String(current_user_id), function(data)
    {
        console.log("/document_user/" + String(current_user_id));
        var i = 0;
        $.each(data, function()
        {
            documentContainer.innerHTML += documentTemplate.replace("Text.", data[i].name).replace("Date.", "HOY");
            i++;
        });
    });
}


function createDocument()
{
    var name = document.getElementById('recipient-name').value;
    console.log(name);
    $.ajax({
        url: '/document',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "user": current_user_id,
            "name": name,
    	})
	});

}


function getDocument()
{
}


function findDocument(id)
{
    $.ajax({
        url: '/document/' + current_document_id,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "pos_x": "Posicion en x",
            "pos_y": "Posicion en y"
    	})
	});

	currentDocument();
}


function currentDocument()
{
    $.getJSON("/current_document", function(data)
    {
        current_document_id = data['id'];
        //$('#currentServer').html(data['id']);
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

