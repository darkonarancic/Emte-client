var emteClientApp = emteClientApp || {}; //initialize emte app object

emteClientApp.configuration = {
		appBasePath: '/site',
		autosuggestInputText: ""
};

emteClientApp.extend = function(obj){
	for(var o in obj){
		emteClientApp[o] = obj[o];
	}
};

//center popup verticaly and opent it
emteClientApp.popUpOpen = function(){
	var wHeight = $(window).height() / 2;
	var popup = $('.popup');
	$(popup).css({top: wHeight - $(popup).height() + "px"});
	$(popup).css({visibility:"visible"});
	$('.overlay-popup').css({visibility:"visible"});
	setTimeout(emteClientApp.popUpClose, 3000);
};

//close popup
emteClientApp.popUpClose = function(){
	$('.popup').css({visibility:"hidden"});
	$('.overlay-popup').css({visibility:"hidden"});
};

$(function(){
	
	$("form input:focus").on('keyup', function(e){
		if(e && e.keyCode == 13) {
			$(this).parents('form').submit();
		}
	});
	
	if($('input.iStyle:checkbox').size() > 0){
		$('input.iStyle:checkbox').iphoneStyle({
			checkedLabel: 'Ja', 
			uncheckedLabel: 'Nee',
			onChange: function(that, prop){ 
		      	if(prop){
		      		$(that).addClass('checked').removeClass('unchecked');
		      		$(that).attr('checked', true);
		      	}
		      	else {
		      		$(that).removeClass('checked').addClass('unchecked');
		      		$(that).removeAttr('checked');
		      	}
		    }
		});
   }

    // ~ handle password forgot form
    function bindCartButtons() {
        $('.minus').on('click', function (e) {
            e.preventDefault();
            var id = $(this).attr('id');
            id = id.replace("remove", "");
            var args = id.split("*");
            $.ajax({
                type: "GET",
                url: "/site/cart/updateQuantity",
                data: {productId: args[1], orderItemId: args[0], quantity: (args[2] - 1)},
                success: function (data) {
                    //alert(data);
                    $("#cartItems").html(data);
                    bindCartButtons();
                }
            });
        });


        $('.plus').on('click', function (e) {
            e.preventDefault();
            var id = $(this).attr('id');
            id = id.replace("add", "");
            var args = id.split("*");
            var q = parseInt(args[2]) + 1;

            $.ajax({
                type: "GET",
                url: "/site/cart/updateQuantity",
                data: {productId: args[1], orderItemId: args[0], quantity: q},
                success: function (data) {
                    //alert(data);
                    $("#cartItems").html(data);
                    bindCartButtons();
                }
            });
        });
    }

    bindCartButtons();

    $(document).on('submit', '.addToCartForm, .updateQuantity', function (event) {
        event.preventDefault();

        var $form = $(event.target);

        if (!$(this).attr('data-ajax') || $(this).attr('data-ajax') === 'enabled') {

            //block
            $(this).attr('data-ajax', 'disabled');

            var formData =  $(this).serialize();

            $.ajax({
                url: $(this).attr('action'),
                type: 'post',
                dataType: "json",
                data: formData
            }).success(function (data) {
                $("#nr-shopping-cart-items").html(data.cartItemCount);
            }).error(function () {
                //notificationBar.showNotificationBarWith('Er heeft zich een onbekende fout voorgedaan.', 'alert-error');
            }).complete(function () {
                //unblock
                $form.attr('data-ajax', 'enabled');
                newItemInCart();
            });
        }
    });
    
    if($('.accordion-arrow').size() > 0){
	    $('.accordion-arrow').on('click', function(e){
			e.preventDefault();
			$(this).parent().toggleClass('active');
		});
	}
	if($('.box-list').size() > 0){
		$('.box-list').perfectScrollbar();
	}
});

window.newItemInCart = function () {
    $('#shopping-list-badge').addClass("new_item");
    clearTimeout(window.newItemInCart.timer);
    window.newItemInCart.timer = setTimeout(function(){
        newItemInCartSeen();
    }, 1000);

};
window.newItemInCartSeen = function () {
    $('#shopping-list-badge').removeClass("new_item");
};
