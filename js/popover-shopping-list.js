;(function($){
	
	var defaults = {
		eventEl: "",
		delegateEl: ""
	};
	
	if(typeof $.fn.popover !== 'undefined'){
		$.fn.popover = function(options){
			
			var that = this;
			var el = null;
			var mobileRes = 768;
			
			this.config = $.extend({}, defaults, options);
				
			this.init = function(clickedEl){
				el = $(clickedEl);
				var parent = $(clickedEl).parent('li');
				
				that.leftPosOfTheEl = parent.offset().left;
				that.topPosOfTheEl = parent.offset().top;
				that.elWidth = parent.width();
				that.elHeight = parent.height();
				
				if($(that).size() > 0){
					if(!$(clickedEl).parents('li').hasClass('active')){
						this.checkWhich(this.popoverClass, $(clickedEl));
					}
					else {
						this.closePopover();
					}
				}
			};
			
			//this will check which one of two popover boxes should be shown, also passing the clicked element
			this.checkWhich = function(popover, el){
				if($(this.popoverClass).hasClass('box')){
					this.initBox(popover, el);
				}
				else {
					this.initList(popover, el);
				}
			};
			
			//initialize popover box
			this.initBox = function(obj, el){
				this.openOverflow();
				
				this.calculateBoxPos(obj, el);
				this.repaceTheContent(obj);
				this.displayPopover(obj);
			};
			
			//initialize popover in-list
			this.initList = function(obj, el){
				this.openOverflow();
				
				this.calculateListPos(obj, el);
				this.repaceTheContent(obj);
				this.displayPopover(obj);
			};
			
			//open overflow el, passing "true" will close it
			this.openOverflow = function(close){
				close = close === true ? true : false;
				if(close){
					$('.header-overflow').removeClass('active');
				}
				else {
					$('.header-overflow').addClass('active').css({ height: $(window).height() });
				}
			};
			
			this.calculateBoxPos = function(obj, el){
				var elFullLeftPos = this.leftPosOfTheEl + this.elWidth;
				var wWidth = $(window).width();
				
				var onRightSpace = wWidth - elFullLeftPos;
				
				var afterTopPos = that.topPosOfTheEl - parseInt($(obj).css('top'));
				
				//check the slice
				if(onRightSpace >= this.elWidth){
					$(obj).css({ left: (elFullLeftPos + 10) + "px", top: "90px", right: "auto"}).removeClass('top').addClass('arrow-left');
					$(".popover-arrow").css({ top: afterTopPos + "px" });
				}
				else {
					$(".popover-arrow").css({ top: "-12px" });
					$(obj).css({ right: (onRightSpace - 20) + "px", top: (that.topPosOfTheEl + that.elHeight + 10) + "px", left: "auto"}).addClass('top');
				}
			};
			
			this.calculateListPos = function(obj, el){
				$(obj).insertAfter($(el).parent('li')).addClass('active');
			};
			
			//replace main popover content
			this.repaceTheContent = function(obj){
				//ajax callback
			};
			
			this.displayPopover = function(obj){
				$(obj).addClass('active');
			};
			
			this.closePopover = function(obj){
				$(obj).removeClass('active');
			};
			
			//replace the content of the popover with product details content
			this.showProductDetailsReplace = function(btnObj){
				var newHTML = null;
				//ajax call goes here
				$('.popover-list').html(newHTML);
			};
			
			this.showProductDetailsBackToList = function(btnObj){
				//this.showProductDetailsReplace(btnObj);
				$('.popover-list .product-details').hide();
				$('.popover-list .products-list').show();
			};
			
			this.showProductDetails = function(btnObj){
				//this.showProductDetailsReplace(btnObj);
				$('.popover-list .products-list').hide();
				$('.popover-list .product-details').show();
			};
			
			this.initScript = function(callback){
				that.popoverClass = null;
				
				if(mobileRes < $(window).width()){
					that.popoverClass = $('.popover-list.box');
					$('.popover-list.in-list').removeClass('active');
				}
				else {
					that.popoverClass = $('.popover-list.in-list');
					$('.popover-list.in-list').removeClass('active');
				}
				
				if(typeof callback === 'function'){
					callback.call();
				}
			};			
			
			$(this.config.delegateEl).delegate(this.config.eventEl, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				that.init(this);
			});
			
			this.initScript();
			
			$(window).resize(function(){
				that.initScript(function(){
					that.init(el);
				});
			});
			
			$('.btn-show-details').live('click', function(e){
				e.preventDefault();
				that.showProductDetails(this);
			});
			
			$('.btn-details-back').live('click', function(e){
				e.preventDefault();
				that.showProductDetailsBackToList(this);
			});
			
			return this;
		};
	}
}($));



