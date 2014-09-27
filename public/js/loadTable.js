var dataColumns = ['bookingid', 'name', 'contactNumber', 'email', 'date', 'meetingName', 'numberOfAttendees', 'prepStartTime', 'startTime', 'endTime', 'roomRequested'];

function loadTable() {
	$.ajax({
		type: "GET",
        crossDomain: true,
        url: "http://localhost:4567/api/booking",
		contentType: 'application/json',
        dataType: 'json',
        success: function (response, textStatus, xhr){
        	console.log(response);
        },
        error: function(xhr, textStatus, errorThrown){
			console.log('Error: ' + errorThrown + textStatus);
        }
	}).done(function(res){

		$('#example').dataTable( {
		  	"data": res,
			"columns": [
				{"data": "bookingid"},
				{"data": "name"},
				{"data": "contactNumber"},
				{"data": "email"},
				{"data": "date"},
				{"data": "meetingName"},
				{"data": "numberOfAttendees"},
				{"data": "prepStartTime"},
				{"data": "startTime"},
				{"data": "endTime"},
				{"data": "roomRequested"}
			]
		});






		var table = $("#tableBody");
		console.log(res[0]['name']+dataColumns.length);
		for (var k=0;k<res.length;k++){

			var row = $('<tr/>');
			for(var i=0; i<dataColumns.length;i++){
				var cell = $('<td/>');
				cell.text(res[k][dataColumns[i]]);
				console.log(cell);
				row.append(cell);
			}
			var deleteButton = $('<button/>').attr('type', 'button').addClass('delete-button btn btn-danger btn-sm').text('Delete');
			var modifyButton = $('<button/>').attr('type', 'button').addClass('modify-button btn btn-primary btn-sm').text('Modify');
			row.append(modifyButton).append(deleteButton);
			table.append(row);

		}

		$('.delete-button').on('click', function() {

			var bookingid = $(this).parent().children().eq(0).text();

			$.ajax({
				type: "DELETE",
                crossDomain: true,
                url: "http://localhost:4567/api/booking",
                data: JSON.stringify( {bookingid: bookingid}),
                contentType: 'application/json',
                dataType: 'json',
                success: function (response, textStatus, xhr){
                	console.log(response);
                },
                error: function(xhr, textStatus, errorThrown){
					console.log('Error: ' + errorThrown + textStatus);
                }
			}).done(function(res){
				console.log('done');
			});
		});

		$('.modify-button').on('click', function() {
			$('#mPsaveButton').show();

			$(this).parent().addClass('modified');
			var parameters = new Array();

			$.each($(this).parent().find('td+td'),function(cell){
				var text = $(this).text();
				parameters.push($(this).text());
				var input = $('<input>').attr('type', 'text').addClass('form-control modify-input');
				$(this).empty();
				$(this).append(input.val(text));

			});
			console.log(parameters);
		});

		$('#mPsaveButton').on('click', function() {
			var json = new Array();
			$.each($('#tableBody').find('.modified'),function(row){
				var bookingid = $(this).find('td:first').text();
				var parameters = new Array(bookingid);
				$.each($(this).find('td+td > input'), function(){
					parameters.push($(this).val());
				});
				var data = {};
				for(var i = 0; i<dataColumns.length; i++){
					data[dataColumns[i]] = parameters[i];
				}
				json.push(data);
			});
			console.log(json);

			$.ajax({
				type: "PUT",
                crossDomain: true,
                url: "http://localhost:4567/api/booking",
                data: JSON.stringify(json),
                contentType: 'application/json',
                dataType: 'json',
                success: function (response, textStatus, xhr){
                	console.log(response);
                },
                error: function(xhr, textStatus, errorThrown){
					console.log('Error: ' + errorThrown + textStatus);
                }
			}).done(function(res){
				console.log('done');
				$('#mPsaveButton').hide();
				$.each($('.modified > td+td'), function(){
					var text = $(this).find('input').val();
					$(this).empty();
					$(this).text(text);
				});
				$('.modified').removeClass('modified');
				var successText = $('<div>').addClass().text('Update Successful');

			});

		});

	});
}