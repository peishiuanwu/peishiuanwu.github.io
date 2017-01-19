$("#merchant-form").on('click', 'button', function() {
    if ( ! confirm("確認送出?") ) {
        return;
    }
    var formData = new FormData();

    if ($('#merchant_name').val().length === 0) {
        // Required
        $('#merchant_name').focus();
        return false;
    }

    $("#merchant-form input").each(function(_, input) {
        var $input = $(input);
        switch($input.attr('type')) {
            case 'text':
                if ($input.val().length > 0) {
                    formData.append($input.attr('name'), $input.val());
                }
                break;

            case 'file':
                var files = $input.prop('files');
                if (files.length === 0) {
                    break;
                }
                formData.append($input.attr('name'), files[0]);
                break;
        }
    });

    //restful api ip
    var ip = $("input[name=merchant_ip]").val();
    if (ip === "") {
        var url = "/rest/ivmpay/index.php/wxpay/merchantinfo/" + $('#merchant_name').val().trim()
    } else {
        var url = "http://" + ip + "/rest/ivmpay/index.php/wxpay/merchantinfo/" + $('#merchant_name').val().trim()
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
