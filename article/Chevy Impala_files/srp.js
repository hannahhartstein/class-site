$(function() {
    $("a.save-vehicle-btn-click[data-toggle='json']").on('click', function() {
        var $that = $(this);
        $.getJSON($that.attr("href"), function(data) {
            if (data.status == 'success') {
                if (data.watching) {
                    $that.addClass("active");
                }
                else {
                    $that.removeClass("active");
                }
            }
        });
        return false;
    });
});
