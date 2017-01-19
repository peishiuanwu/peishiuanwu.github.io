$.ajaxSetup({
    beforeSend: function() {
        output("等待回應中...");
    }
});

$("#createOrderId").on('click', function() {
    var dt 		= new Date(),
		year 	= dt.getFullYear(),
		month 	= dt.getMonth(),
		date 	= dt.getDate(),
		hours 	= dt.getHours(),
		minutes = dt.getMinutes()
		second	= dt.getSeconds();
		if (date < 10) {
			date = '0' + date;
		}
		dateTime = String(year) + String(month + 1) + String(date) + String(hours) + String(minutes) + String(second);
	var min = 10, max = 99;
	random = Math.floor(Math.random()*(max-min+1))+min;
	$("#showOrderId").val(String(dateTime) + String(random));
});

var l_result = $("#l_result");

// Generate reserve Api
//產生付款資訊
$("#l_genPayment").on('click', function() {
    payment("#msc_postData");
});
//掃描直接付款
$("#l_scanKeyPayment").on('click', function() {
    payment("#csm_postData");
});

function payment(selModel) {
    var merchant = $("#using_merchant").val(),
        // model    = $("#using_request").find(":selected").val(),
        ip       = $("input[name=ip]").val(),
        postData = $(selModel).val();

    // if (model == 1) {
    //     var postData = $("#msc_postData").val();
    // } else if (model == 2) {
    //     var postData = $("#csm_postData").val();
    // }

    if (ip === "") {
        var url = "/rest/ivmpay/index.php/linepay/payment/" + merchant
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/linepay/payment/" + merchant
    }

    $.ajax({
        url: url,
        type: "POST",
        data: postData
    })
    .done(function(resp) {
        l_result.empty();
        l_result.text("Generate payment");

        output(resp);

        if (resp.returnCode == "0000") {
            $("#getTransactionId").val(resp.transactionId);
            $("input[name=trans_code]").val(resp.trans_code);
            $("input[name=check_code]").val(resp.check_code);

            if (resp.qrcode) {
                $("#qrcode").html('<div align="center"><img src="data:image/png;base64,'+resp.qrcode+'" height="200" width="200"><p>請使用 Line APP 之 Line Pay 掃描功能</p></div>');
            } else {
                $("#qrcode").html('');
            }

            if (resp.orderId) {
                $("#getOrderId").val(resp.orderId);
            } else {
                $("#getOrderId").val('');
            }
        }
    })
    .fail(function(jqxhr) {
        console.info(jqxhr);
    });
}

//查詢支付狀況
$("#l_checkPay").on('click', function(){
    var merchant = $("#using_merchant").val(),
        model    = $("#using_request").find(":selected").val(),
        ip       = $("input[name=ip]").val();

    if (model == 1) {
        var paymentModel = "userScanQR";
    } else if (model == 2) {
        var paymentModel = "merchantScanQR";
    }

    var data = {
        'paymentModel': paymentModel,
        'orderId': $("#getOrderId").val()
    };

    if (ip === "") {
        var url = "/rest/ivmpay/index.php/linepay/checkpayment/" + merchant + "/" + $("#getTransactionId").val();
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/linepay/checkpayment/" + merchant + "/" + $("#getTransactionId").val();
    }

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data)
    })
    .done(function(resp) {
        l_result.empty();
        l_result.text("查詢支付狀況");

        $("#qrcode").html('');

        output(resp);
    })
    .fail(function(jqxhr) {
        console.info(jqxhr);
    });
});

//退款
$("#l_refund").on('click', function(){
    var merchant = $("#using_merchant").val(),
        model    = $("#using_request").find(":selected").val(),
        ip       = $("input[name=ip]").val();

    if (model == 1) {
        var paymentModel = "userScanQR";
    } else if (model == 2) {
        var paymentModel = "merchantScanQR";
    }

    var data = {
        'paymentModel': paymentModel,
        'refundAmount': $("#getRefundAmount").val(),
        'transactionId': $("#getTransactionId").val(),
        'orderId': $("#getOrderId").val()
    };

    if (ip === "") {
        var url = "/rest/ivmpay/index.php/linepay/refund/" + merchant
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/linepay/refund/" + merchant
    }

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data)
    })
    .done(function(resp) {
        l_result.empty();
        l_result.text("Refund");

        $("#qrcode").html('');

        output(resp);
    })
    .fail(function(jqxhr) {
        console.info(jqxhr);
    });
});

//notify
$("#l_notify").on('click', function() {
    var self = this;
    if ($(self).data('waiting') === "true") {
        $(self).data('xhr').abort();
        $(self).html('開始等待notify');
    } else {
        $(self).html('中斷等待');
        $(self).data('waiting', "true");

        var ip = $("input[name=ip]").val();
        if (ip === "") {
            var url = "/rest/ivmpay/index.php/query/" + $("input[name=trans_code]").val().trim() + "/" + $("input[name=check_code]").val().trim();
        } else {
            var url = "http://" + ip + "/rest/ivmpay/index.php/query/" + $("input[name=trans_code]").val().trim() + "/" + $("input[name=check_code]").val().trim();
        }

        $.ajax({
            beforeSend: function(jqxhr) {
                $(self).data('xhr', jqxhr);
            },
            url: url,
            type: 'get'
        })
        .done(function(resp) {
            l_result.empty();
            l_result.text("Notify");

            output(resp);
        })
        .always(function() {
            $(self).data('waiting', "false");
            $(self).html('開始等待notify');
        });
    }
});

cleanData();

/*** 提示需填欄位 ***/
var prompt = {
    "box-shadow": "0 0 5px rgba(255, 82, 82, 1)",
    "border": "1px"
}
//產生付款資訊
var selGenPay = "#using_merchant, #msc_postData, #using_request, input[name=ip]";
$("#l_genPayment").mouseenter(function(e){ $(selGenPay).css(prompt); });
$("#l_genPayment").mouseleave(function(e){ $(selGenPay).removeAttr("style"); });

//掃描直接付款
var selScanKeyPay = "#using_merchant, #csm_postData, #using_request, input[name=ip]";
$("#l_scanKeyPayment").mouseenter(function(e){ $(selScanKeyPay).css(prompt); });
$("#l_scanKeyPayment").mouseleave(function(e){ $(selScanKeyPay).removeAttr("style"); });

//查詢支付狀況
var selCheckPay = "#using_merchant, #getOrderId, #getTransactionId, input[name=ip]";
$("#l_checkPay").mouseenter(function(e){ $(selCheckPay).css(prompt); });
$("#l_checkPay").mouseleave(function(e){ $(selCheckPay).removeAttr("style"); });

//退款
var selRefund = "#using_merchant, #getOrderId, #getTransactionId, #getRefundAmount, input[name=ip]";
$("#l_refund").mouseenter(function(e){ $(selRefund).css(prompt); });
$("#l_refund").mouseleave(function(e){ $(selRefund).removeAttr("style"); });

//開始等待notify
var selNotify = "#trans_code, #check_code, input[name=ip]";
$("#l_notify").mouseenter(function(e){ $(selNotify).css(prompt); });
$("#l_notify").mouseleave(function(e){ $(selNotify).removeAttr("style"); });
