$(document).on("page:load ready", function() { 
  $.post("/bookshelf/get_books", function(data) { 
    buildBookshelf(JSON.parse(data)); 
  });

  function buildBookshelf(data) {
    if (data == null || data.length == 0) {      
      var books_we_use = books_o;
    } else {
      var books_we_use = { 'books': data };
    }

    // onload sort by author and display books
    defaultSort();
    displayBooks();
    
    // create array for the sort types.
    var sortTypes = new Array(sortTitle, sortGenre, sortPubDate, sortAuthor);
    var currentSortType = 0;

    function triggerIsotope() {
      $('.bookshelf').isotope({
        // options
        itemSelector : '.book',
        layoutMode : 'fitRows',
        getSortData : {
          // ...
          author : function ( $elem ) {
            return $($elem).attr('data-author');
          },
          genre : function ( $elem ) {
            return $($elem).attr('data-genre');
          },
          pubdate : function ( $elem ) {
            return $($elem).attr('data-pubdate');
          },
          title : function ( $elem ) {
            return $($elem).attr('data-title');
          }
        }
      });
    }

    function displayBooks() {
      var $bookshelf = $('.bookshelf');
      var $book = $('.book');
      $.each(books_we_use["books"], function(index, book) { 
        $new_div = $(document.createElement("div"))
                    .addClass("book")
                    .attr('data-author', book.author)
                    .attr('data-genre', book.genre)
                    .attr('data-pubdate', book.published_date)
                    .attr('data-title', book.title)
                    .appendTo($bookshelf);
        $(document.createElement("img"))
          .attr({ src: book.cover_url, title: book.title })
          .appendTo($new_div);
      });
      
      triggerIsotope();
    }

    function displayFilteredBooks(filteredBooks) {
        var $bookshelf = $('.bookshelf');
        var $book = $('.book');
        $('.bookshelf').empty();
        $.each(filteredBooks, function(index, book) { 
          $new_div = $(document.createElement("div"))
                      .addClass("book")
                      .attr('data-author', book.author)
                      .attr('data-genre', book.genre)
                      .attr('data-pubdate', book.published_date)
                      .attr('data-title', book.title)
                      .appendTo($bookshelf);
          $(document.createElement("img"))
            .attr({ src: book.cover_url, title: book.title })
            .appendTo($new_div);
        });
      
        triggerIsotope();
    }
    
    function defaultSort() {
      books_we_use.books.sort(function (a, b) {
        a = a.author,
        b = b.author;
        return a.localeCompare(b);
      });
    }

    function sortAuthor() {
      $('.bookshelf').isotope({ sortBy : "author" });
      AuthorSortIcon();
      return false;
    };

    function sortTitle() {
      $('.bookshelf').isotope({ sortBy : "title" });
      TitleSortIcon();
      return false;
    };

    function sortGenre() {
      $('.bookshelf').isotope({ sortBy : "genre" });
      GenreSortIcon();
      return false;
    };

    function sortPubDate() {
      $('.bookshelf').isotope({ sortBy : "pubdate" });
      PubDateSortIcon();
      return false;
    };

    function sortByTypes() {
      var i = currentSortType;
      if (currentSortType == sortTypes.length - 1) {
        currentSortType = 0;
      } else {
        currentSortType += 1;
      }
      return sortTypes[i]();
    };

    function showBook() {
      var book = books_we_use["books"][9];
      $('#book-detail-author').text(book.author);
      $('#book-detail-genre').text(book.genre);
      $('#book-detail-pubdate').text(book.published_date);
      $('#book-detail-title').text(book.title);
      $('#book-detail-description').text(book.description);
      $('#book-detail-cover').find('img')[0].src = book.cover_url;
      $('#book-detail').fadeToggle();
    }

    function showSearch() {
      $('#search-detail-icon').fadeIn();
      $('#search-detail-title').text('title');
      $('#search-detail-author').text('author');
      $('#search-detail-desc').text('description');
      $('#search-detail-genre').text('genre');
      $('#search-detail-pubdate').text('publication date');
      $('#search-detail-termbox').visible = true;
      $('#search-detail').fadeToggle();
    }

    function hideBook() {
      $('#book-detail').fadeOut('slow');
    }
    
    function swipeShelf() {
      var $bookshelf = $('.bookshelf')
      var $first_five_divs = $('div.book:lt(5)');
      $('.bookshelf').isotope( 'remove', $first_five_divs );
      $first_five_divs.appendTo($bookshelf);
    }
    
    $('#sort-icon').click(function () {
      sortByTypes();
    });

    $('#sort-icon-author').click(function () {
      sortAuthor();
      AuthorSortIcon();
    });

    $('#sort-icon-genre').click(function () {
      sortGenre();
      GenreSortIcon();
    });

    $('#sort-icon-title').click(function () {
      sortTitle();
      TitleSortIcon();
    });

    $('#sort-icon-pubdate').click(function () {
      sortPubDate();
      PubDateSortIcon();
    });

    $('#swipe-test').click(function () {
      swipeShelf();
    });

    $('#show-book').click(function () {
      showBook();
    });

    $('#hide-book').click(function () {
      hideBook();
    });

    $('#search-icon').click(function () {
      showSearch();
    });

    $('#search-detail-termBox').click(function () {
      $('#search-detail-termBox-term').text('kingsolver');
    });

    // search
    $('#search-detail-icon').click(function () {
      $('#search-detail').fadeOut('slow');
      $('#search-detail-termBox-term').text('');
      var booksFiltered = filterByAuthor(books_we_use, filterForAuthor);
      displayFilteredBooks(booksFiltered);
    });

    function filterByAuthor(allBooks, filterOfAuthor) {
      return $(allBooks.books).filter(function (index, item) {
        for (var i in filterOfAuthor) {
          if (!item[i].toString().match(filterOfAuthor[i])) return null;
        }
        return item;
      });
    }

    var filterForAuthor = {
      "title": new RegExp('(.*?)', 'gi'),
      "author": new RegExp('Kingsolver', 'gi'),
      "genre": new RegExp('(.*?)', 'gi'),
      "published_date": new RegExp('(.*?)', 'gi'),
      "cover_url": new RegExp('(.*?)', 'gi')
    };

    function AuthorSortIcon() {
      if ($('#sort-icon-author').attr("src").indexOf("_selected") >= 1) {
        return;
      }
    
      /* set sort icon selected state */
      var src = $('#sort-icon-author').attr("src").replace(".png", "_selected.png");
      $('#sort-icon-author').attr("src", src);
      
      /* clear other sort icon selected state */
      var src = $('#sort-icon-genre').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-genre').attr("src", src);
      var src = $('#sort-icon-pubdate').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-pubdate').attr("src", src);
      var src = $('#sort-icon-title').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-title').attr("src", src);
    }
  
    function GenreSortIcon() {
      if ($('#sort-icon-genre').attr("src").indexOf("_selected") >= 1) {
        return;
      }
      
      /* set sort icon selected state */
      var src = $('#sort-icon-genre').attr("src").replace(".png", "_selected.png");
      $('#sort-icon-genre').attr("src", src);
        
      /* clear other sort icon selected state */
      var src = $('#sort-icon-author').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-author').attr("src", src);
      var src = $('#sort-icon-pubdate').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-pubdate').attr("src", src);
      var src = $('#sort-icon-title').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-title').attr("src", src);
    }
    
    function PubDateSortIcon() {
      if ($('#sort-icon-pubdate').attr("src").indexOf("_selected") >= 1) {
        return;
      }
      
      /* set sort icon selected state */
      var src = $('#sort-icon-pubdate').attr("src").replace(".png", "_selected.png");
      $('#sort-icon-pubdate').attr("src", src);
        
      /* clear other sort icon selected state */
      var src = $('#sort-icon-author').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-author').attr("src", src);
      var src = $('#sort-icon-genre').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-genre').attr("src", src);
      var src = $('#sort-icon-title').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-title').attr("src", src);
    }
    
    function TitleSortIcon() {
      if ($('#sort-icon-title').attr("src").indexOf("_selected") >= 1) {
        return;
      }
      
      /* set sort icon selected state */
      var src = $('#sort-icon-title').attr("src").replace(".png", "_selected.png");
      $('#sort-icon-title').attr("src", src);
        
      /* clear other sort icon selected state */
      var src = $('#sort-icon-author').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-author').attr("src", src);
      var src = $('#sort-icon-genre').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-genre').attr("src", src);
      var src = $('#sort-icon-pubdate').attr("src").replace("_selected.png", ".png");
      $('#sort-icon-pubdate').attr("src", src);
    }

    /* LEAP MOTION STUFF EVERYTHING BELOW HERE */

    // Every FRAME_RATE frames we check for hand position.
    var FRAME_RATE = 10

    /* The Leap Motion will detect GESTURE_THRESHOLD many gestures before
     * it notifies the Cosmic Shelf that it has noticed a gesture
     * That means, the leap motion would have to detect SWIPE_LEFT_THRESHOLD=40 
     * left-swipe gestures before it actually signals the Cosmic Shelf. These *THRESHOLD
     * constants essentially change the sensitivity the Cosmic Shelf has
     * for the Leap Motion. The higher the *THRESHOLD number, the less
     * sensitive the Cosmic Shelf will be for gestures, which means 
     * you will have to do larger/more obvious gestures. If you want
     * the Cosmic Shelf to detect slighter/less obvious gestures, turn the *THRESHOLD
     * number down. 
     */ 
    var SWIPE_LEFT_THRESHOLD = 40;
    var SWIPE_RIGHT_THRESHOLD = 40;
    var CIRCLE_FINGER_THRESHOLD = 60;

    /* These count variables go up each time a gesture is registered.
     * For example, swipeLeftCount will go up by one each time a leftward
     * swipe is registered. Once it reaches SWIPE_LEFT_THRESHOLD, it will
     * signal the Cosmic Shelf (it waits to detect enough swipeLefts to
     * justify notifying the Cosmic Shelf).
     */
    var swipeLeftCount = 0;
    var swipeRightCount = 0;
    var circleFingerCount = 0;

    /* MIN_SWIPE_DISTANCE is the minimum distance your hand must move
     * before it registers as ONE swipe.
     */
    var MIN_SWIPE_DISTANCE = 30;

    /* We have detected a circle finger motion. If it continues
     * long enough to reach the threshold, it will interact
     * with the Cosmic Shelf.
     */
    function onCircleFinger() {
      circleFingerCount++;
      if (circleFingerCount >= CIRCLE_FINGER_THRESHOLD) {
        circleFingerCount = 0;
        showBook(); // INTERACTS WITH COSMIC SHELF
        console.log("circle"); // CIRCLE FINGER DETECTED
      }
    }

    /* We have detected a swipe motion. If it continues
     * long enough to reach the threshold, it will interact
     * with the Cosmic Shelf.
     */
    function onSwipe(curHand) {
      var direction = curHand.palmVelocity[0];
      if (direction < 0) { // Negative direction => moving right to left => swipe left
        swipeLeftCount++;
        if (swipeLeftCount >= SWIPE_LEFT_THRESHOLD) { 
          swipeLeftCount = 0;
          swipeShelf(); // INTERACTS WITH COSMIC SHELF 
          console.log("left"); // SWIPE LEFT DETECTED 
        }
      } else { // Otherwise must be positive direction => moving left to right => swipe right
        swipeRightCount++;
        if (swipeRightCount >= SWIPE_RIGHT_THRESHOLD) {
          swipeRightCount = 0;
          sortByTypes(); // INTERACTS WITH COSMIC SHELF
          console.log("right"); // SWIPE RIGHT DETECTED
        }
      }
    }

    // prevHand.palmVelocity[0] => The [0] acesses the x-velocity
    // prevHand.palmPosition[0] => The [0] acesses the x-position
    function detectSwipe(prevHand, curHand) {
      // If the either hand objects are null, no swipe, return
      if (prevHand == null  || curHand == null) return; 

      // PrevHand and curHand must have the same x-velocity sign (sign being positive or negative), 
      // otherwise that would imply that the hand changed direction. That doesn't constitute a full swipe.
      // If (prevHand's x-velocity * curHand's x-velocity) equals a negative number,
      // that would imply their x-velocity signs were different, and thus no swipe. That means we return.
      if (prevHand.palmVelocity[0] * curHand.palmVelocity[0] < 0) return; 

      // Now we check the x-distance between prevHand and curHand. It must be at least 
      // MIN_SWIPE_DISTANCE to count as a swipe. If it isn't, we return.
      if (Math.abs(prevHand.palmPosition[0] - curHand.palmPosition[0]) < MIN_SWIPE_DISTANCE) return;
      onSwipe(curHand);
    }

    var prevHand = null;
    var curHand = null;
    var options = { enableGestures: true }; 

    Leap.loop(options, function(frame) {
      // Every ten frames we check the velocity and position of the hand and then compare it with the previous stored velocity and position
      if (frame.id % FRAME_RATE == 0) { 
        prevHand = curHand;
        curHand = frame.hands[0];
      }

      var gestures = frame.gestures;
      if (gestures.length != 0) { // Did we detect a gesture?
        var gesture = gestures[0];
        if (gesture.type == "circle") { // Was the gesture a circle finger gesture?
          onCircleFinger();
        } else { // If it wasn't a circle finger, was it a swipe?
          detectSwipe(prevHand, curHand);
        } 
      } else {
        detectSwipe(prevHand, curHand);
      }
    });
  }
});
