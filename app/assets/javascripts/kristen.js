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
			$(this).children().css('width', ($(this).closest('.shelf-container').width() * 0.2));
		}
		if (bookCount >= 4) {
			$(this).children().css('width', ($(this).closest('.shelf-container').width() * 0.15));
		}
	}
});

});