jQuery(document).ready(function($) {
	
	$('.scroll-to').bind('click.smoothscroll',function (e) {
		 e.preventDefault();
		
		 var target = this.hash,
		 $target = $(target);
		
		 $('html, body').stop().animate({
		  'scrollTop': $target.offset().top
		 }, 1000, 'swing', function () {
		  window.location.hash = target;
		 });
		});
	 
	 window.smoothScroll = function(target) {
		var scrollContainer = target;
		do { //find scroll container
			scrollContainer = scrollContainer.parentNode;
			if (!scrollContainer) return;
			scrollContainer.scrollTop += 1;
		} while (scrollContainer.scrollTop == 0);

		var targetY = 0;
		do { //find the top of target relatively to the container
			if (target == scrollContainer) break;
			targetY += target.offsetTop;
		} while (target = target.offsetParent - 80);

		scroll = function(c, a, b, i) {
			i++; if (i > 30) return;
			c.scrollTop = a + (b - a) / 30 * i;
			setTimeout(function(){ scroll(c, a, b, i); }, 20);
		}
		// start scrolling
		scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
	 }

	 //$(".marketing-items").slick();

	$('#modalChangePassword').modal('show');
	
});