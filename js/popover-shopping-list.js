;(function($){
	
	var defaults = {
		eventEl: "",
		delegateEl: ""
	};
	
	if(typeof $.fn.popover !== 'undefined'){
		$.fn.popover = function(options){
			
			var that = this;
			var el = null;
			
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
				
				var afterTopPos = ($(obj).offset().top + $(obj).height) - that.topPosOfTheEl + 14;
				
				//check the slice cutted
				if(onRightSpace >= this.elWidth){
					$(obj).css({ left: elFullLeftPos + "px", top: "90px", right: "auto"}).removeClass('top');
					$("::before", obj).css({ top: afterTopPos + "px" });
				}
				else {
					$(obj).css({ right: (onRightSpace - 20) + "px", top: (that.topPosOfTheEl + that.elHeight) + "px", left: "auto"}).addClass('top');
				}
			};
			
			this.calculateListPos = function(obj, el){
				
			};
			
			this.repaceTheContent = function(obj){
				
			};
			
			this.displayPopover = function(obj){
				$(obj).addClass('active');
			};
			
			this.closePopover = function(obj){
				$(obj).removeClass('active');
			};
			
			this.initScript = function(){
				that.popoverClass = null;
				
				$.each($('.popover-list'), function(){
					if($(this).css('visibility') === 'visible'){
						that.popoverClass = $(this);
					}
				});
			};			
			
			$(this.config.delegateEl).delegate(this.config.eventEl, 'click', function(e){
				e.preventDefault();
				e.stopPropagation();
				that.init(this);
			});
			
			this.initScript();
			
			$(window).resize(function(){
				that.init(el);
			});
			
			return this;
		};
	}
}($));



