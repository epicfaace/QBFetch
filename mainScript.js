$(function() {
	$("form#reqForm").submit(function(e) {
		e.preventDefault();
		$.get("/fetchEngine?"+$(this).serialize(), processData);
	});
});
function processData(data) {
	var x=$("<div></div>").html(data);
	//console.log(x.text());
	window.stuff=x.text();
	questions=[];
	while (stuff.indexOf("ANSWER: ")!=-1) {
		var qTemp={};
		qTemp.question=stuff.substring(stuff.indexOf("Question: ")+"Question: ".length,stuff.indexOf("ANSWER: "));
		qTemp.answer=stuff.substring(stuff.indexOf("ANSWER: ")+"ANSWER: ".length,stuff.indexOf("Report an Error"));
		if (stuff.indexOf("Result:",stuff.indexOf("Result")+1)==-1) stuff=""; //for last tossup
		stuff=stuff.substring(stuff.indexOf("Result:",stuff.indexOf("Result")+1));
		//console.log(qTemp);
		questions[questions.length]=qTemp;
	}
	//questions={"questions":questions};
	//templating:
	var Source   = $("#questionsTemplate").html();
	var Template = Handlebars.compile(Source);
	$("#mainDiv").html(Template(questions));
	$("#controls").show();
	editBinder();
}
function editBinder() { //binds the content-edit events to the proper td's //actually, also binds mover, deleter, etc.!
	$("td.question").dblclick(function() {
		$(this).attr("contenteditable","true");
	}).blur(function() {
		$(this).attr("contenteditable","false");
	})
	.keypress(function(e) {
	    if(e.which == 13) {
	    	e.preventDefault();
	    	var qText=$(this).text();
	    	var offset=getCaretCharacterOffsetWithin(this);
	    	if (offset>=qText.length-1||offset==0) return; //prevents from pressing enter at the end and making an empty cell, or from selecting everything and 
	    	$(this).html(qText.slice(0,offset))
	    	//if (qText.slice(offset).replace(" ","").length) {
	    		$(this).parent("tr").clone().insertAfter($(this).parent("tr")).children("td.question").html(qText.slice(offset)).focus();
	    		$(this).on("keyup",function() { //so it doesn't create random extra rows (which would be by triggering more keypress events for the new row because the key hasn't keyupped yet!)
	    			$(this).parent("tr").next().children("td.question").focus();
	    		});
	    	//}
	    	editBinder();
	    	console.log("pressed",offset,qText.length);
	    }
	});
	$("td.deleter").click(function() {
		$(this).parent("tr").remove();
	});
	$("td.prioriter").click(function() {
		var current=$(this).siblings("td.question")[0];
		//console.log(current);
		if ($(this).parent("tr").before().length) {
			//ACTUALLY, moving it to the top might not be desirable; maybe a way to mark clues as "done" or "final" so they can go out of the way???
			$(current).addClass("current").parent("tr").insertBefore($("tr").first()); //TODO: should "break off" of the table and slide over everything to go to the top

		}
		//$(this).parent("tr").nextAll("tr").children("td.question").not("current").each(function() {
		$("td.question").not("current").each(function() {
			$(this).parent("tr").insertAfter($(current).parent("tr"));
			while ($(this).parent("tr").next().length) {
				//console.log(current.mywords);
				if (intArr($(this).parent("tr").next().children("td.question")[0].mywords,current.mywords).length>intArr(this.mywords,current.mywords).length) {
					$(this).parent("tr").insertAfter($(this).parent("tr").next());
				}
				else {break;}
			}
		});
		$(current).removeClass("current");
	});
}
function delimitQ() {
	window.contentClues=[];
	$("td.question").each(function() {
		//searching for h.w. bush as answer doesn't work for this algorithm....
		var filtered=$(this).html().replace(/(\r\n|\n|\r)/gm,"").replace(/\!\"/g,"\!\"\.")
			.replace(/\?\"/g,"\?\"\.").replace(/(F|f)or (1|2)(0|5) points/g,"FTP")
			.replace(/\.\"/g,"\"\.").replace(/\((\*|\+)\)/g,"").replace(/\[\*\]/g,"")
			.replace(/  /g," ").split(/([^A-Z])\.\s*/g); //replaces ." with ". ;adds periods after !" and ?"; and removes (*) and [*] and (+) and "  "; and removes \n stuff (not working, fixed in next line); and also removes 'For 10/15/20/25 points,'
		for (var c=0;c<filtered.length-1;c++) {//weird fix
			filtered[c]+=filtered[c+1];
			filtered.splice(c+1,1);
		}
		contentClues=contentClues.concat(filtered);
		if (contentClues[contentClues.length-1]=="") contentClues.splice(contentClues.length-1,1);
	});
	var Source   = $("#cluesTemplate").html();
	var Template = Handlebars.compile(Source);
	$("#mainDiv").html(Template(contentClues));
	editBinder();
	$("td.question:contains('FTP')").addClass("qFTP");
	$("table#mainTbl tbody").sortable({
		axis:"y",
		handle:"td.mover",
		helper:"clone",
	});
}
function orderClues() {
	updateArrayClues();
	window.wordCounts = { };
	var words = contentClues.join("\b").split(/\b/);
	for(var i = 0; i < words.length; i++) {
		wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;
	}
	var pronouns=["all","another","any","anybody","anyone","anything","both","each","either","everybody","everyone","everything","few","he","hers","her","herself","him","himself","his","i","it","itself","many","me","my","mine","more","most","much","myself","neither","nobody","none","nothing","one","others","other","ourselves","ours","our","several","she","some","somebody","someone","something","that","theor","theirs","themselves","them","these","they","this","those","us","we","whatever","what","whichever","which","whoever","whomever","whom","whose","who","yourselves","yourself","yours","your","you","aboard","about","above","across","after","against","along","amid","among","anti","around","before","behind","below","beneath","besides","beside","between","beyond","concerning","considering","despite","down","during","except","excepting","excluding","following","inside","minus","over","past","per","plus","regarding","since","than","through","to","toward","towards","under","underneath","unlike","until","up","upon","versus","via","with","withing","without","near","off","of","onto","on","for","from","in","like","into","but","by","as","at"];
	window.wc={"clues":[],"freqs":[]};
	for (i in wordCounts) {
		var filt=i.substring(1).replace(/ /g,"").replace(/\W|_/,"").toLowerCase();
		if (wordCounts[i]==1||filt==""||filt.length<=3||~pronouns.indexOf(filt)) {
			delete wordCounts[i];
			continue;
		}
		wc.clues.push(i.substring(1));
		wc.freqs.push(wordCounts[i]);
	}
	
	$("td.question").each(function() {
		this.mywords=[];
		for (i in wc.clues) {
			if (~$(this).text().indexOf(wc.clues[i])) {this.mywords.push(wc.clues[i]);}
		}
	});
	$("td.question").each(function() {
		while (true) {
			if (!$(this).parent("tr").next().length) break;
			if ($(this).parent("tr").next().children("td.question")[0].mywords.length>this.mywords.length) {
				//console.log($(this).parent("tr").next().children("td.question")[0].mywords.length+" > "+this.mywords.length);
				$(this).parent("tr").insertAfter($(this).parent("tr").next());
			}
			else {break;}
		}
		while (true) {
			if (!$(this).parent("tr").prev().length) break;
			if ($(this).parent("tr").prev().children("td.question")[0].mywords.length<this.mywords.length) {
				//console.log($(this).parent("tr").prev().children("td.question")[0].mywords.length+" < "+this.mywords.length);
				$(this).parent("tr").insertBefore($(this).parent("tr").prev());
			}
			else {break;}
		}
	});
	for (var q=0;q<=Math.ceil(.04*Math.pow($("td.question").length,2)-1.3*$("td.question").length+30);q++) {
	//for (var q=0;q<=Math.ceil(.009259*Math.pow($("td.question").length,2)-.6852*$("td.question").length+15.593);q++) { //(58,6),(34,2),(52,4) quad-regression
	//for (var q=0;q<=Math.ceil(.0341152*Math.pow(Math.E,.0488873*$("td.question").length));q++) {//exponential fit
	//break;
		$("td.question").addClass("notsorted");
		$("td.question").each(function() {
			$(this).removeClass("notsorted");
			elemwords=this.mywords;
			var max={"elem":null,"counter":0};
			$("td.question.notsorted").each(function() {
				if (this.mywords==elemwords) return;
				var counter=0;
				for (i in this.mywords) {
					if (~elemwords.indexOf(this.mywords[i])) {counter++;}
				}
				if (counter>max["counter"]) {
					max["counter"]=counter;
					max["elem"]=this;
				}
			});
			$(max["elem"]).removeClass("notsorted");
			//$(max["elem"]).siblings("td.mover").text(max["counter"]);
			$(max["elem"]).parent("tr").detach().insertAfter($(this).parent("tr"));
		});
	}
	//TODO: soon add a levDist so that forms of same word will be combined; e.g. discover, discovered, discovery

}
function updateArrayClues() {
	window.contentClues=[];
	$("td.question").each(function() {
		contentClues=contentClues.concat($(this).html());
	});
}
//Damerau–Levenshtein distance algorithm, minified, from: http://stackoverflow.com/questions/11919065/sort-an-array-by-the-levenshtein-distance-with-best-performance-in-javascript
window.levDist=function(r,a){var t=[],f=r.length,n=a.length;if(0==f)return n;if(0==n)return f;for(var v=f;v>=0;v--)t[v]=[];for(var v=f;v>=0;v--)t[v][0]=v;for(var e=n;e>=0;e--)t[0][e]=e;for(var v=1;f>=v;v++)for(var h=r.charAt(v-1),e=1;n>=e;e++){if(v==e&&t[v][e]>4)return f;var i=a.charAt(e-1),o=h==i?0:1,c=t[v-1][e]+1,u=t[v][e-1]+1,A=t[v-1][e-1]+o;c>u&&(c=u),c>A&&(c=A),t[v][e]=c,v>1&&e>1&&h==a.charAt(e-2)&&r.charAt(v-2)==i&&(t[v][e]=Math.min(t[v][e],t[v-2][e-2]+o))}return t[f][n]};
//Intersection function, safe, from: http://stackoverflow.com/questions/1885557/simplest-code-for-array-intersection-in-javascript
window.intArr=function(e,n){for(var r=0,t=0,a=new Array;r<e.length&&t<n.length;)e[r]<n[t]?r++:e[r]>n[t]?t++:(a.push(e[r]),r++,t++);return a};
//gets caret position within a contenteditable, from: http://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
window.getCaretCharacterOffsetWithin=function(e){var t=0;var n=e.ownerDocument||e.document;var r=n.defaultView||n.parentWindow;var i;if(typeof r.getSelection!="undefined"){var s=r.getSelection().getRangeAt(0);var o=s.cloneRange();o.selectNodeContents(e);o.setEnd(s.endContainer,s.endOffset);t=o.toString().length}else if((i=n.selection)&&i.type!="Control"){var u=i.createRange();var a=n.body.createTextRange();a.moveToElementText(e);a.setEndPoint("EndToEnd",u);t=a.text.length}return t}

window.relev=function(str) {//excludes articles, prepositions, pronouns, etc.
	console.log(str);
	str=str.toLowerCase();
	var mundane=["a","an","the","i","me","my","you"];
	for (i in mundane) {
		var re=new RegExp(" "+mundane[i]+" ","g");
		str=str.replace(re," ");
	}
	console.log(str);
	console.log("----");
	return str;
}