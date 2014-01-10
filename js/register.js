/**
 * Created with IntelliJ IDEA.
 * User: pvaughan
 * Date: 13/11/13
 * Time: 11:50
 * To change this template use File | Settings | File Templates.
 */

function getAddressFromPostCode(postCode, houseNumber) {
    var url = "/site/postcode?postcode=" + postCode + "&houseNumber=" + houseNumber;
    $.get(url, function (data) {
        $("#customerAddressStreet").val(data.street);
        $("#customerAddressCity").val(data.city);
    });
}

function setAddressMode(countryCode)
{
    if (countryCode == "NL") {
        $("#register-alternative-adress").hide();
        $("#register-adress").show();
    } else {
        $("#register-alternative-adress").removeClass("hidden");
        $("#register-adress").hide();
        $("#register-alternative-adress").show();
    }
}

$(document).ready(function () {

    $("#registerPostcode, #registerHouseNumber").focusout(function (e) {
        if ($("#registerCountry").val() == "NL") {
            var postCode = $("#registerPostcode").val().replace(' ',''),
                houseNumber = $("#registerHouseNumber").val() + $("#registerFlatNumber").val();

            if (postCode != "" && houseNumber != "")
                getAddressFromPostCode(postCode, houseNumber);
        }
    });

    $("#registerCountry").change(function (e) {
        setAddressMode($(this).val());
    });
    setAddressMode($("#registerCountry").val());

    $("#btn-submit-step2").click(function(e){
        e.preventDefault();

        if ($('#registerFormStep2').valid()) {
            if ($("#registerCountry").val() == "NL") {
                $("#register-alternative-adress").empty();
                $("#customerAddressStreet").removeAttr("disabled");
                $("#customerAddressCity").removeAttr("disabled");

            } else {
                $("#register-adress").empty();
            }
            $("#registerFormStep2").submit();
        }
    });


});