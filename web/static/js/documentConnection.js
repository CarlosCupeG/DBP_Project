var documentTemplate =
        '<div class="col-md-4">' +
          '<div class="card mb-4 shadow-sm">' +
            '<img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_166c5a8b476%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_166c5a8b476%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2295%22%20y%3D%22119.1%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true" style="height: 225px; width: 100%; display: block;">' +
            '<div class="card-body">' +
              '<p class="card-text">Text.</p>' +
              '<div class="d-flex justify-content-between align-items-center">' +
                '<div class="btn-group">' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="currentDocument(\'Id.\')">Edit</button>' +
                  '<button type="button" class="btn btn-sm btn-outline-secondary" onclick="deleteDocument(\'Id.\')">Delete</button>'
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
    documentUser();
});

$('#exampleModal').on('show.bs.modal')


function documentUser()
{
    $.getJSON("/document_user/" + String(current_user_id), function(data)
    {
        var i = 0;
        $.each(data, function()
        {
            documentContainer.innerHTML += documentTemplate.replace("Text.", data[i].name).replace("Date.", data[i].date).replace("Id.", data[i].id).replace("Id.", data[i].id);
            i++;
        });
    });
    document.getElementById("search-value").value = "";
}


function createDocument()
{
    var name = "";

    while (name == "")
    {
        name = document.getElementById("recipient-name").value;
    }


    $.ajax({
        url: '/document',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "user": current_user_id,
            "name": name
    	}),
	});
}


function deleteDocument(id)
{
    $.ajax({
        url: '/document/' + id,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            $('#documentContainer').text("");
	        location.reload();
        }
	});
}

function currentDocument(id)
{
    $.ajax({
        url: '/current_document',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            document: id
    	}),
    	success: function(data) {
	        location.href = "/editor";
        }
	});
}


function addUserDocument()
{
    var id = "";

    while (id == "")
    {
        id = document.getElementById("search-value").value;
    }

    $.ajax({
        url: '/document_user',
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            "document_id": id
    	}),
    	success: function(data) {
    	    location.reload();
    	}
	});



}
