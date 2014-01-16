$(function(){
	emteClientApp.openingInProgress = false;
	emteClientApp.currentObject = null;
	emteClientApp.productSlide = function(obj){
		emteClientApp.currentObject = obj;
		emteClientApp.openingInProgress = true;
		if(!$(obj).hasClass('active') && obj){
			var prevEl = $('figure[class*=product].active');
			var scrollTimer = false;
			if(prevEl && emteClientApp.isEqualOffsetTop(prevEl, obj)) //checking if it is a same top position and if object exists
			{
				$('figure[class*=product]').removeClass('active'); //removing active class from all product items
				$(obj).addClass('active'); //adding active class to current element
				emteClientApp.replaceContent(obj); //
			}
			else {
				$('figure[class*=product]').removeClass('active');
				$(obj).addClass('active');
				if(obj){
					emteClientApp.moveDetailsBox(emteClientApp.findLastSamePos(obj), obj);
				}
			}
			scrollTimer = setTimeout(function(){emteClientApp.scrollToEl(obj, scrollTimer)}, 350);
			emteClientApp.openingInProgress = false;
		}
		else {
			emteClientApp.closeCurrent(obj);
			emteClientApp.openingInProgress = false;
		}
	};

	emteClientApp.findLastSamePos = function(obj){
		var siblings = $(obj).nextAll();
		var thisPos = $(obj).offset().top;
		var lastInRow = null;
		if(siblings.size() > 0){
			$.each(siblings, function(index){
				if(!$(this).hasClass('product-details-box')){
					var lastInRowPos = $(this).offset().top;
					if((thisPos != lastInRowPos) && index == 0) {
						lastInRow = obj;
					}
					else if(thisPos == lastInRowPos) {
						lastInRow = this;
					}
					else {
						return false;
					}
				}
			});
		}
		else {
			lastInRow = obj;
		}
		return lastInRow;
	};
	
	emteClientApp.replaceContent = function(obj){
        // var url =  $('.product_url', obj).attr('href');
        // var path = url.split('/');
        // var prod_url = path[path.length - 1];
        // url = "/product/ingredients/" +  prod_url;
// 
		// $('.product-details-box').removeClass('open').load(url, function(e) {
            // $('.product-details-box').delay(50).queue(function(){
                // emteClientApp.detailsBoxOpen(obj);
                // $(this).dequeue();
            // });
        // });		$('.product-details-box').removeClass('open').html($('.product-details', obj)[0].outerHTML).delay(50).queue(function(){
			emteClientApp.detailsBoxOpen(obj);
			$(this).dequeue();
		});
	};
	
	emteClientApp.detailsBoxOpen = function(obj){
		$('.product-details-box').addClass('active').delay(400).queue(function(){
    		$(this).addClass('open');
    		$(this).dequeue();
		});
		$(obj).addClass('active');
		
	};
	
	emteClientApp.moveDetailsBox = function(last, obj){
		$('.product-details-box').insertAfter($(last));
		emteClientApp.replaceContent(obj);
	};
	
	//compare offset().top position of two elements
	emteClientApp.isEqualOffsetTop = function(current, next){
		if($(current).size() > 0){
			return $(current).offset().top == $(next).offset().top ? true : false;
		}
		else {
			return false;
		}
	};
	
	//removing open class if the next element isn't in the same row
	// emteClientApp.productRemoveOpen = function(obj, timer){
		// clearTimeout(timer);
		// $(obj).removeClass('open');
	// };

	emteClientApp.closeCurrent = function(obj){
		$(obj).removeClass('active').removeClass('open');
		$('.product-details-box').removeClass('active').delay(50).queue(function(){
			$(this).removeClass('open');
    		$(this).dequeue();
		});
	};
	
	emteClientApp.scrollToEl = function(el, scrollTimer){
		clearTimeout(scrollTimer);
		$('html, body').animate({scrollTop: $(el).offset().top}, 700);
	};

	$('#products-overview-list').delegate('.product, .product-big','click', function(e){
		e.stopPropagation();
		e.preventDefault();
		if(!emteClientApp.openingInProgress){
			emteClientApp.productSlide(this);	
		}
	});
	
	$(window).resize(function(){
		if($('.product-details-box').is(':visible')){
			emteClientApp.productSlide(emteClientApp.currentObject);
		}
	});
	
	emteClientApp.doit;
	$(window).resize(function(){
	  clearTimeout(emteClientApp.doit);
	  emteClientApp.doit = setTimeout(function(){
	  	emteClientApp.productSlide(emteClientApp.currentObject);
	  }, 400);
	});
	
	$('.product-details-wrapper').on('click', function(e){
		e.stopPropagation();
	});
	
	$('figure[class*=product] .add, figure[class*=product] .btn-add').bind('click',function(e){
		e.stopPropagation();
	});

    if ($('figure[class*=product].selected').size() > 0) {
        emteClientApp.productSlide($('.product.selected'));
    }
});
