
  
	$('.js-menu-toggle').on("click",function(e) {
  
		var $this = $(this);
  
		$('#icon-message').toggleClass("fas");
		$('#icon-message').toggleClass("far");
  
		$('body').toggleClass('show-sidebar');
		e.preventDefault();
  
	});
  
	// click outisde offcanvas
	$(document).on("mouseup",function(e) {
	  var container = $(".sidebar");
	  if (!container.is(e.target) && container.has(e.target).length === 0) {
		$('body').removeClass('show-sidebar');
		
			  $('#icon-message').removeClass("fas");
			  $('#icon-message').addClass("far");
	  }
	  }); 
  
	  