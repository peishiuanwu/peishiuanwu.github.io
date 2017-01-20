var w_result = $("#w_result");

//產生QRcode
$("#w_native").on('click', function() {
    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/wxpay/native/" + $("input[name=using_merchant]").val()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/wxpay/native/" + $("input[name=using_merchant]").val()
    }

    $.ajax({
        url : url,
        type : "post",
        data : $("textarea[name=data]").val()
    })
    .done(function(resp) {
        w_result.empty();
        w_result.text("產生QRcode");

        output(resp);
        $("input[name=out_trade_no]").val(resp.out_trade_no);
        $("input[name=trans_code]").val(resp.trans_code);
        $("input[name=check_code]").val(resp.check_code);
        $("#qrcode").html('<div align="center"><img src="data:image/png;base64,'+resp.qrcode+'" height="200" width="200"><p>請使用微信APP掃描功能</p></div>');
    })
    .fail(function(jqxhr) {
        console.warn(jqxhr);
    });
});

//查詢訂單狀態
$("#w_query").on('click', function() {
    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/wxpay/query/" + $("input[name=using_merchant]").val() + "/" + $("input[name=out_trade_no]").val().trim()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/wxpay/query/" + $("input[name=using_merchant]").val() + "/" + $("input[name=out_trade_no]").val().trim()
    }

    $.ajax({
        url : url,
        type : "get"
    })
    .done(function(resp) {
        w_result.empty();
        w_result.text("查詢訂單狀態");

        output(resp);
    });
});

//關閉訂單
$("#w_close").on('click', function() {
    try {
        //restful api ip
        var ip = $("input[name=ip]").val();
        if (ip === "") {
            var url = "/rest/ivmpay/index.php/wxpay/close/" + $("input[name=using_merchant]").val() + "/" + $("input[name=out_trade_no]").val().trim()
        } else {
            var url = "http://" + ip + "/rest/ivmpay/index.php/wxpay/close/" + $("input[name=using_merchant]").val() + "/" + $("input[name=out_trade_no]").val().trim()
        }

        $.ajax({
            url: url,
            type: "delete"
        })
        .done(function(resp) {
            w_result.empty();
            w_result.text("關閉訂單");

            output(resp);
        })
        .fail(function(jqxhr) {
            console.warn(jqxhr);
        });
    } catch (e) {
        console.error(e);
    }
});

//退款
$("#w_refund").on('click', function() {
    var out_trade_no = $("input[name=out_trade_no]").val(),
        total_fee = $("input[name=fee]").val(),
        refund_fee = $("input[name=refund]").val()
    if (out_trade_no.length === 0) {
        return;
    }

    //restful api ip
    var ip = $("input[name=ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/wxpay/refund/" + $("input[name=using_merchant]").val()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/wxpay/refund/" + $("input[name=using_merchant]").val()
    }

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify({
            'Out_trade_no': out_trade_no,
            'Total_fee': total_fee,
            'Refund_fee': refund_fee
        })
    })
    .done(function(resp) {
        w_result.empty();
        w_result.text("退款");

        output(resp);
    });
});

//notify
$("#w_notify").on('click', function() {
    var self = this;
    if ($(self).data('waiting') === "true") {
        $(self).data('xhr').abort();
        $(self).html('開始等待notify');
    } else {
        $(self).html('中斷等待');
        $(self).data('waiting', "true");
        if ($('input[name=xpay_server]').val() != "") {
            var url = 'http://' + $('input[name=xpay_server]').val() + '/rest/ivmpay/index.php/query/' + $("input[name=trans_code]").val().trim() + '/' + $("input[name=check_code]").val().trim();
        } else {
            var url = '/rest/ivmpay/index.php/query/' + $("input[name=trans_code]").val().trim() + '/' + $("input[name=check_code]").val().trim();
        }

        $.ajax({
            beforeSend: function(jqxhr) {
                $(self).data('xhr', jqxhr);
            },
            url: url,
            type: 'get'
        })
        .done(function(resp) {
            w_result.empty();
            w_result.text("Notify");

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
    "box-shadow": "0 0 5px rgba(41, 148, 255, 1)",
    "border": "1px"
}
//產生QRCode
var selNative = "input[name=using_merchant], textarea[name=data], input[name=ip]";
$("#w_native").mouseenter(function(e){ $(selNative).css(con); });
$("#w_native").mouseleave(function(e){ $(selNative).removeAttr("style"); });

//查詢訂單狀態
var selQuery = "input[name=using_merchant], input[name=out_trade_no], input[name=ip]";
$("#w_query").mouseenter(function(e){ $(selQuery).css(con); });
$("#w_query").mouseleave(function(e){ $(selQuery).removeAttr("style"); });

//關閉訂單
var selClose = "input[name=using_merchant], input[name=out_trade_no], input[name=ip]";
$("#w_close").mouseenter(function(e){ $(selClose).css(con); });
$("#w_close").mouseleave(function(e){ $(selClose).removeAttr("style"); });

//退款
var selRefund = "input[name=using_merchant], input[name=out_trade_no], input[name=fee], input[name=refund], input[name=ip]";
$("#w_refund").mouseenter(function(e){ $(selRefund).css(con); });
$("#w_refund").mouseleave(function(e){ $(selRefund).removeAttr("style"); });

//開始等待notify
var selNotify = "input[name=trans_code], input[name=check_code], input[name=xpay_server]";
$("#w_notify").mouseenter(function(e){ $(selNotify).css(con); });
$("#w_notify").mouseleave(function(e){ $(selNotify).removeAttr("style"); });

//顯示&隱藏註解
$(".container:eq(1)").find(".row:eq(0)>.box").mouseenter(function(e){ $("#annotate").slideDown("slow"); });
$(".container:eq(1)").find(".row:eq(0)>.box").mouseleave(function(e){ $("#annotate").hide("slow"); });
