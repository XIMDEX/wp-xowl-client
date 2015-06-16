(function ($) {
    $(document).ready(function () {
        var checkTokenButton = $("#xowl-check-token");

        function setSpanText(error) {
            if (error) {
                $('#is-valid-token').html(' Invalid token').removeClass('token-valid').addClass('token-invalid');
            } else {
                $('#is-valid-token').html(' Valid token!').removeClass('token-invalid').addClass('token-valid');
            }
        }

        checkTokenButton.click(function () {
            var activeApiEnpoint = $("#active-api-endpoint").val();
            var activeApiToken = $("#active-api-token").val();

            var checkUrl = activeApiEnpoint.split("/");
            checkUrl.pop();
            checkUrl.push("check");

            $.post(checkUrl.join("/"), {token: activeApiToken})
            .done(function (data) {
                if (data.status === 'ok') {
                    setSpanText(false);
                }
                else {
                    setSpanText(true);
                }
            })
            .fail(function () {
                setSpanText(true);
            });
        });
    });
})(jQuery);
    