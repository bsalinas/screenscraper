var csv = ''; 
var json = [];
var keys = [
	{
		selector : '.name',
		title: 'name'	
	},
	{
		selector : '.name',
		title: 'name'	
	},
	{
		selector : 'img',
		attr: 'src',
		title: 'img'	
	},
	{
		selector : '.handle',
		title: 'handle'	
	},
	{
		selector : '.org',
		title: 'organization'	
	}
];
var screenScrape = function(selector, options){
	csv = '';
	$.each(options,function(){
		csv = csv + '"'+this.title+'",';
	});
	//Remove the last comma
	csv = csv.substring(0,csv.length-1);
	//Add our break line
	csv = csv + '\n';

	json=[];
	// console.log($(selector));
	// console.log(selector);
	//selector is the string from the top box.
	//Grab all of those from the page.
	$.each($(selector), function(){
		//save a copy of this element from the page.
		var $thisElement = $(this);
		//thisJSON will store the object that we construct
		var thisJSON = {};
		/*
			options is the array of keys
			[
				{
					//This will grab the text of the .name
					title: 'My Name',
					selector: '.name',
					attr : 'text', //or html or attr
					attr_value: ''
				},
				{
					//This will grab the src attribute of the img
					title: 'ImgSource',
					selector: 'img',
					attr : 'attr', 
					attr_value: 'src'
				},
				{
					//This one will grab the html from all the div.content
					title: 'HTMLExample',
					selector: 'div.content',
					attr : 'html', 
					attr_value: ''
				}
			]

		*/
		$.each(options, function(){
			//For each of the columns we are looking up.
			//First, grab our element from the DOM that we're looking for.
			var $thisValue = $thisElement.find(this.selector);
			
			//If they didn't specify an attribute type (shouldn't happen), default to 'text'.
			var attr = this['attr']? this['attr'] : 'text';
			console.log('attr is '+attr);
			//Start out by just grabbing the text.
			var toReturn = $thisValue.text();
			if(attr == 'text'){
				//This is redundant, but we know they want the text so grab it again.
				toReturn = $thisValue.text();
			}
			else{
				//Not text
				if(attr == 'html'){
					//It is html, so grab the HTML.
					toReturn = $thisValue.html();
				}
				else{
					//Not HTML, so assume it is attribute, which is the only one left.
					//In this case, we need to grab the attr_value which might be something like 'src' or 'class' or 'val'
					// console.log("Trying to get an attribute "+this['attr_value']);
					// console.log("value is  "+$thisValue.attr(this['attr_value']));
					//Use the jquery.attr command to grab it.
					toReturn = $thisValue.attr(this['attr_value']);
				}
			}
			//Add the value to our CSV file.
			csv = csv + '"'+toReturn+'",';
			//Also add it to our JSON object with the lookup of the title of this column.
			thisJSON[this.title] = toReturn;
		});
		//Remove the last comma from our CSV
		csv = csv.substring(0,csv.length-1);
		//Add our break line for the CSV
		csv = csv + '\n';
		//Add the object to the JSON array
		json.push(thisJSON);
	});
	//Log it out for debugging purposes once we've finished.
	console.log(csv);
	console.log(json);
}
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var parsed = (typeof request === 'string') ? JSON.parse(request) : request;
	// console.log(parsed);
	screenScrape(parsed.selector, parsed.keys);
	sendResponse(JSON.stringify({data:json, csv:csv, json:json}));
});
