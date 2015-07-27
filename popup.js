
var website = '';

$('document').ready(function(){
	var addColumn = function(){
		$('tr').first().append('<th class="column container-fluid">\
			<div class="controls row-fluid controls-row">\
				<input type="text" class="span12 colName" placeholder="Field" val="Field '+$('tr th').length+'"></input>\
			</div>\
			<div class="controls row-fluid controls-row">\
			  <input type="text" class="span12 colSelectorInput" placeholder="Selector"></input>\
			</div>\
			<div class="controls row-fluid controls-row">\
			  	<select class="colTypeSelect">\
					<option id="text" value="text">Text</option>\
					<option id="html" value="html">HTML</option>\
					<option id="attr" value="attr">Attribute</option>\
				</select>\
				<input type="text" class="attributeInput" placeholder="Attribute"></input>\
				</div>\
			<div class="controls row-fluid controls-row">\
				<a id="deleteCol" href="#" class="deleteColumn btn">&times</a>\
				</div>\
			</th>');
		var thisCol = $('tr th:last');
		// $(thisCol).find('.edit').editable(function(value,settings){
	 // 		return value;
	 // 	});
		$(thisCol).find('.attributeInput').hide();
		$(thisCol).find('.colName').change(reloadData);
	 	$(thisCol).find('.colSelectorInput').change(reloadData);
	 	$(thisCol).find('.attributeInput').change(reloadData);
	 	$(thisCol).find('.colTypeSelect').change(function(e){
	 		if($(this).find('option:selected').attr('value') == 'attr'){
	 			$(this).parent().find('.attributeInput').show();
	 		}
	 		else{
	 			$(this).parent().find('.attributeInput').hide();
	 		}
	 	});
	 	$(thisCol).find('.colTypeSelect').change(reloadData);
	 	$(thisCol).find('.deleteColumn').click(function(e){
	 		e.preventDefault();
	 		var ndx = $(this).parent().parent().index() + 1;
	 		$('td:nth-child('+ndx+')').remove();
	 		$('th:nth-child('+ndx+')').remove();
	 		reloadData();
	 	});
	 	$(thisCol).find('.deleteColumn').click(trackButton);
	 	return thisCol;
	};
	$('#addColumn').click(function(e){
		e.preventDefault();
		addColumn();
	});
	var generateKeys = function(){
		keys = [];
		$.each($('.column'), function(){
			console.log(this);
			var toPush = {
				title: $(this).find('.colName').val(),
				selector: $(this).find('.colSelectorInput').val(),
				attr : $(this).find('.colTypeSelect option:selected').val(),
				attr_value: $(this).find('.attributeInput').val()
			};
			keys.push(toPush)
		});
	};
	//text = the file content, name = the name of the file
	//Watch out for odd characters like '-' or other things... it chokes.
	var makeDownloadLink = function(text, name){
		var html = '<a id="downloadLink" href="data:application/octet-stream;base64,'+window.btoa(text)+'" download="'+name+'">'+name+'</a>';
		return html;
	}
	var generateView = function(resp){
		$('thead tr.column').remove();
		$('tbody').html();
		var data = resp;
		if(data){
			var selector = data.selector;
			console.log(data.keys);
			$('#selectorInput').val(selector);

			$.each(data.keys, function(){
				console.log("Here is a key");
				console.log(this);
				var thisCol = addColumn();
				//thisCol.find('.colTypeSelec').val(this.selector);
				console.log(thisCol);
				thisCol.find('.colName').val(this.title);
				thisCol.find('.colSelectorInput').val(this.selector);
				thisCol.find('.colTypeSelect').val(this.attr);
				// console.log('attr is '+t)
				// thisCol.find('.colTypeSelect option#'+this.attr).attr('selected','selected');
				thisCol.find('.attributeInput').val(this.attr_value);
				

			});
			reloadData();
		}

		
	};
	var reloadData = function(e){
		// e.preventDefault();
		
		chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
		  //Be aware 'tab' is an array of tabs even though it only has 1 tab in it
		  generateKeys();
		  console.log('loading data');
		  console.log(keys);
		  var url = tab[0].url;
		  var pathArray = url.split( '/' );
		  var host= pathArray[2];
		  website = host;
		  var toSend = {selector:$('#selectorInput').val(), keys:keys};
		  localStorage.setItem(host, JSON.stringify(toSend));
		  console.log("Saving data to "+host);
		  chrome.tabs.sendMessage(tab[0].id,JSON.stringify(toSend), function(response){
		    console.log(response);
		    var resp = (typeof response === 'string')? JSON.parse(response) : response;
		    data = resp.data;
		    var columns = [];
		    $.each($('.column'), function(){
		    	columns.push($(this).find('.colName').val());
		    });
		    $('tbody').html('');
		    $.each(data, function(){
		    	var htmlToAppend = '<tr>';
		    	var thisData = this;
		    	$.each(columns, function(){
		    		htmlToAppend = htmlToAppend + '<td>'+thisData[this]+'</td>';
		    	});
		    	htmlToAppend = htmlToAppend + '</tr>';
		    	$('tbody').append(htmlToAppend);
		    	$('tbody tr').last().hover(function(e){
		    		// chrome.tabs.sendMessage(tab[0].id,JSON.stringify(toSend), function(response){

		    		// });

		    	}, function(e){

		    	})
		    });
		    $('#downloadJSON').attr('href','data:application/octet-stream;base64,'+window.btoa(unescape(encodeURIComponent(JSON.stringify(resp.json, null, '\t')))));
			$('#downloadCSV').attr('href','data:application/octet-stream;base64,'+window.btoa(unescape(encodeURIComponent(resp.csv))));
		  });
		});
	};

	$('#selectorInput').change(reloadData);
	chrome.tabs.query({'active': true,'currentWindow':true},function(tab){
		  //Be aware 'tab' is an array of tabs even though it only has 1 tab in it
		  var url = tab[0].url;
		  var pathArray = url.split( '/' );
		  var host= pathArray[2];
		  var data = localStorage.getItem(host);
		  if(typeof data !== 'undefined'){
		  	generateView(JSON.parse(data));	
		  }
		});

	$('#downloadJSON, #downloadCSV, #addColumn').click(trackButton);
		  


});
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42111617-1']);
_gaq.push(['_trackPageview']);
function trackButton(e) {
    _gaq.push(['_trackEvent', e.target.id, 'clicked', website]);
  };

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
