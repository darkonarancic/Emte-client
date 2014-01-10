var emteClientApp = emteClientApp || {};

if(!typeof Handlebars === 'undefined'){
	Handlebars.registerHelper('replaceFound', function(text) {
	    text = Handlebars.Utils.escapeExpression(text);
	    text = text.toString();
	    text = text.replace(emteClientApp.configuration.autosuggestInputText, '<span>'+emteClientApp.configuration.autosuggestInputText+'</span>');
	    return new Handlebars.SafeString(text);
	});
}

//global emte object for all window properties
//if you need to get some window property just add new case
emteClientApp.window = function(query) {

	var location = window.location;
	var urlQuery = location.search;
	var result = {};
	
	var convertToObject = function(obj){
		var res = {};
		$.each(obj, function(key, value){
			var line = value.split('=');
			res[line[0]] = line[1];
		});
		return res;
	};
	
	switch(query){
		case "errorQuery": 
			urlQuery = urlQuery.replace(/^\?/g, '').split('=');
			if(urlQuery[0]){
				result[urlQuery[0]] = urlQuery[1] == "true" ? true : false;
				return result;
			}
			
			return false;
			break; 
		case "firstQuery": 
			if(urlQuery.indexOf('&') == -1){
				urlQuery = new Array(urlQuery.replace(/^\?/g, ''));
			}
			else {
				urlQuery = new Array(urlQuery.substring(0, (urlQuery.indexOf('&') - 1)).replace(/^\?/g, ''));
			}
			result = convertToObject(urlQuery);
			
			return result;
			break;
		case "allQueries": 
			var urlQuery = location.search.replace(/^\?/g, '').split('&');
			if(urlQuery.length > 0){
				result = convertToObject(urlQuery);
				
				return result;
			}
			
			return false;
			break;
	}
};

//add selected class to a clicked menu item and trigger menu category change
emteClientApp.selectMenuItem = function(that){
	if(!$(that).hasClass('selected') && !$(that).hasClass('close')){
		$('.menu nav a').removeClass('selected');
		$(that).addClass('selected');
        if("" != $(that).attr('href')){
            window.location.href = $(that).attr('href');
        }
        emteClientApp.menuToggle($(that).attr('val'), true); //if it's a different button send "true"
		$('.overlay').addClass('toggle');
	}
	else {
		$(that).removeClass('selected');
		emteClientApp.menuToggle($(that).attr('val'), false); //if it's a same button send "false" and close menu
	}
	if($(that).hasClass('close')){
		$('.menu nav a').removeClass('selected');
		emteClientApp.menuToggle("", false);
	}
};

emteClientApp.topMenuPos = function(){
	$(this).css({"top": -$(this).outerHeight()}); //move div above the top
};

//menu category change and trigger custom event for calculating menu-container top position
emteClientApp.menuToggle = function(that, state){
	if(state){
		$('#menu-container .container div').removeClass('active');
		$('#menu-container .' + that).addClass('active');
		$('#menu-container').addClass('toggle');
		if($('#frmLogin').size() > 0){
			emteClientApp.loginValidation();
			emteClientApp.forgotPassValidation();
		}
	}
	else {
		$('#menu-container').removeClass('toggle');
		$('.overlay').removeClass('toggle');
	}
	$('#menu-container').trigger('heightCalculation'); //trigger custom event
};

//set active menu element by selecting "active-val" parameter of an element
emteClientApp.setActiveTab = function(index){
	if(index >= 0)	{
		var activeElement = $('#main-menu-nav div a[active-val='+ (++index) +']');
		emteClientApp.selectMenuItem(activeElement);
	}
};

//do login validation
emteClientApp.loginValidation = function(){
	var validate = $('#frmLogin').validate({
		rules: {
			j_username: {
				required: true,
				email: true
			},
			j_password: {
				required: true,
                minlength: 6
			}
		},
		showErrors: function(errorMap, errorList) {
			this.defaultShowErrors();
		},
		invalidHandler: function(form,validator) {
			var errors = validator.numberOfInvalids();
			if(errors  > 0) {
				var html = "";
				$.each(validator.errorList, function(key, value){
					html += value.message + "<br/>";
				});
				$('#frmLogin .error_summary').html(html).show();
			}
			else {
				$('#frmLogin .error_summary').hide();
			}
		}
	});
	$('.login').on('click', function(){
		validate.resetForm();
	});
};

//do forgot password validation
emteClientApp.forgotPassValidation = function(){
	var validate = $('#frmForgotPass').validate({
		rules: {
			"txt-forgot": {
				required: true,
				email: true
			}
		},
		showErrors: function(errorMap, errorList) {
			this.defaultShowErrors();
		},
		invalidHandler: function(form,validator) {
			var errors = validator.numberOfInvalids();
			if(errors  > 0) {
				var html = "";
				$.each(validator.errorList, function(key, value){
					html += value.message + "<br/>";
				});
				$('#frmForgotPass .error_summary').html(html).show();
			}
			else {
				$('#frmForgotPass .error_summary').hide();
			}
		}
	});
	$('#frmForgotPass input[type=submit]').on('click', function(){
		$('#frmForgotPass').valid();
	});
	$('.forgot').on('click', function(){
		validate.resetForm();
	});
};

//bind switch events on login and forgot pass forms
emteClientApp.bindLoginForgotSwitch = function(login, forgot){
	$("a.forgot", login).on('click', function(e){
		e.preventDefault();
		emteClientApp.switchLoginAndForgot(forgot, login);
	});
	$("a.login", forgot).on('click', function(e){
		e.preventDefault();
		emteClientApp.switchLoginAndForgot(login, forgot);
	});
};

//switch login and forgot pass forms
emteClientApp.switchLoginAndForgot = function(show, hide){
	$(hide).hide();
	$(".error_summary", show).hide();
	$(show).show();
};

//render search autosuggest 
emteClientApp.renderSearch = function(search){
	if(search){
		var source = $("#search-template").html();
		var template = Handlebars.compile(source);
		var wrapper = {items: search};
		$('.search-box .suggestions').html(template(wrapper));
	}
};

//render search results 
emteClientApp.renderSearchProduct = function(search){
	if(search){
		var source = $("#search-template-products").html();
		var template = Handlebars.compile(source);
		var wrapper = {searchItems: search.products.slice(0,4)};
		console.log(wrapper);
		$('#searched-products').html(template(wrapper));
	}
};

//get autosuggest server response
emteClientApp.getAutoCompleteJSON = function(text){
	var result = null;
	$.ajax({
        url: "suggest",
        type: 'GET',
        contentType: "application/x-www-form-urlencoded",
	    dataType: "json",
	    data: {
	    	term: $.trim(text)
	    },
    }).success(function (data) {
		emteClientApp.renderSearch(data);
    }).error(function (data, textStatus, errorThrown) {
    });
};

//get search result
emteClientApp.getSearchResultJSON = function(text){
	var result = null;
	$.ajax({
        url: "search",
        type: 'GET',
        contentType: "application/json",
	    dataType: "json",
	    data: {
	    	q: text
	    },
    }).success(function (data) {
		emteClientApp.renderSearchProduct(data);
    }).error(function (data, textStatus, errorThrown) {
    });
};

emteClientApp.chooseKeyword = function(text){
	$('#main-search-input').attr('value', text);
	$('.search-box .suggestions').html('');
};

$(function(){
	$('.menu nav a, .menu-container > div > a.close').bind('click', function(e){
		e.preventDefault();
		emteClientApp.selectMenuItem(this); //trigger 
	});

    $('.menu nav a').each(function (index) {
        if ((window.location.href).indexOf($(this).attr('href')) != -1 && $(this).attr('href') != "") {
               $(this).addClass('selected');
        }
    });


    $('#menu-container').on('heightCalculation', emteClientApp.topMenuPos); //binding custom event to the menu-container
	$('#menu-container').trigger('heightCalculation'); //tirgger menu-container top position event on load
	
	//get window.location.search query and check if login error exists
	if(emteClientApp.window('errorQuery').error){
		emteClientApp.setActiveTab(0);
		$('#frmLogin .error_summary').show();
	}
	if($('#login-form').size() > 0){
		emteClientApp.bindLoginForgotSwitch($('#login-form'), $('#forgot-password-form'));
	}
	
	
	// ~ handle password forgot form 
	$('#btnSubmitForgotPassword').on('click', function(e) {
		e.preventDefault();
		$.post("login/forgotPassword", $("#frmForgotPass").serialize(), function( data ) {
			  /*console.log('responseCode: ' + data.code);
			  console.log('responseMessage: ' + data.msg);*/
			  
			  if(data.code != 0){
					$('#frmForgotPass .error_summary').removeClass('successful').html(data.msg).show();
			  }
			  else {
					$('#frmForgotPass .error_summary').addClass('successful').html(data.msg).show();
			  }
		});
	});
	
	if(emteClientApp.window('allQueries').action){
		if(emteClientApp.window('allQueries').action == "12"){
			emteClientApp.switchLoginAndForgot($('#forgot-password-form'), $('#login-form'));
			emteClientApp.setActiveTab(0);
		}
		if(emteClientApp.window('allQueries').action == "11"){
			emteClientApp.setActiveTab(0);
		}
	}
	if(emteClientApp.window('allQueries').action){
		if(emteClientApp.window('allQueries').action == "popUp"){
			emteClientApp.popUpOpen();
		}
	}
	if($('#main-search-input').size() > 0){
		$('#main-search-input').on('keyup', function(){
			emteClientApp.getAutoCompleteJSON(emteClientApp.configuration.autosuggestInputText = $(this).val());
		});
	}
	if($('.search-box').size() > 0){
		$('.search-box').delegate('.suggest','click', function(e){
			e.stopPropagation();
			e.preventDefault();
			emteClientApp.chooseKeyword($.trim($(this).text()));
		});
	}
	if($('#btn-main-search').size() > 0){
		$('#btn-main-search').on('click', function(e){
			e.preventDefault();
			emteClientApp.getSearchResultJSON($.trim($('#main-search-input').attr('value')));
			$('.search-box .suggestions').html('');
		});
	}
	if($('input:checkbox').size() > 0){
		$('input:checkbox').iCheck({
	    	checkboxClass: 'icheckbox_flat-green'
  		});
	}
});