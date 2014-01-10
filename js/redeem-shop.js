$(function(){	emteClientApp.tabs = {		tabList: document.getElementById('tabs-switcher')	};	if($('#slideshow').size() > 0){		$('#slideshow').bjqs({
		    height      : 300,
		    width       : 620,
		    responsive  : true
		});	}	if($('#tabs').size() > 0){		$('#tabs').tabs();	}		//remove this - it's only for demo page	$("#tabs").tabs({active: 2});		$('#tabs-switcher').delegate('select','change', function(){		$("#tabs").tabs({active: this.selectedIndex});		if($('#slideshow').size() > 0){			$('#slideshow').bjqs({			    height      : 300,			    width       : 620,			    responsive  : true			});		}	});		$('#tabs').bind('tabsshow', function(event, ui) { 		if($('#tabs').is(':visible')){			$('select', emteClientApp.tabs.tabList).prop('selectedIndex',  ui.index);	   	}	});	$('select', emteClientApp.tabs.tabList).prop('selectedIndex', $("#tabs").index() - 2);
});
