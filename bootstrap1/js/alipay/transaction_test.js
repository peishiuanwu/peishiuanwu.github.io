$.ajaxSetup({
    beforeSend: function() {
        output("等待回應中...");
    }
});

var a_result = $("#a_result");

//產生QRcode
$("#a_genqrcode").on('click', function() {
    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/alipay/precreate/" + $("#using_merchant").val()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/alipay/precreate/" + $("#using_merchant").val()
    }

    $.ajax({
        url: url,
        type: "post",
        data : $("textarea[name=data]").val()
    })
    .done(function(resp) {
        a_result.empty();
        a_result.text("產生QRcode");

        output(resp);
        $("#out_trade_no").val(resp.out_trade_no);
        $("#trans_code").val(resp.trans_code);
        $("#check_code").val(resp.check_code);
        $("#qrcode-container").html('<div align="center"><img src="data:image/png;base64,'+resp.qrcode+'" height="200" width="200"><p>請使用支付寶APP掃描功能</p></div>');
    })
    .fail(function(jqxhr) {
        console.info(jqxhr);
    });
});

//查詢訂單狀態
$("#a_query").on('click', function() {
    var out_trade_no = $("#out_trade_no").val();
    if (out_trade_no.length === 0) {
        return;
    }

    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/alipay/query/" + $("#using_merchant").val() + "/" + out_trade_no
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/alipay/query/" + $("#using_merchant").val() + "/" + out_trade_no
    }

    $.ajax({
        url : url,
        type : 'post'
    })
    .done(function(resp) {
        a_result.empty();
        a_result.text("查詢訂單狀態");

        output(resp);
    });
});

//關閉訂單
$("#a_cancel").on('click', function() {
    var out_trade_no = $("#out_trade_no").val();
    if (out_trade_no.length === 0) {
        return;
    }

    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/alipay/cancel/" + $("#using_merchant").val() + "/" + out_trade_no
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/alipay/cancel/" + $("#using_merchant").val() + "/" + out_trade_no
    }

    $.ajax({
        url : url,
        type : 'post'
    })
    .done(function(resp) {
        a_result.empty();
        a_result.text("關閉訂單");

        output(resp);
    });
});

//退款
$("#a_refund").on('click', function() {
    var out_trade_no = $("#out_trade_no").val(),
        refund_amount = $("#refund_amount").val()
    if (out_trade_no.length === 0) {
        return;
    }

    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/alipay/refund/" + $("#using_merchant").val()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/alipay/refund/" + $("#using_merchant").val()
    }

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify({
            'out_trade_no': out_trade_no,
            'refund_amount': refund_amount
        })
    })
    .done(function(resp) {
        a_result.empty();
        a_result.text("退款");

        output(resp);
    });
});

//notify
$("#a_notify").on('click', function() {
    var self = this;
    if ($(self).data('waiting') === "true") {
        $(self).data('xhr').abort();
        $(self).html('開始等待notify');
    } else {
        $(self).html('中斷等待');
        $(self).data('waiting', "true");

        if ($('input[name=xpay_server]').val() != "") {
            var url = 'http://' + $('input[name=xpay_server]').val() + '/rest/ivmpay/index.php/query/' + $('#trans_code').val().trim() + '/' + $('#check_code').val().trim();
        } else {
            var url = '/rest/ivmpay/index.php/query/' + $('#trans_code').val().trim() + '/' + $('#check_code').val().trim();
        }

        $.ajax({
            beforeSend: function(jqxhr) {
                $(self).data('xhr', jqxhr);
            },
            url : url,
            type : 'get'
        })
        .done(function(resp) {
            a_result.empty();
            a_result.text("Notify");

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
var con = {
    "box-shadow": "0 0 5px rgba(0, 168, 0, 1)",
    "border": "1px"
}
//產生QRCode
var selGenQr = "#using_merchant, textarea[name=data], input[name=ip]";
$("#a_genqrcode").mouseenter(function(e){ $(selGenQr).css(con); });
$("#a_genqrcode").mouseleave(function(e){ $(selGenQr).removeAttr("style"); });

//查詢訂單狀態
var selQuery = "#using_merchant, #out_trade_no, input[name=ip]";
$("#a_query").mouseenter(function(e){ $(selQuery).css(con); });
$("#a_query").mouseleave(function(e){ $(selQuery).removeAttr("style"); });

//關閉訂單
var selCancel = "#using_merchant, #out_trade_no, input[name=ip]";
$("#a_cancel").mouseenter(function(e){ $(selCancel).css(con); });
$("#a_cancel").mouseleave(function(e){ $(selCancel).removeAttr("style"); });

//退款
var selRefund = "#using_merchant, #out_trade_no, #refund_amount, input[name=ip]";
$("#a_refund").mouseenter(function(e){ $(selRefund).css(con); });
$("#a_refund").mouseleave(function(e){ $(selRefund).removeAttr("style"); });

//開始等待notify
var selNotify = "#trans_code, #check_code, input[name=xpay_server]";
$("#a_notify").mouseenter(function(e){ $(selNotify).css(con); });
$("#a_notify").mouseleave(function(e){ $(selNotify).removeAttr("style"); });

//顯示&隱藏註解
$(".container:eq(1)").find(".row:eq(0)>.box").mouseenter(function(e){ $("#annotate").slideDown("slow"); });
$(".container:eq(1)").find(".row:eq(0)>.box").mouseleave(function(e){ $("#annotate").hide("slow"); });
