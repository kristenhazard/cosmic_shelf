
if ($('#bookshelf_isotope_background').length > 0) {
  $(document).on("page:load ready", function() { 
    $.post("/bookshelf/get_books", function(user_books) { 
      buildAndMaintainShelf(JSON.parse(user_books)); 
    });

    function buildAndMaintainShelf(user_books) {
      /* BUILDING SHELF, CREATING BOOK DIVS, AND SETTING UP ISOTOPE ******************************/

      // We use user_books if available, otherwise we use default_books
      if (user_books == null || user_books.length == 0) {      
        var books_we_use = default_books;
      } else {
        var books_we_use = { 'books': user_books };
      }

      createBookDivs(books_we_use["books"]);
      triggerIsotope();
          
      // The div id 'current-selection' is highlighted yellow for showBook
      var curBook = $('.bookshelf').data('isotope').filteredItems[0].element.children[0];
      curBook.id = 'current-selection';

      // Default/onload sort type is author
      var currentSortType = AUTHOR_SORT_TYPE;
      sortAuthor();

      function createBookDivs(books_to_load) {
        $.each(books_to_load, function(index, book) { 
          $new_div = $(document.createElement("div"))
            .addClass("book")
            .attr('data-author', book.author)
            .attr('data-genre', book.genre)
            .attr('data-description', book.description)
            .attr('data-pubdate', book.published_date)
            .attr('data-cover', book.cover_url)
            .attr('data-title', book.title)
            .attr('data-hidden', '0')
            .appendTo($('.bookshelf'));
            $(document.createElement("img"))
              .attr({ src: book.cover_url, title: book.title, class: "book-cover" })
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
            },
            hidden : function ( $elem ) {
              return $($elem).attr('data-hidden');
            }
          }
        });
      }

      /* PLACING ICONS AND SETTING UP ONCLICK EVENTS ******************************/

      // Search
      $('#search-icon').click(function () {
        showSearch();
      });

      $('#search-detail-termBox').click(function () {
        $('#search-detail-termBox-term').text('kingsolver');
      });

      $('#search-detail-icon').click(function () {
        $('#search-detail').fadeOut('slow');
        $('#search-detail-termBox-term').text('');
        var booksFiltered = filterByAuthor(books_we_use, filterForAuthor);
        createBookDivs(booksFiltered);
        triggerIsotope();
      });

      // Show book detail
      $('#show-book').click(function () {
        showBook();
      });

      // Hide book detail
      $('#hide-book').click(function () {
        hideBook();
      });

      // Shift entire row upward
      $('#shift-shelf').click(function () {
        shiftShelfUpward();
      });

      // Shift single book
      $('#single-shift-shelf').click(function () {
        shiftSingleBook();
      });

      // Cycle sort priority (author => title => genre => publish date => repeat)
      $('#sort-icon').click(function () {
        cycleSortPriority();
      });

      // Author
      $('#sort-icon-author').click(function () {
        sortAuthor();
        AuthorSortIcon();
      });

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

      // Title
      $('#sort-icon-title').click(function () {
        sortTitle();
        TitleSortIcon();
      });

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

      // Genre
      $('#sort-icon-genre').click(function () {
        sortGenre();
        GenreSortIcon();
      });
    
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

      // Published date
      $('#sort-icon-pubdate').click(function () {
        sortPubDate();
        PubDateSortIcon();
      });
      
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

      /* SEARCH ******************************/

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

      /* SHOW AND HIDE BOOK DETAIL ******************************/

      // We trigger showBook when shouldShowBook is true, and hideBook when it is false
      var shouldShowBook = true;

      function showBook() {
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
        shouldShowBook = false;      
      }

      function hideBook() {
        $('#book-detail').fadeOut('slow');
        shouldShowBook = true;      
      }

      /* SORTING AND SHIFTING THE BOOKS AROUND ******************************/

      // This sort of acts like an enumerated list, which helps us track and change the current sort type
      var sortTypes = new Array(sortAuthor, sortTitle, sortGenre, sortPubDate, sortHidden);
      var AUTHOR_SORT_TYPE = 0;
      var TITLE_SORT_TYPE = 1;
      var GENRE_SORT_TYPE = 2;
      var PUBDATE_SORT_TYPE = 3;
      var HIDDEN_SORT_TYPE = 4;

      var NUM_BOOKS_IN_ROW = 7;

      /* Every book div has a 'data-hidden' attribute that isotope can use to sort.
       * This field allows us to shift rows/single books. This attribute is always 
       * a number. When we want to shift a row upward, we increment this 'data-hidden'
       * number by 1 on the first 7 books. Then we resort based off of this hidden 
       * attribute every book div has. Since the first seven books have a 'data-hidden'
       * value 1 higher than all of the other book divs, the first seven are sent to 
       * bottom of the bookshelf. Shifting single books works the same way, except we 
       * increment one book's 'data-hidden' attribute (not seven).
       */

      // Sends the top row of books to the bottom, and all the other rows move up as well
      function shiftShelfUpward() {
        var numBooksInShelf = $('.bookshelf').data('isotope').filteredItems.length;

        if (currentSortType != HIDDEN_SORT_TYPE) resetHiddenSortData(numBooksInShelf);

        // If there are not at least 7 books on the shelf, then we do not have to shift the row upward
        var numBooksToShift = numBooksInShelf >= NUM_BOOKS_IN_ROW ? NUM_BOOKS_IN_ROW : 0;
        for (var i = 0; i < numBooksToShift; i++) {
          var element = $('.bookshelf').data('isotope').filteredItems[i].element;
          var count = parseInt(element.getAttribute('data-hidden')) + 1;
          element.setAttribute('data-hidden', count);
        }
        
        $('.bookshelf').isotope('updateSortData').isotope();
        sortHidden();
      }

      // Moves the top left book to the bottom left of the shelf
      function shiftSingleBook() {
        var numBooksInShelf = $('.bookshelf').data('isotope').filteredItems.length;

        if (currentSortType != HIDDEN_SORT_TYPE) resetHiddenSortData(numBooksInShelf);

        var element = $('.bookshelf').data('isotope').filteredItems[0].element;
        var count = parseInt(element.getAttribute('data-hidden')) + 1;
        element.setAttribute('data-hidden', count);
        
        $('.bookshelf').isotope('updateSortData').isotope();
        sortHidden();
      }

      // These sortSomeAttribute functions trigger isotope, trigger the icons, and correct the current selected/first book
      function sortAuthor() {
        closeBookDetailsIfVisible();
        removeCurrentSelection();
        $('.bookshelf').isotope({ sortBy : "author" });
        getCurrentSelection();
        AuthorSortIcon();
        currentSortType = AUTHOR_SORT_TYPE;
        return false;
      }

      function sortTitle() {
        closeBookDetailsIfVisible();
        removeCurrentSelection();
        $('.bookshelf').isotope({ sortBy : "title" });
        getCurrentSelection();
        TitleSortIcon();
        currentSortType = TITLE_SORT_TYPE;
        return false;
      }

      function sortGenre() {
        closeBookDetailsIfVisible();
        removeCurrentSelection();
        $('.bookshelf').isotope({ sortBy : "genre" });
        getCurrentSelection();
        GenreSortIcon();
        currentSortType = GENRE_SORT_TYPE;
        return false;
      }

      function sortPubDate() {
        closeBookDetailsIfVisible();
        removeCurrentSelection();
        $('.bookshelf').isotope({ sortBy : "pubdate" });
        getCurrentSelection();
        PubDateSortIcon();
        currentSortType = PUBDATE_SORT_TYPE;
        return false;
      }

      function sortHidden() {
        closeBookDetailsIfVisible();
        removeCurrentSelection();
        $('.bookshelf').isotope({ sortBy : "hidden" });
        getCurrentSelection();
        currentSortType = HIDDEN_SORT_TYPE;
        return false;
      }

      function closeBookDetailsIfVisible() {
        hideBook();
        $('#search-detail').fadeOut('slow');
      }

      // Cycle sort priority (author => title => genre => publish date => repeat)
      function cycleSortPriority() {
        // We subtract 2 from sortTypes.length so we skip over sortHidden
        if (currentSortType == sortTypes.length - 2 || currentSortType == HIDDEN_SORT_TYPE) {
          currentSortType = 0;
        } else {
          currentSortType++;
        }
        sortTypes[currentSortType]();
      }

      // Removes the highlight from the current selected book
      function removeCurrentSelection() {
        curBook.setAttribute('id', '');
      }

      // Highlights the new current selected book (top left book)
      function getCurrentSelection() {
        curBook = $('.bookshelf').data('isotope').filteredItems[0].element.children[0];
        curBook.id = 'current-selection';
      }

      // We set all of the 'data-hidden' attributes to '0'
      function resetHiddenSortData(numBooksInShelf) {
        for (var i = 0; i < numBooksInShelf; i++) {
          var element = $('.bookshelf').data('isotope').filteredItems[i].element;
          element.setAttribute('data-hidden', '0');
        }
        $('.bookshelf').isotope('updateSortData').isotope();
      }

      /* LEAP MOTION STUFF ******************************/

      // Every FRAME_RATE frames we check for hand position
      var FRAME_RATE = 10;

      /* The leap motion detects many small instances of gestures and once it
       * has detected enough small instances, we will then trigger something
       * to happen on the cosmic shelf. These *THRESHOLD
       * constants essentially change the sensitivity the Cosmic Shelf has
       * for the Leap Motion. The higher the *THRESHOLD number, the less
       * sensitive the Cosmic Shelf will be for gestures, which means 
       * you will have to do larger/more obvious gestures. If you want
       * the Cosmic Shelf to detect slighter/less obvious gestures, turn the *THRESHOLD
       * number down. 
       */ 
      var SWIPE_LEFT_THRESHOLD = 30;
      var SWIPE_RIGHT_THRESHOLD = 30;
      var CIRCLE_FINGER_THRESHOLD = 50;

      /* MIN_SWIPE_DISTANCE is the minimum distance your hand must move
       * before it registers as ONE swipe.
       */
      var MIN_SWIPE_DISTANCE = 20;

      /* These count variables go up each time a gesture is registered.
       * For example, swipeLeftCount will go up by one each time a leftward
       * swipe is registered. Once it reaches SWIPE_LEFT_THRESHOLD, it will
       * signal the Cosmic Shelf (it waits to detect enough swipeLefts to
       * justify notifying the Cosmic Shelf). We reset them back to 0
       * once they reach their threshold.
       */
      var swipeLeftCount = 0;
      var swipeRightCount = 0;
      var circleFingerCount = 0;

      var prevHand = null;
      var curHand = null;

      // Main leap function
      Leap.loop({ enableGestures: true }, function(frame) {
        // Every ten frames we check the velocity and position of the hand and then compare it with the previous stored velocity and position
        if (frame.id % FRAME_RATE == 0) { 
          prevHand = curHand;
          curHand = frame.hands[0];
        }

        var gestures = frame.gestures;
        if (gestures.length != 0 && gestures[0].type == 'circle') { // Did we detect a gesture?

            onCircleFinger();

        } else {
          detectSwipe(prevHand, curHand);
        }
      });

      /* We have detected a circle finger motion. If it continues
       * long enough to reach the threshold, it will interact
       * with the Cosmic Shelf. Circle finger toggles the book
       * detail div. It will show and hide that detail div.
       */
      function onCircleFinger() {
        swipeRightCount = 0;
        swipeLeftCount = 0;
        circleFingerCount++;
        if (circleFingerCount >= CIRCLE_FINGER_THRESHOLD) {
          circleFingerCount = 0;
          if (shouldShowBook) {
            showBook();
          } else {
            hideBook();
          }
          //console.log("circle"); // CIRCLE FINGER DETECTED
        }
      }

      // prevHand.palmVelocity[0] => The [0] acesses the x-velocity
      // prevHand.palmPosition[0] => The [0] acesses the x-position
      // prevHand.palmPosition[1] would similarly access the y dimension 
      // prevHand.palmPosition[2] would similarly access the z dimension 
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

      /* We have detected a swipe motion. If it continues
       * long enough to reach the threshold, it will interact
       * with the Cosmic Shelf.
       */
      function onSwipe(curHand) {
        var direction = curHand.palmVelocity[0];
        if (direction < 0) { // Negative direction => moving right to left => swipe left
          swipeRightCount = 0;
          circleFingerCount = 0;
          swipeLeftCount++;
          if (swipeLeftCount >= SWIPE_LEFT_THRESHOLD) { 
            swipeLeftCount = 0;
            shiftShelfUpward(); 
            //console.log("left"); // SWIPE LEFT DETECTED 
          }
        } else { // Otherwise must be positive direction => moving left to right => swipe right
          swipeLeftCount = 0;
          circleFingerCount = 0;
          swipeRightCount++;
          if (swipeRightCount >= SWIPE_RIGHT_THRESHOLD) {
            swipeRightCount = 0;
            cycleSortPriority(); 
            //console.log("right"); // SWIPE RIGHT DETECTED
          }
        }
      }
    }
  });
};