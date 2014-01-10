$(function(){
	if($('.box-accordion-arrow').size() > 0) {
		$('.box-accordion-arrow').on('click', function(){
			$(this).toggleClass('active');
		});
	}
});
