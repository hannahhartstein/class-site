/* Mobile menu */

var open = false;

$(function(){
  $('.mobile-menu-button').click(function(){
    $('#menu').toggle();
    if(!open){
      $(this).addClass('open');
      open = !open;
    }
    else {
      $(this).removeClass('open');
      open = !open;
    }
  });
});

/* Disable hovers */

var touch = 'ontouchstart' in document.documentElement
            || (navigator.MaxTouchPoints > 0)
            || (navigator.msMaxTouchPoints > 0);

if (touch) { // remove all :hover stylesheets
    try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}
}
