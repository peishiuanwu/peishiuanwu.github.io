$.ajaxSetup({
    beforeSend: function() {
        output("等待回應中...");
    }
});

//upload
$('#merchant-form').on('click', 'button', function(e) {
    if ( ! confirm("確認送出?") ) {
        return;
    }

    if ($('#merchant_name').val().length === 0) {
        // Required
        $('#merchant_name').focus();
        return false;
    }

    if ($('#channel_id').val().length > 0 && $('#channel_secret_key').val().length > 0) {
        var data = {
            channel_id: $('#channel_id').val().trim(),
            channel_secret: $('#channel_secret_key').val().trim()
        }
    }

    //restful api ip
    var ip = $("input[name=merchant_ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/linepay/merchantinfo/" + $('#merchant_name').val()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/linepay/merchantinfo/" + $('#merchant_name').val()
    }

    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(data)
    })
    .done(function() {
        output("商戶設置成功");
    })
    .fail(function() {
        output("商戶設置失敗，通路ID(channel id)和通路密鑰(channel secret)皆不能為空值");
    });

    return false;
});
