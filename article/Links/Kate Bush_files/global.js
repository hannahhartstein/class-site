jQuery(document).ready(function(){

  if(parent.jQuery && parent.jQuery.fancybox) {
    jQuery("a[rel^='prettyPhoto']").fancybox({
          'titlePosition'	: 'inside',
          'titleFormat'		: function(title, currentArray, currentIndex, currentOpts) {
            imgtitle = title.split('||');
            var out = (imgtitle[1].length ? '<strong>'+imgtitle[1] + '</strong><br />' : '');
            return out + 'Image ' + (currentIndex + 1) + ' / ' + currentArray.length + (imgtitle[0].length ? ' &nbsp; ' + imgtitle[0] : '');
          }
        });
  }

  //jQuery(".view-gallery-thumbs .item-list a img, .view-video-gallery .item-list a img, .view-images-all-thumbs .item-list a img, .view-id-videos_all_thumbs a img").mouseenter(function(){jQuery(this).stop().fadeTo('fast', 0.3)}).mouseleave(function(){jQuery(this).stop().fadeTo('fast', 1)});
  jQuery(".view-gallery-thumbs .item-list a img, .view-video-gallery .item-list a img, .view-images-all-thumbs .item-list a img, .view-id-videos_all_thumbs a img").bind('mouseenter', function() {
    jQuery(this).stop().fadeTo('fast', 0.3);
  });
  jQuery(".view-gallery-thumbs .item-list a img, .view-video-gallery .item-list a img, .view-images-all-thumbs .item-list a img, .view-id-videos_all_thumbs a img").bind('mouseleave', function() {
    jQuery(this).stop().fadeTo('fast', 1);
  });
  
	jQuery("tr:odd").addClass("odd");

	jQuery('a[rel=external]').attr('target','_blank');

  var searchdefault = 'Search';
  
	jQuery('#edit-search-theme-form-1').val(searchdefault);
  jQuery('#edit-search-theme-form-1').focus(function(){ if ($(this).val() == searchdefault) $(this).val(''); });
  jQuery('#edit-search-theme-form-1').blur(function() { if ($(this).val() == '') $(this).val(searchdefault); });
  
  if (jQuery('ul.shopmenu-links').size()) {  
    jQuery('#js-topnavmenu li.last').click(function(e){
      e.preventDefault();
      jQuery('ul.shopmenu-links').toggle();
    });
  }
  
  if (jQuery('.js-preview-discography-btn').size()) {  
    jQuery('.js-preview-discography-btn').click(function(e){
      e.preventDefault();
      var width = jQuery('.modal-init-content').children().css('width').slice(0, -2);
      var height = jQuery('.modal-init-content').children().css('height').slice(0, -2);
      var padding_hor = parseInt(jQuery('.modal-init-content').css('padding-left').slice(0, -2));
      var padding_ver = parseInt(jQuery('.modal-init-content').css('padding-top').slice(0, -2));
      var window_width = jQuery(window).width();
      var window_height = jQuery(window).height();
      
      jQuery('.modal-holder').css('width', width + 'px');
      jQuery('.modal-holder').css('height', height + 'px');
      jQuery('.modal-holder').css('margin-left', '-' + (width/2 + padding_hor) + 'px');
      jQuery('.modal-holder').css('margin-top', '-' + (height/2 + padding_ver) + 'px');
      jQuery('.modal-content').html(jQuery('.modal-init-content').html());  // refresh the content
      if (jQuery('.modal-content').find('iframe').size()) {
        jQuery('.modal-content iframe').attr('src', jQuery('.modal-content iframe').attr('src'));
      }
      jQuery('.modal-bkg').show();
      
      jQuery('.modal-bkg').click(function(e){
        if (e.target === this) {
          closeModal();
        }
      });
      
    });
    
    jQuery('.modal-close').click(function(e){
      e.preventDefault();
      closeModal();
    });
    
    function closeModal()
    {
      jQuery('.modal-bkg').unbind('click');
      jQuery('.modal-bkg').hide();
      jQuery('.modal-content iframe').attr('src', '');
      jQuery('.modal-content').html('');
    }
  }

});