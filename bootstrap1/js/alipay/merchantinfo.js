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
    var formData = new FormData();

    if ($('#merchant_name').val().length === 0) {
        // Required
        $('#merchant_name').focus();
        return false;
    }

    if ($('#appid').val().length > 0) {
        // Optional
        formData.append('appid', $('#appid').val().trim());
    }

    $('input[type=file]').each(function(_, input) {
		console.log(input)
        var files = $(input).prop('files');
        if (files.length === 0) {
            return;
        }
        formData.append($(input).attr('name'), files[0]);
    });

    //restful api ip
    var ip = $("input[name=merchant_ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/alipay/merchantinfo/" + $('#merchant_name').val().trim()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/alipay/merchantinfo/" + $('#merchant_name').val().trim()
    }

    $.ajax({
        url: url,
        type: 'post',
        cache: false,
        contentType : false,
        processData : false,
        data: formData
    })
    .done(function() {
        output("商戶設置成功");
    })
    .fail(function() {
        output("商戶設置失敗");
    });

    return false;
});
