emteClientApp.radioBtnChange = function(that){
	if(!$(that).hasClass('active')){
		$(that).parent().find('.active').removeClass('active');
		$(that).addClass('active');
		$('input', that).prop('checked', '');
		$('input[value='+ $(that).attr('val') +']', that).prop('checked', 'checked');
		//$('#radio_salutation input').prop('checked', '');
		//$('#radio_salutation input[value='+ $(that).attr('val') +']').prop('checked', 'checked');
	}
};

emteClientApp.formValidate = function(step){
	if(step == 1){
		$('#registerFormStep1').validate({
			rules : {
				"customer.emailAddress": {
					required: true,
					email: true
				},
				password: {
	                required: true,
	                minlength: 6,
	                maxlength: 16
	            },
	            passwordConfirm: {
	                required: true,
	                minlength: 6,
	                maxlength: 16,
	                equalTo: "#registerPassword"
	            }
			}
		});
		$('#registerFormStep1 button').on('click', function(e){
			$('#registerFormStep1').valid();
		});
	}
	else if(step == 2){
		var validator = $('#registerFormStep2').validate({
			rules: {
				genderId: { 
					required: true 
				},
				countryCode: {
					required: function(element) {
                        if( $("#select").val() <='0' || $("#select").val() == ""){
                            return false;
                        }else{
                            return true;
                        }
                    }
				},
				registerPostcode: {
					required: true
				},
				registerHouseNumber: {
					required: true
				},
				birthdateDay: {
					required: true,
					range: [1, 31]
				},
				birthdateMonth: {
					required: true,
					range: [1, 12]
				},
				birthdateYear: {
					required: true,
					number: true,
					minlength: 4
				},
				customerPhoneMobile: {
					required: true
				},
				customerAddressStreet: {
					required: true
				},
				customerAddressCity: {
					required: true
				},
				familyStatusId: {
					required: function(element) {
                        if( $("#select").val() <='0' || $("#select").val() == ""){
                            return false;
                        }else{
                            return true;
                        }

                    }
				},
				"customer.firstName": "required",
				"customer.lastName": "required"
			},
			groups: {
				dayOfBirth: "birthdateDay birthdateMonth birthdateYear",
				/*address: "registerPostcode registerHouseNumber registerFlatNumber"*/
			},
			showErrors: function(errorMap, errorList) {
				
			  this.defaultShowErrors();
			  //move out error labels to the parent wrapper
				var that = this;
				$.each(errorMap, function(key, value){
					var select = $('*[name=' + key + ']');
					if($(select).prop('nodeName') == "SELECT"){	    				
						var label = $(select).next();
						var clone = $(label).clone();
						$(label).remove();
						$(select).parent().addClass('error').parent().append(clone);
					}
					else if($(select).prop('nodeName') == "INPUT" && $(select).attr('type') == "radio"){
						 $(select).parents('.btn-group-justified').addClass('error');
					}
				});
			},
			invalidHandler: function(form,validator) {
				var errors = validator.numberOfInvalids();
				if(errors  > 0) {
					var html = "";
					$.each(validator.errorList, function(key, value){
						html += value.message + "<br/>";
					});
					$('#registerFormStep2 .error_summary').html(html).show();
				}
				else {
					$('#registerFormStep2 .error_summary').hide();
				}
			},
			highlight: function(element, errorClass, validClass) {
				if($(element).is("SELECT")){
					var label = $(element).next("."+errorClass);
					var clone = $(label).clone();
					$(label).remove();
					$(element).parent().addClass(errorClass).removeClass(validClass).parent().append(clone);
				}
				$(element).addClass(errorClass).removeClass(validClass);
				if($(element).is("INPUT") && ($(element).attr('type') == "radio")){
					 $(element).parents('.btn-group-justified').addClass('error');
				}
			},
			unhighlight: function( element, errorClass, validClass ) {
				   if($(element).is("SELECT")){
					   $(element).parent().removeClass('error');
				   }
				   else if($(element).is("TEXTAREA")){
					   $(element).removeClass(errorClass).addClass(validClass);
				   }
				   else if($(element).is("INPUT")){
					   $(element).removeClass(errorClass).addClass(validClass);
					   if($(element).attr('type') == "radio") {
						   $(element).parents('.btn-group-justified').removeClass('error');
					   }
				   }
			},
		  
		   errorPlacement: function(error, element) {
		       if (element.attr("name") == "birthdateDay" || element.attr("name") == "birthdateMonth" || element.attr("name") == "birthdateYear") {
		    	   error.insertAfter("#birthdateYear");
		       }
		       /*else if(element.attr("name") == "registerPostcode" || element.attr("name") == "registerHouseNumber" || element.attr("name") == "registerFlatNumber") {
		       		
		       		error.insertAfter("#registerFlatNumber");
		       		
		       }*/
		       else {
			        error.insertAfter(element);
		       }
		       
		       if($(element).is("SELECT")){
					var label = $(element).next(".error");
					var clone = $(label).clone();
					$(label).remove();
					$(element).parent().addClass('error').removeClass('valid').parent().append(clone);
				}
		   }
							 
		});
		/*$('#registerFormStep2 button').on('click', function(e){
			$('#registerCountry').valid();
			$('#registerFamilyStatus').valid();
		});*/
	}
	
};

emteClientApp.switchRegistrationTabs = function(active){
	$('[id^=registration-step-4-]').hide();
	$('#registration-step-4-'+ active).show();		
};


$(document).ready(function(){
	if($('#btn-register-second').size() > 0){
		$('#btn-register-second').on('click', function(e){
			e.preventDefault();
			emteClientApp.switchRegistrationTabs(2);
		});
	}
	if($('#btn-register-third').size() > 0){
		$('#btn-register-third').on('click', function(e){
			e.preventDefault();
			// emteClientApp.switchRegistrationTabs(3);
			$("#registerFormStep4").submit();
		});
	}
	if($('#loyaltyCardNumberError').size() > 0 ){
		emteClientApp.switchRegistrationTabs(2);
	}
	if($('#btn-hidden').size() > 0){
		$('#register-third').hide();
		emteClientApp.switchRegistrationTabs(2);
	}
	
});

$(window).load(function(){
	
	$('.btn-radio a').on('click', function(e){
		e.preventDefault();
		emteClientApp.radioBtnChange(this);
		$('*[name=genderId]').valid();
	});
	if($('#genderId').size() > 0){
		$('.btn-radio > a:nth-child('+ (parseInt($('#genderId').val()) + 1) +')').trigger('click');
	}
	/*emteClientApp.formValidate();*/
});
