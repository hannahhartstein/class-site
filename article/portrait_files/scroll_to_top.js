$(function () {

  /* Scroll to top link */

  $('a.scroll').each(function(){
    $(this).click(function(){
      $('html, body').animate({ scrollTop: 0 }, 600);
      return false;
    });
  });

  /* Put footer at the bottom if it's a short page */

  function checkFooter(){
    var window_height = $(window).height();
    var document_height = $(document).height();

    if(document_height > window_height){
      $('#footer').removeClass('bottom');
    }
    else {
      $('#footer').addClass('bottom');
    }
    console.log(window_height);
    console.log(document_height);
  }

  checkFooter();

  $(window).resize(function() {
    checkFooter();
  });

});
