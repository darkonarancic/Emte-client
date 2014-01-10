$(document).ready(function () {
	        
	$("#btn-submit-addNewLoyaltyCard").click(function(e) {
		e.preventDefault();
		$("#addNewLoyaltyCardForm").submit();
	});
	
	$('#addNewLoyaltyCardForm').validate({
		rules: {
			loyaltyCardNumber: {
				required: true
			}
		}		 
	});
	
	$('#btn-open-action-loyaltyCard').on('click', function(e) {
	    e.preventDefault();
	    var $this = $(this);
	    var $collapse = $(".well");
	    $collapse.collapse('toggle');
	});
	
	// ~ handle password forgot form 
	$('.btn-block-loyaltyCard').on('click', function(e) {
		e.preventDefault();
		var cardNumberToBlock = $(this).data("cardnumber");
		$.post(emteClientApp.configuration.appBasePath + "/account/loyalty-spaarkaart-block/" + cardNumberToBlock, function( data ) {
			if (data.code == 0) {
				if (data.msg == "Loyalty card is blocked") {
					$("#loyaltyCardAction2Hidden").addClass("hidden");
					$("#loyaltyCardAction1").addClass("hidden");				
					$("#loyaltyCardAction1Hidden").removeClass("hidden");
					$(".block-status").removeClass("hidden");
					$(".box-round .blocked").parents('.box-round').addClass('disabled');
				} else {
					$("#loyaltyCardAction1Hidden").addClass("hidden");
					$("#loyaltyCardAction2").addClass("hidden");				
					$("#loyaltyCardAction2Hidden").removeClass("hidden");
					$(".block-status").addClass("hidden");
					$(".box-round .blocked").parents('.box-round').removeClass('disabled');
				}
			}
		});
	});
	
	//~ redirect to new loyalty card
	$('.btn-new-loyaltyCard').on('click', function(e) {
		e.preventDefault();
		window.location.href = emteClientApp.configuration.appBasePath + "/account/nieuw-loyalty-spaarkaart";
	});
	
});
