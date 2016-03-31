DataLoadM = {

	loadRawText:
		function(path, CALLBACK){
			$(document).ready(function() {
				$.ajax({
					type: "GET",
					url: path,
					dataType: "text",
					success: CALLBACK
				});
			});
		}

}
