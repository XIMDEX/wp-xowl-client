(function ($) {
    $(document).ready(function () {
        var checkTokenButton = $("#xowl-check-token");

        function setSpanText(error) {

            var check1   = $('#xowl-check-icon-1');
            var check2   = $('#xowl-check-icon-2');

            check1.hide ();
            check2.hide ();

            if (error)  check1.show ();
            else        check2.show ();
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
