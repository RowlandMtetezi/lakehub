$(document).ready(function() {

	$posts = null;
	$post_count = 0;
	$offset = 0;

	//use ajax to get the comment number for the first two blog posts
	$.each($(".latest_news .post"), function(){
		$(this).find("span").html(getFBcomments($(this).find(".image a").attr("href")));
	});

	//retrieve 20 recent blog posts
	$.getJSON("http://noblestudios.com/incl/json_recent_blog_posts_home",
		{
			username: "not someusernamethatdoesntexist",
			limit: 20
		},
		function(data) {
			//store the posts
			$posts = data.posts;
			//store post length
			$post_count = data.posts.length;
			var cache = [];
			//cache each image
			$.each(data.posts, function(index, value){
				var cacheImage = document.createElement("img");
				cacheImage.src = data.posts[index].image;
				cache.push(cacheImage);
			});
			
		});

	//handle the next click
	$(".next_posts").bind("click", function(){
		//figure out what next posts are
		$offset = $offset + 2;
		if($offset >= $post_count){
			$offset = 0;
		}
		
		//fade out
		$('.latest_news').animate({
			opacity: 0.0
		}, 200, function() {
			$x = 0;
			//swap out data
			for($i=$offset;$i<=$offset+1;$i++){
				$news_entry = $(".latest_news .post").eq($x);
				$news_entry.find(".image img").attr("src", $posts[$i].image);
				$news_entry.find(".image a").attr("href", $posts[$i].page_url);
				$news_entry.find(".summary h3 a").html($posts[$i].title);
				$news_entry.find(".summary h3 a").attr("href", $posts[$i].page_url);
				$news_entry.find(".summary p").html($posts[$i].summary);
				$news_entry.find(".post_continue a").attr("href", $posts[$i].page_url);
				$news_entry.find(".post_discuss a").attr("href", $posts[$i].page_url+"#discuss");
				$news_entry.find(".fb_comments_count").html(getFBcomments($posts[$i].page_url));
				$x++;
			}
			
			//animate back in
			$('.latest_news').animate({
				opacity: 1.0
			}, { queue: true, duration: 200 }, function(){});});
		
	});
	
	$(".prev_posts").bind("click", function(){
		$offset = $offset - 2;
		if($offset < 0){
			$offset = $post_count - 2;
		}
		$('.latest_news').animate({
			opacity: 0.0
		}, 200, function() {
			$x = 0;
			for($i=$offset;$i<=$offset+1;$i++){
				$news_entry = $(".latest_news .post").eq($x);
				$news_entry.find(".image img").attr("src", $posts[$i].image);
				$news_entry.find(".image a").attr("href", $posts[$i].page_url);
				$news_entry.find(".summary h3").html($posts[$i].title);
				$news_entry.find(".summary p").html($posts[$i].summary);
				$news_entry.find(".post_continue a").attr("href", $posts[$i].page_url);
				$news_entry.find(".post_discuss a").attr("href", $posts[$i].page_url+"#discuss");
				$news_entry.find(".fb_comments_count").html(getFBcomments($posts[$i].page_url));
				$x++;
			}
			
			$('.latest_news').animate({
				opacity: 1.0
			}, { queue: true, duration: 200 }, function(){});});

	});

	function getFBcomments($page_url){
    $.ajax({
        url: 'http://graph.facebook.com/'+$page_url,
        dataType: 'jsonp',
        success: function(data) {
					
				if(typeof data.comments !== 'undefined' ){
					return data.comments;
				}
				else{
					return "0";
				}
       }
    });
	}

});

(function($) { 
	var cache = [];
	
	// Arguments are image paths relative to the current page. 
	$.preLoadImages = function() {
		var args_len = arguments.length; 
		for (var i = args_len; i--;) { 
			var cacheImage = document.createElement("img");
			cacheImage.src = arguments[i];
			cache.push(cacheImage);
		}
	}
})(jQuery);
var ielt9 = $.browser.msie && $.browser.version.substr(0,1)<9;
		var BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
jQuery.fn.onImagesLoaded = function( callback ) {
	var $this = this,
		deferred = $.isFunction($.Deferred) ? $.Deferred() : 0,
		hasNotify = $.isFunction(deferred.notify),
		$images = $this.find("img").add( $this.filter("img") ),
		loaded = [],
		proper = [],
		broken = [];

	// Register deferred callbacks
	if ($.isPlainObject(callback)) {
		$.each(callback, function (key, value) {
			if (key === "callback") {
				callback = value;
			} else if (deferred) {
				deferred[key](value);
			}
		});
	}

	function doneLoading() {
		var $proper = $(proper),
			$broken = $(broken);

		if ( deferred ) {
			if ( broken.length ) {
				deferred.reject( $images, $proper, $broken );
			} else {
				deferred.resolve( $images );
			}
		}

		if ( $.isFunction( callback ) ) {
			callback.call( $this, $images, $proper, $broken );
		}
	}

	function imgLoadedHandler( event ) {
		imgLoaded( event.target, event.type === "error" );
	}

	function imgLoaded( img, isBroken ) {
		// don"t proceed if BLANK image, or image is already loaded
		if ( img.src === BLANK || $.inArray( img, loaded ) !== -1 ) {
			return;
		}

		// store element in loaded images array
		loaded.push( img );

		// keep track of broken and properly loaded images
		if ( isBroken ) {
			broken.push( img );
		} else {
			proper.push( img );
		}

		// cache image and its state for future calls
		$.data( img, "imagesLoaded", { isBroken: isBroken, src: img.src } );

		// trigger deferred progress method if present
		if ( hasNotify ) {
			deferred.notifyWith( $(img), [ isBroken, $images, $(proper), $(broken) ] );
		}

		// call doneLoading and clean listeners if all images are loaded
		if ( $images.length === loaded.length ) {
			setTimeout( doneLoading );
			$images.unbind( ".imagesLoaded", imgLoadedHandler );
		}
	}

	// if no images, trigger immediately
	if ( !$images.length ) {
		doneLoading();
	} else {
		$images.bind( "load.imagesLoaded error.imagesLoaded", imgLoadedHandler )
		.each( function( i, el ) {
			var src = el.src;

			// find out if this image has been already checked for status
			// if it was, and src has not changed, call imgLoaded on it
			var cached = $.data( el, "imagesLoaded" );
			if ( cached && cached.src === src ) {
				imgLoaded( el, cached.isBroken );
				return;
			}

			// if complete is true and browser supports natural sizes, try
			// to check for image status manually
			if ( el.complete && el.naturalWidth !== undefined ) {
				imgLoaded( el, el.naturalWidth === 0 || el.naturalHeight === 0 );
				return;
			}

			// cached images don"t fire load sometimes, so we reset src, but only when
			// dealing with IE, or image is complete (loaded) and failed manual check
			// webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
			if ( el.readyState || el.complete ) {
				el.src = BLANK;
				el.src = src;
			}
		});
	}

	return deferred ? deferred.promise( $this ) : $this;
};
var Slideshow3 = (function() {
	var index = 0,
		basedir = "http://noblestudios.com/",
		images = [
			{ image : "images/slideshow_images/home.jpg", caption : "<h1>Noble Studios</h1><h2>Full-Service Digital Agency</h2><p>We offer engagement on every front. View all our services.</p>", link : "/services", linkText : "Go", linkClass : "go_button", altText : "Noble Studios" },
			{ image : "images/slideshow_images/home_infographic.jpg", caption : "<h1>New Work</h1><h2>MSNBC's Your Business</h2><p>How to create an infographic to help your business.</p>", link : "http://noblestudios.com/work/how-to-create-an-infographic/", linkText : "Go", linkClass : "go_button", altText : "MSNBC's Your Business" },
			{ image : "images/slideshow_images/temp_file_home_tahoe_south1.jpg", caption : "<h1>New Work</h1><h2>Tahoe South Mobile</h2><p>Celebrating Tahoe South as a year-round travel destination and outdoor mecca.</p>", link : "/work/tahoe-south-mobile/", linkText : "Go", linkClass : "go_button", altText : "Tahoe South Mobile" },
			{ image : "images/slideshow_images/homepage-slideshow-pahrump-testing.jpg", caption : "<h1>New Work</h1><h2>Town of Pahrump</h2><p>Townâ€™s debut tourism website showcases Nevadaâ€™s basecamp to adventure.</p>", link : "/work/town-of-pahrump-website/", linkText : "Go", linkClass : "go_button", altText : "Town of Pahrump Tourism Website" },
			{ image : "images/slideshow_images/homepage-slideshow-autodesk-v2-2013.jpg", caption : "<h1>New Work</h1><h2>Autodesk iPad App</h2><p>We created an enterprise edition iPad app for Autodesk.</p>", link : "/work/sales-tool-ipad-app/", linkText : "Go", linkClass : "go_button", altText : "Autodesk" },
			{ image : "images/slideshow_images/air_asia_2.jpg", caption : "<h1>Publicis Mojo & Noble Studios</h1><h2>AirAsia Australia Friendsy</h2><p>Weâ€™re no strangers to developing robust Facebook campaigns.</p>", link : "/work/airasia/", linkText : "Go", linkClass : "go_button", altText : "Facebook Air Asia" },
			{ image : "images/slideshow_images/2012_Noble_homepage_Lineage.jpg", caption : "<h1>New Work</h1><h2>Lineage Logistics</h2><p>We took a logistics company and created an all new digital experience.</p>", link : "/work/lineage-logistics/", linkText : "Go", linkClass : "go_button", altText : "Lineage Logistics" }
		],
		settings = {
			dimensions : {
				imageWidth : 1000,
				imageHeight : 478
			},
			speedclick : true,
			easing : "easeOutQuad",
			duration : 900,
			autoplay : {
				enabled : true,
				idleStart : 8000,
				duration : 8000,
				idleReset : 8000
			},
			caption : {
				easing : "easeOutQuad",
				fadeInDuration : 1000,
				delay : 200,
				fadeOutDuration : 300
			}
		},
		thisTime = 50000, lastTime = 0,
		autoplayInterval, idleTimeout;
	var $mask, $slider, $caption;
	
	domready();
	init();
	
	function domready() {
		$(document).ready(function() {
		
				$("#slideshow3_previous").click(function() {
					previous(1);
				});
				$("#slideshow3_next").click(function() {
					next(1);
				});
				
				$("#slideshow3_overlay_center").hover( function () {  
					$("#slideshow3_caption .go_button").addClass( "active" );
				}, function () {
					$("#slideshow3_caption .go_button").removeClass( "active" );
				});
		
			$mask = $("#slideshow3_mask");
			$slider = $("#slideshow3_slider");
			$caption = $("#slideshow3_caption a.caption");
			
			jQuery.preLoadImages("images/slideshow_images/home.jpg","images/slideshow_images/home_infographic.jpg","images/slideshow_images/temp_file_home_tahoe_south1.jpg","images/slideshow_images/homepage-slideshow-pahrump-testing.jpg","images/slideshow_images/homepage-slideshow-autodesk-v2-2013.jpg","images/slideshow_images/air_asia_2.jpg","images/slideshow_images/2012_Noble_homepage_Lineage.jpg");
			
			startAutoplay();
		});
	}
	function init() {
		for(var i=0; i<images.length; i++)
			(new Image()).src = images[i].image;
	}
	function autoplay() {
		if(!settings.autoplay.enabled) return;
		if(autoplayInterval == null)
			autoplayInterval = setInterval(autoplay, settings.autoplay.duration);
		clearTimeout(idleTimeout);
		next();
	}
	function startAutoplay() {
		if(settings.autoplay.enabled) {
			clearInterval(autoplayInterval);
			clearTimeout(idleTimeout);
			idleTimeout = setTimeout(autoplay, settings.autoplay.idleStart);
		}
	}
	function pauseAutoplay() {
		clearInterval(autoplayInterval);
		clearTimeout(idleTimeout);
	}
	function resetAutoplay() {
		if(settings.autoplay.enabled) {
			clearInterval(autoplayInterval);
			clearTimeout(idleTimeout);
			idleTimeout = setTimeout(autoplay, settings.autoplay.idleReset);
		}
	}
	function previous(e) {
		if(e != null) resetAutoplay();
		goto((index == 0 ? images.length - 1 : index - 1), (index == 0 ? images.length - 2 : (index == 1 ? images.length - 1 : index - 2)), "left");
	}
	function next(e) {
		if(e != null) resetAutoplay();
		goto((index == images.length - 1 ? 0 : index + 1), (index == images.length - 1 ? 1 : (index == images.length - 2 ? 0 : index + 2)), "right");
	}
	function goto(newIndex, i, direction) {
		if(index == i) return;
		
		if(settings.speedclick) {
			lastTime = thisTime;
			thisTime = new Date().getTime();
		}
		
		if(direction == null)
			direction = (i > index) ? "right" : "left";
		
		index = newIndex;
		$slider.add($caption).stop(1, 1);
		var header_link = images[i].link;
		if(header_link == "") {
			header_link = "javascript:void(0);";
		}
		var alt_tag = images[i].altText;
		if(alt_tag != "") {
			alt_tag = " alt='"+alt_tag+"'";
		}
		
		switch(direction) {
			case "left":
				$slider.prepend("<a href='"+header_link+"'><img"+alt_tag+" src='"+basedir+images[i].image+"' width='"+settings.dimensions.imageWidth+"' height='"+settings.dimensions.imageHeight+"' /></a>");
				$slider.children("a").children("img:first").onImagesLoaded(function() {
					if($.browser.msie && $(window).width() >= 1000) {
						$("#slideshow3_slider a img").css({"width":"1000px", "height":"478px"});
					}
					$slider.css("left", -parseInt(1000)).animate({ left : 0 }, { queue : false, easing : settings.easing, duration : Math.min(settings.duration, thisTime - lastTime), complete : function() {$(this).children("a:last").remove();}});
				});
				break;
			case "right":
				$slider.append("<a href='"+header_link+"'><img"+alt_tag+" src='"+basedir+images[i].image+"' width='"+settings.dimensions.imageWidth+"' height='"+settings.dimensions.imageHeight+"' /></a>");
				$slider.children("a").children("img:last").onImagesLoaded(function() {
					if($.browser.msie && $(window).width() >= 1000) {
						$("#slideshow3_slider a img").css({"width":"1000px", "height":"478px"});
					}
					$slider.animate({ left : -parseInt(1000) }, { queue : false, easing : settings.easing, duration : Math.min(settings.duration, thisTime - lastTime), complete : function() {$(this).css("left", 0).children("a:eq(0)").remove();}});
				});
				break;
		}
		updateCaption();
	}
	function updateCaption() {
		if(ielt9) {
			$caption.css("display", "none").empty().html(images[index].caption)
			$caption.delay(Math.min(settings.caption.fadeOutDuration + settings.caption.delay, thisTime - lastTime)).queue(function(next) {
				$caption.css("display", "block");
				next();
			});
		} else {
			$caption.animate({ opacity : 0 }, { queue : false, easing : settings.caption.easing, duration : Math.min(settings.caption.fadeOutDuration, (thisTime - lastTime) / 2), complete : function() {
				$caption.empty().html(images[index].caption)
				$caption.delay(Math.min(settings.caption.delay, thisTime - lastTime)).animate({ opacity : 1 }, { easing : settings.caption.easing, duration : Math.min(settings.caption.fadeInDuration, (thisTime - lastTime) / 2) });
			}});
		}

		$caption.attr( "href", images[index].link );
		$caption.next().attr( "href", images[index].link );
		$("#slideshow3_overlay_center").attr( "href", images[index].link );
	}
  	function getindex() {
    		return index;
  	}
  	function getimagecnt() {
    		return images.length;
  	}

	
	return {
		"domready" : domready,
		"pauseAutoplay" : pauseAutoplay,
		"previous" : previous,
		"next" : next,
		"goto" : goto,
		"getindex" : getindex,
		"getimagecnt" : getimagecnt
	};
})();