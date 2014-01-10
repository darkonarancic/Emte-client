$(function(){
	
  	$('input:checkbox').on('ifChanged', function(event){
	  	if($(this).is(':checked')) {
	  		$(this).parents('label').addClass('active');
	  	}
	  	else {
	  		$(this).parents('label').removeClass('active');
	  	}
	});
});
