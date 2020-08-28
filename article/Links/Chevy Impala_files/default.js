$(window).load(function() {
    var $backToTop = $('.btn-back-to-top');

    $('[data-toggle="hidden-trim"]').click(function(e) {
        e.preventDefault();

        $(this).parent().hide();
        $('.hidden-trim').removeClass('hidden-trim');
    });

    $('[data-toggle="sticky-ad"]').click(function(e) {
        e.preventDefault();

        $('#privacy-banner').removeClass('at-bottom');
        $(this).closest('.sticky-ad').remove();

        $.get("/track/close-sticky-foot.json");
    });

    $('[data-year-dropdown]').click(function(e) {
        e.preventDefault();

        $(this).parent().toggleClass('active');
    });

    setInterval(function() {
        if (getScrollPercent() > 0) {
            $('body').addClass('header-small').removeClass('anon-saved-vehicles-open');
        } else {
            $('body').removeClass('header-small');
        }
    }, 50);

    $backToTop.click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: '0px'
        }, 1000);
    });

    if ($('[data-toggle="saved-vehicles"]').length) {
        $('[data-toggle="saved-vehicles"]').click(function(e) {
            e.preventDefault();
            $('body').toggleClass('anon-saved-vehicles-open');
        });
    }

    if ($('.mbl-expand').length) {
        $('.expandable .mbl-expand-title').click(function() {
            $(this).parents('.mbl-expand').toggleClass('mbl-expanded');
        })
    }

    if ($('.slideshow-full').length) {
        $('.slideshow-full-control.prev').click(function(e) {
            e.preventDefault();
            $('.thumbnail-slideshow .atd-slideshow-arrow.prev').trigger('click');
        });

        $('.slideshow-full-control.next').click(function(e) {
            e.preventDefault();
            $('.thumbnail-slideshow .atd-slideshow-arrow.next').trigger('click');
        });

        $(document).keyup(function(e){
            if ($('html').hasClass('slideshow-fixed')) {
                if(e.keyCode === 37) {
                    $('.thumbnail-slideshow .atd-slideshow-arrow.prev').trigger('click');
                }

                if(e.keyCode === 39) {
                    $('.thumbnail-slideshow .atd-slideshow-arrow.next').trigger('click');
                }
            }
        });
    }

    if ($('[data-expand-slideshow]').length) {
        $('[data-expand-slideshow]').click(function(e) {
            e.preventDefault();
            $('html').toggleClass('slideshow-fixed');
        });

        $(document).keyup(function(e){
            if(e.keyCode === 27) {
                $('html').removeClass('slideshow-fixed');
            }
        });
    }

    if ($('[data-slideup]').length) {
        $('[data-slideup]').click(function(e) {
            e.preventDefault();
            var target = $($(this).attr('data-slideup'));
            target.slideUp(400);
        });
    }

    $(".dfp_ad").each(function() {
        if (!$(this).is(":visible") || $(this).is(":empty")) {
            var prev = $(this).prev();
            if (prev.hasClass("ad-sponsor")) {
                prev.remove();
            }
            
            $(this).parents('.ad-728').addClass('no-ad');
            
            $(this).remove();
        }
    });

    if ($('[data-readmore]').length) {
        $('[data-readmore]').readmore({
            collapsedHeight: 300
        });
    }

  if ($('[atd-slideshow]').length > 0) {
    $('[atd-slideshow]').slideshow({
      controls: {
        enabled: true,
        outside: true,
        prevLabel: "&lsaquo;",
        nextLabel: "&rsaquo;"
      },
      theme: 'showcase-slideshow',
      autofit: true
    });
  }

  $('[data-smoothscroll]').click(function(e) {
      e.preventDefault();
      var target = $($(this).attr('data-smoothscroll'));
      $('html, body').animate({
          scrollTop: (target.offset().top - 180) + 'px'
      }, 600);
  });

  if ($('.easy-contact').length) {
    $('.easy-contact').swipe({
        swipeLeft: function() {
            $('.easy-contact').addClass('swiped');
        }
    });
  }

  if ($('[atd-slideshow-mini]').length > 0) {
    $('[atd-slideshow-mini]').slideshow({
      controls: {
        enabled: true,
        prevLabel: "&lsaquo;",
        nextLabel: "&rsaquo;"
      },
      theme: 'mini-slideshow',
      autofit: true
    });
  }

  if ($('[atd-slideshow-vdp]').length > 0) {
    $('[atd-slideshow-vdp]').slideshow({
      controls: {
        enabled: true,
        prevLabel: "&lsaquo;",
        nextLabel: "&rsaquo;"
      },
      theme: 'thumbnail-slideshow'
    });
  }

      if ($('[data-fix]').length) {
        var windowScroll = $(window).scrollTop();

        $('[data-fix]').each(function() {
            $(this).attr('data-offset', $('[data-fix-ph="' + $(this).attr('data-fix') + '"]').offset().top);

            $('[data-fix-ph="' + $(this).attr('data-fix') + '"]')
                .hide()
                .height($(this).height());

            if (windowScroll >= $(this).attr('data-offset') || $('body').hasClass('filters-expanded')) {
                $('[data-fix-ph="' + $(this).attr('data-fix') + '"]').show();
                $('body').addClass('search-fixed');
            } else {
                $('[data-fix-ph="' + $(this).attr('data-fix') + '"]').hide();
                $('body').removeClass('search-fixed');
            }
        });

        setInterval(function() {
            windowScroll = $(window).scrollTop();

            $('[data-fix]').each(function() {
                if (windowScroll >= $(this).attr('data-offset') || $('body').hasClass('filters-expanded')) {
                    $('[data-fix-ph="' + $(this).attr('data-fix') + '"]').show();
                    $('body').addClass('search-fixed');
                } else {
                    $('[data-fix-ph="' + $(this).attr('data-fix') + '"]').hide();
                    $('body').removeClass('search-fixed');
                }
            });
        }, 30);
    }

});

 
$(document).ready(function() {
    var $backToTop = $('.btn-back-to-top');

    setInterval(function() {
        if (getScrollPercent() > 0) {
            $backToTop.addClass('active');
        } else {
            $backToTop.removeClass('active');
        }

        // if near the bottom of the page, or have advanced filters open on legacy-srp
        if( ($('.sticky-ad').length && getScrollPercent() >= 90) || $('body').hasClass('filters-expanded') ){
            // hide sticky ad
            $('#privacy-banner').addClass('at-bottom');
            $('.sticky-ad').css('bottom', -$('.sticky-ad').height());
        } else if ($('.sticky-ad').length) {
            // show sticky ad
            $('#privacy-banner').removeClass('at-bottom');
            $('.sticky-ad').css('bottom', '0');
        }
    }, 30);

    $('[data-track]').click(function() {
        var action = $(this).attr('data-track').split("|");
        var track = ['_trackEvent'];
        track = track.concat(action);
        _gaq.push(track);
    });

    $('[data-trackchange]').on('change', function() {
        var action = $(this).attr('data-track').split("|");
        var track = ['_trackEvent'];
        track = track.concat(action);
        track = track.concat($(this).val());

        _gaq.push(track);
    });

    $('body').on('click', '[data-toggle="modal"]', function(e) {
        e.preventDefault();

        var target;

        if ($(this).attr('data-modal')) {
            target = $($(this).attr('data-modal'));
        } else {
            target = $($(this).attr('href'));
        }

        target.toggleClass('active');
        $('body').toggleClass('modal-open');

        // open/close callback
        var callback = null;

        if(target.hasClass('active') && target.data('on-open')) {
            callback = window[target.data('on-open')];
        } else if(target.data('on-close')) {
            callback = window[target.data('on-close')];
        }

        if(typeof callback === 'function') {
            callback(target);
        }
    });

    $('body').on('click', '[data-close="modal"]', function(e) {
        e.preventDefault();

        var target = $(this).parents('.modal-container');

        target.removeClass('active');

        $('body').removeClass('modal-open');

        // open/close callback
        var callback = null;

        if(target.data('on-close')) {
            callback = window[target.data('on-close')];
        }

        if(typeof callback === 'function') {
            callback(target);
        }
    });

    $('[data-toggle="navigation"]').click(function(e) {
        e.preventDefault();
        $('body').removeClass('filters-expanded').toggleClass('expanded');
    });

    $('[data-toggle="filters"]').click(function(e) {
        e.preventDefault();

        var body = $('body');

        if(body.hasClass('filters-expanded')) {
            var scrollOffset = parseInt(body.css('top').replace('px', ''), 10);
            body.removeClass('expanded')
                .css({top: 0})
                .removeClass('filters-expanded');

            if ($(window).width() <= 1024) {
                window.setTimeout(function() {
                    window.scrollTo(0, -scrollOffset);
                }, 0);
            }
        }
        else {
            body.removeClass('expanded')
                .css({top: 0 - window.scrollY + 'px'})
                .addClass('filters-expanded');
        }
    });

    if ($('[data-track-url]').length) {
        $('[data-track-url]').on('click', function() {
            if ($(this).data('track-url')) {
                $.getJSON($(this).data('track-url') + '?callback=?', function(d) {
                    // do nothing
                });
            }
        });
    }

    if ($('[data-tooltip]').length) {
        $('[data-tooltip]').each(function() {
            var trigger = $(this).attr('data-tooltip');
            var position = 'top';

            if ($(this).attr('data-tooltip-position')) {
                position = $(this).attr('data-tooltip-position');
            }

            if (trigger == 'click') {
                $(this).click(function(e) {
                    if ($(this).data('href')) {
                        $.getJSON($(this).data('href') + '?callback=?', function(d) {
                            // do nothing
                        });
                    }
                    e.preventDefault();
                });
            }

            if (trigger == 'focus') {
                $(this).tooltipster({
                    theme: 'tooltipster-shadow',
                    animation: 'grow',
                    contentAsHTML: true,
                    interactive: true,
                    position: position
                });

                $(this).focus(function() { $(this).tooltipster('show'); }).blur(function() { $(this).tooltipster('hide'); });
            }
            else {
                $(this).tooltipster({
                    theme: 'tooltipster-shadow',
                    trigger: trigger,
                    animation: 'grow',
                    contentAsHTML: true,
                    interactive: true,
                    position: position
                });
            }

        });
    }

    /* swipe left on search filters */
    $('#search-filters').swipe({
        swipeLeft: function() {
            $('[data-toggle="filters"]').trigger('click');
        }
    });

    if ($('[data-toggle="dropdown"]').length) {
        $('[data-toggle="dropdown"]').click(function(e) {
            e.preventDefault();

            var target = $($(this).attr('href'));
            $('.dropdown-menu').not(target).removeClass('active');
            target.toggleClass('active');
        });

        $(document).on('click', function(e) {
            if (!$(e.target).parents('.btn-dropdown-container').length) {
                $('.dropdown-menu').removeClass('active');
            }
        });
    }

    if ($('[atd-tabs]').length) {
        $('[atd-tabs]').each(function() {
            var container = $(this);
            var toggles = container.find('[atd-tabs-toggles]');
            var toggle = container.find('[atd-tabs-toggle]');
            var contents = container.find('[atd-tabs-content]');

            contents.css('min-height', toggles.height());

            toggle.click(function(e) {
                e.preventDefault();
                var target = $($(this).attr('href'));

                toggle.parent().removeClass('active');
                $(this).parent().addClass('active');

                contents.removeClass('active');
                target.addClass('active');
            });
        });
    }

    if ($('[atd-accordion]').length) {
        $('[atd-accordion]').each(function() {
            var container = $(this);
            var toggle = container.find('[atd-accordion-toggle]');

            toggle.click(function(e) {
                e.preventDefault();
                $(this).parent().find('[atd-accordion-content]').slideToggle(300);
            });
        });
    }

    $('[data-equiv]').change(function() {
        $('[data-equiv-btn]').removeClass('btn-disabled').removeAttr('disabled').addClass('btn-heylisten');
    });

    $('input[placeholder]').placeholder();

    $('#EmailInquiryForm').on('submit', function(e) {
        e.preventDefault();

        var data = {
            'EmailInquiry': {
                name: $('#EmailInquiryName').val(),
                email: $('#EmailInquiryEmail').val(),
                phone: $('#EmailInquiryPhone').val(),
                body: $('#EmailInquiryBody').val(),
                copy: $('#EmailInquiryCopy').is(':checked'),
                user_id: $('#EmailInquiryUserId').val(),
                car_id: $('#EmailInquiryCarId').val() ? $('#EmailInquiryCarId').val() : 0,
                motorcycle_id: $('#EmailInquiryMotorcycleId').val() ? $('#EmailInquiryMotorcycleId').val() : 0,
                rv_id: $('#EmailInquiryRvId').val() ? $('#EmailInquiryRvId').val() : 0,
                trailer_id: $('#EmailInquiryTrailerId').val() ? $('#EmailInquiryTrailerId').val() : 0
            },
            'g-recaptcha-response': grecaptcha.getResponse()
        },
        el = $(this);
        el.find('.inquiry-form-content').hide();
        el.find('.inquiry-form-loader').show();

        $.post('/front/contact', data, function(response) {
            if (response.status) {
                el.html('<p>Email has been successfully sent out! Thank you.</p>');
                $('.similar-vehicles-listings').show();
                $('.featured-listing-slides').slick('setPosition');
            } else {
                el.find('.inquiry-form-content').show();
                el.find('.inquiry-form-loader').hide();

                $('.nocaptcha-error').show().html(
                    response.message
                );

                grecaptcha.reset();
            }
        }, 'json');
    });
    
    $('[data-count]').mouseenter(function(e) {
        $(this).css('cursor', 'pointer');
    });
    $('[data-count]').on('click', function(e) {
        window.open($(this).attr('data-count'), '_blank');
    });

    $('#EmailInquiryPhone').inputmask({"mask": "(999) 999-9999"});
});

function getScrollPercent() {
    var h = document.documentElement, 
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';

    return (h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100;
}

// $(document).ready(function() {

//     var canonical = $('link[rel="canonical"]').attr('href');

//     var here = window.location.href;

//     if (here != canonical) {
//         $("body").prepend("<h2 style='background:white; font-size:20px; line-height:28px; color:red;'>" + canonical + " (canonical)<br>" + here + "</h2>");
//     } else {
//         $("body").prepend("<h2 style='background:white; font-size:20px; line-height:28px; color:green'>MATCH</h2>");
//     }
// });


function getCookie(name) {
    //get cookie str using regex
    var val_raw = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    
    // if not found, return null
    if( !val_raw ){
        return null;
    }
    
    // set val_raw to first item in matches arr
    val_raw = val_raw.pop();
    
    try{
        //attempt to json decode
        var val = JSON.parse(val_raw);
    }catch(e){
        // failed to json decode, return raw val
        return val_raw;
    }
    
    //return json decoded object
    return val;
}
function setCookie(name, value, days) {
    /*console.log('inside setting of the cookie');*/
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60)*1000);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (JSON.stringify(value) || "") + expires + "; path=/; ";
}
function eraseCookie(name) {
    document.cookie = name+'=; Path=/; Max-Age=-99999999;';
}

let privacy_banner = getCookie('privacy-banner-seen');
if( privacy_banner == null ){
    // the user is seeing the privacy banner for the first time 
    //   so then let's set the privacy-banner-close to 1
    setCookie('privacy-banner-seen', 1, 36500);
}else{
    // then let's hide the banner
    $('#privacy-banner').hide();
}

$('[data-close="ccpa-banner"]').click(function() {
    $('#privacy-banner').hide();
});