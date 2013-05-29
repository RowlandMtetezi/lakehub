// JavaScript Document
$(document).ready(function(){		
		$('#ul_nav a').each(function(){
			$(this).attr('href', '#' + $(this).attr('href'));
		});
		
		$(window).bind('hashchange', function(e) {
			var url = e.fragment;
			$('#content-body_primary_primary').load(url + ' #content-body_primary_primary_wrap');
			$('#ul_nav li .current').removeClass('current');
			if (url) {
				var loadingImage = $('<img src="images/loading.gif"/>');
				$('#loading').append(loadingImage);
				$('#ul_nav a[href="#' + url + '"]').parents('li').addClass('current');
				$('#content-body_primary_primary_wrap').fadeOut('fast', function(){
					$('#loading').show();
				});
			} else {
				$('#ul_nav li:first-child').addClass('current');
			}
		});
		
		$(window).trigger('hashchange');
	}			  
);
