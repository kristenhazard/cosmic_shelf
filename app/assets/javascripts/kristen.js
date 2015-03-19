$(document).ready( function() {

var shelf = $('.shelf-container');
var bookList = $('.shelf-container ul');
var book = $('.shelf-container ul li');
var containerWidth = book.closest(shelf).width() * 0.2;

/* size books according to book count in relation to shelf width */

$(bookList).each(function() {
	if ($(this).has('li')) {
		var bookCount = $(this).children().length;
		if (bookCount <= 2) {
			$(this).children().css('width', ($(this).closest('.shelf-container').width() * 0.5));
		}
		if (bookCount < 4) {
			$(this).children().css('width', ($(this).closest('.shelf-container').width() * 0.25));
		}
		if (bookCount >= 4) {
			$(this).children().css('width', ($(this).closest('.shelf-container').width() * 0.15));
		}
	}
});

/* This works in conjunction with the zoom-in css hover effect. It gives the element a high z-index whilst hovered */

$(book).hover(function() {
	$(this).css('z-index', '200');
}, function() {
	$(this).css('z-index', '10');
});

/* Scaling text in the book cover. */

});

$(window).load(function() {
$('.shelf-container li').each(function() {
	var bookHeight = $(this).height();
	var titleSize = bookHeight * 0.15;
	var subtitleSize = bookHeight * 0.075;
	var authorSize = bookHeight * 0.05;
	$(this).find('h1').css('font-size', titleSize);
	$(this).find('h4').css('font-size', subtitleSize);
	$(this).find('h6').css('font-size', authorSize);
});
});