(function() {
  var scroller = new Scroller(),
      selectedClass = "fumullins",
      archiveMenu = "a.archivebutton",
      archiveMenuButton = 'div.button:contains("Move to Archive")'
      articleContainer = "article",
      textViewLink = ".article_title",
      archiveLink = '.js_archive_single',
      deleteLink = '.js_delete_single'
      originalArticleLink = ".js_domain_linkout",
      selectedArticle = $(articleContainer).filter(":first"),
      nextArticle = null,
      previousArticle = null,

      onArticlePage = function() {
        return $(articleContainer).length > 0;
      },

      makeLinksOpenInNewTab = function() {
        $(textViewLink).attr("target", "_blank");
        $(originalArticleLink).attr("target", "_blank");
      },

      showSelectedArticle = function() {
        $(articleContainer).removeClass(selectedClass);
        selectedArticle.addClass(selectedClass);
        nextArticle = selectedArticle.next();
        previousArticle = selectedArticle.prev();
      },

      isAtTheTopOfTheList = function() {
        return previousArticle.length === 0;
      },

      selectArticle = function(article) {
        var goingDown;

        if (article.length) {
          goingDown = nextArticle.attr("id") === article.attr("id");
          selectedArticle = article;
          showSelectedArticle();

          if (isAtTheTopOfTheList()) {
            scroller.scrollToTop();
          } else if (goingDown) {
            scroller.scrollToBottomOf(selectedArticle);
          } else {
            scroller.scrollToTopOf(selectedArticle);
          }
        }
      },

      downDownDown = function() {
        if (onArticlePage()) {
          selectNextArticle();
        } else {
          scroller.scrollBy(20);
        }
      },

      selectNextArticle = function() {
        selectArticle(selectedArticle.next());
      },

      upUpUp = function() {
        if (onArticlePage()) {
          selectPreviousArticle();
        } else {
          scroller.scrollBy(-20);
        }
      },

      selectPreviousArticle = function() {
        selectArticle(selectedArticle.prev());
      },

      clickLink = function(link) {
        var e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        return link.dispatchEvent(e);
      },

      openTextArticle = function() {
        clickLink(selectedArticle.find(textViewLink)[0]);
      },

      openOriginalArticle = function() {
        clickLink(findOriginalArticleLink());
      },

      findOriginalArticleLink = function() {
        if (selectedArticle.length) {
          return selectedArticle.find(originalArticleLink)[0];
        } else {
          return $('a:contains("View original")')[0];
        }
      },

      archiveSelectedArticle = function() {
        if($(archiveMenu).length) {
          clickLink($(archiveMenu)[0])
          clickLink($(archiveMenuButton)[0])
        } else {
          clickLink(selectedArticle.find(archiveLink)[0]);
        }
      },

      deleteSelectedArticle = function() {
        clickLink(selectedArticle.find(deleteLink)[0]);
      },

      articleRemoved = function() {
        var removedArticle = $(this).closest(articleContainer);
        removedArticle.addClass("removed");

        if (removedArticle.hasClass(selectedClass)) {
          selectedArticle = nextArticle.length ? nextArticle : previousArticle;
          showSelectedArticle();
        }
      },

      articleClicked = function() {
        if (!($(this).hasClass("removed"))) {
          selectedArticle = $(this);
          showSelectedArticle();
        }
      },

      dontHelpMe = function() {
        $("#chromepaper-help").hide();
      },

      helpMe = function() {
        var helpDiv = $("#chromepaper-help");

        if (helpDiv.length === 0) {
          helpDiv = $("<div id=\"chromepaper-help\">\n  <div class=\"inner\">\n    <ul>\n      <li><span>?:</span>Show this help</li>\n      <li><span>esc:</span>Dismiss this help</li>\n    </ul>\n    <hr>\n    <ul>\n      <li><span>a, y:</span>Archive selected article</li>\n      <li><span>#:</span>Delete selected article</li>\n      <li><span>j:</span>Select next article</li>\n      <li><span>k:</span>Select previous article</li>\n      <li><span>o:</span>Open original link for selected article</li>\n      <li><span>t, enter:</span>Open text view for selected article</li>\n    </ul>\n    <hr>\n    <ul>\n      <li><span>A:</span>Show archived articles</li>\n      <li><span>U:</span>Show unread articles</li>\n    </ul>\n  </div>\n</div>").appendTo($("body"));
        }

        helpDiv.show();
      },

      bindEvents = function() {
        $(document).bind('keydown', 'shift+/', helpMe);
        $(document).bind('keydown', 'esc', dontHelpMe);
        $(document).bind('keydown', 'j', downDownDown);
        $(document).bind('keydown', 'k', upUpUp);
        $(document).bind('keydown', 't return', openTextArticle);
        $(document).bind('keydown', 'o', openOriginalArticle);
        $(document).bind('keydown', 'a y', archiveSelectedArticle);
        $(document).bind('keydown', '#', deleteSelectedArticle);

        $(document).bind('keydown', 'shift+a', function() {
          return window.location = window.location.origin + "/archive";
        });

        $(document).bind('keydown', 'shift+u', function() {
          return window.location = window.location.origin + "/u";
        });

        $(articleContainer).click(articleClicked);
        $(archiveLink).click(articleRemoved);
        $(deleteLink).click(articleRemoved);
      },

      initialize = function() {
        chrome.extension.sendMessage({command: "getOption", name: "reverse_sort"}, function(reverseSort) {
          if(window.location.pathname === "/u" && reverseSort === "true") {
            var articles = $('.articles article').get().reverse();
            $('.articles').html(articles);
          }

          selectedArticle = $(articleContainer).filter(":first");
          showSelectedArticle();
          bindEvents();
        });
      };

  initialize();
})();
