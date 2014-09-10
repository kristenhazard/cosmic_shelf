$(document).on("page:load ready", function() { 
  $.post("/bookshelf/get_books", function(user_books) { 
    buildBookshelf(JSON.parse(user_books)); 
  });

  function buildBookshelf(user_books) {
    // We use the user_books if available, otherwise we use the default_books
    if (user_books == null || user_books.length == 0) {      
      var books_we_use = default_books;
    } else {
      var books_we_use = { 'books': user_books };
    }

    //
    var sortTypes = new Array(sortAuthor, sortTitle, sortGenre, sortPubDate);
    var AUTHOR_SORT_TYPE = 0;
    var TITLE_SORT_TYPE = 1;
    var GENRE_SORT_TYPE = 2;
    var PUBDATE_SORT_TYPE = 3;

    // 
    createBookDivs(books_we_use["books"]);
    triggerIsotope();
    var currentSortType;
    sortAuthor();

    function createBookDivs(books_to_load) {
      //$('.bookshelf').empty();
      $.each(books_to_load, function(index, book) { 
        $new_div = $(document.createElement("div"))
                    .addClass("book")
                    .attr('data-author', book.author)
                    .attr('data-genre', book.genre)
                    .attr('data-description', book.description)
                    .attr('data-pubdate', book.published_date)
                    .attr('data-cover', book.cover_url)
                    .attr('data-title', book.title)
                    .appendTo($('.bookshelf'));
        $(document.createElement("img"))
          .attr({ src: book.cover_url, title: book.title })
          .appendTo($new_div);
      });
    }

    function triggerIsotope() {
      $('.bookshelf').isotope({
        itemSelector : '.book',
        layoutMode : 'fitRows',
        getSortData : {
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

    function sortAuthor() {
      $('.bookshelf').isotope({ sortBy : "author" });
      AuthorSortIcon();
      currentSortType = AUTHOR_SORT_TYPE;
      return false;
    }

    function sortTitle() {
      $('.bookshelf').isotope({ sortBy : "title" });
      TitleSortIcon();
      currentSortType = TITLE_SORT_TYPE;
      return false;
    }

    function sortGenre() {
      $('.bookshelf').isotope({ sortBy : "genre" });
      GenreSortIcon();
      currentSortType = GENRE_SORT_TYPE;
      return false;
    }

    function sortPubDate() {
      $('.bookshelf').isotope({ sortBy : "pubdate" });
      PubDateSortIcon();
      currentSortType = PUBDATE_SORT_TYPE;
      return false;
    }

    function cycleSortPriority() {
      if (currentSortType == sortTypes.length - 1) {
        currentSortType = 0;
      } else {
        currentSortType++;
      }
      return sortTypes[currentSortType]();
    }


    function showBook() {
      curBook = $('.bookshelf').data('isotope').filteredItems[0].element;
      $('#book-detail-author').text(curBook.getAttribute('data-author'));
      $('#book-detail-genre').text(curBook.getAttribute('data-genre'));
      $('#book-detail-pubdate').text(curBook.getAttribute('data-pubdate'));
      $('#book-detail-title').text(curBook.getAttribute('data-title'));
      $('#book-detail-description').text(curBook.getAttribute('data-description'));
      var cover = document.createElement("img");
      cover.src = curBook.getAttribute('data-cover');
      $('#book-detail-cover').empty();
      $('#book-detail-cover').append(cover);
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
    
    var NUM_BOOKS_IN_ROW = 7;
    function shiftShelfUpward() {
      var numBooksInShelf = $('.bookshelf').data('isotope').filteredItems.length;
      var numBooksToShift = numBooksInShelf > NUM_BOOKS_IN_ROW ? NUM_BOOKS_IN_ROW : 0;
      var itemsToAppend = new Array;
      for (var i = 0; i < numBooksToShift; i++) {
        console.log(i);
        var element = $('.bookshelf').data('isotope').filteredItems[i].element;
        itemsToAppend.push(element);
        element.remove();
      }
      $('.bookshelf').isotope('reloadItems').isotope();
      $('.bookshelf').append(itemsToAppend).isotope('appended', itemsToAppend);
    }
    
    $('#sort-icon').click(function () {
      cycleSortPriority();
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
      createBookDivs(booksFiltered);
      triggerIsotope();
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

    var shouldShowBook = true;

    /* We have detected a circle finger motion. If it continues
     * long enough to reach the threshold, it will interact
     * with the Cosmic Shelf.
     */
    function onCircleFinger() {
      circleFingerCount++;
      if (circleFingerCount >= CIRCLE_FINGER_THRESHOLD) {
        circleFingerCount = 0;
        if (shouldShowBook) {
          showBook();
          shouldShowBook = false;
        } else {
          hideBook();
          shouldShowBook = true;
        }
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
          shiftShelfUpward(); // INTERACTS WITH COSMIC SHELF 
          console.log("left"); // SWIPE LEFT DETECTED 
        }
      } else { // Otherwise must be positive direction => moving left to right => swipe right
        swipeRightCount++;
        if (swipeRightCount >= SWIPE_RIGHT_THRESHOLD) {
          swipeRightCount = 0;
          cycleSortPriority(); // INTERACTS WITH COSMIC SHELF
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
