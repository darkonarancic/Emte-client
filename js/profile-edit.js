emteClientApp.getAddressFromPostCode = function(postCode, houseNumber) {
    var url = "/site/postcode?postcode=" + postCode + "&houseNumber=" + houseNumber;
    $.get(url, function (data) {
        $("#customerAddressStreet").val(data.street);
        $("#customerAddressCity").val(data.city);
    });
}

emteClientApp.setAddressMode = function(countryCode) {
    if (countryCode == "NL") {
        $("#register-alternative-adress").hide();
        $("#register-adress").show();
    } else {
        $("#register-alternative-adress").removeClass("hidden");
        $("#register-adress").hide();
        $("#register-alternative-adress").show();
    }
}

emteClientApp.validateEditProfile = function(){
	var validator = $('#profileEditForm').validate({
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
			username: {
				required: true,
				email: true
			},
			firstName: {
				required: true
			},
			lastName: {
				required: true
			},
			customerAddressPostcode: {
				required: true
			},
			customerAddressHouseNumber: {
				required: true
			},
			customerAddressStreet: {
				required: true
			},
			customerAddressCity: {
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
			mobilePhoneNumber: {
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
			
		},
		groups: {
			dayOfBirth: "birthdateDay birthdateMonth birthdateYear",
			address: "customerAddressPostcode customerAddressHouseNumber"
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
				$('.profile-edit-form .error_summary').html(html).show();
			}
			else {
				$('.profile-edit-form .error_summary').hide();
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
	       else if (element.attr("name") == "customerAddressPostcode" || element.attr("name") == "customerAddressHouseNumber") {
	    	   error.insertAfter("#registerFlatNumber");
	       }
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
};

emteClientApp.validateChangePassword = function(){
	var validator = $('#passwordChangeForm').validate({
		rules: {
			currentPassword: {
				required: true,
                minlength: 6,
                maxlength: 16
			},
			newPassword: {
				required: true,
                minlength: 6,
                maxlength: 16
			},
			newPasswordConfirm: {
				required: true,
				minlength: 6,
                maxlength: 16,
				equalTo: "#newPassword"
			}
		},
		highlight: function(element, errorClass, validClass) {
			$(element).addClass(errorClass).removeClass(validClass);
		},
		unhighlight: function( element, errorClass, validClass ) {
			$(element).removeClass(errorClass).addClass(validClass);
		},
		errorPlacement: function(error, element) {
			error.insertAfter(element);
		}
						 
	});
};

$(document).ready(function () {
	
    $("#registerPostcode, #registerHouseNumber").focusout(function (e) {
        if ($("#profileEditCountry").val() == "NL") {
            var postCode = $("#registerPostcode").val().replace(' ',''),
                houseNumber = $("#registerHouseNumber").val() + $("#registerFlatNumber").val();

            if (postCode != "" && houseNumber != "")
                emteClientApp.getAddressFromPostCode(postCode, houseNumber);
        }
    });
	
	$("#profileEditCountry").change(function (e) {
        emteClientApp.setAddressMode($(this).val());
    });
    
    emteClientApp.setAddressMode($("#profileEditCountry").val());
	
    $("#btn-submit-profileEdit").click(function(e){
        e.preventDefault();

        if ($('#profileEditForm').valid()) {
            if ($("#profileEditCountry").val() == "NL") {
                $("#register-alternative-adress").empty();
                $("#customerAddressStreet").removeAttr("disabled");
                $("#customerAddressCity").removeAttr("disabled");

            } else {
                $("#register-adress").empty();
            }
            $("#profileEditForm").submit();
        }
    });
    
    emteClientApp.validateEditProfile();
    emteClientApp.validateChangePassword();
});
