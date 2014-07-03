(function() {
  var scroller = new Scroller(),
      archiveMenu = "a.archivebutton",
      archiveMenuButton = 'div.button:contains("Move to Archive")'
      articleContainer = ".tableViewCell",
      textViewLink = ".textButton",
      archiveLink = ".archiveButton",
      deleteLink = ".deleteLink",
      originalArticleLink = ".tableViewCellTitleLink",
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
        $(articleContainer).removeClass("selected");
        selectedArticle.addClass("selected");
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

        if (removedArticle.hasClass("selected")) {
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

      repositionAd = function() {
        var placeholder = $("#bookmarkListDeckAdPlaceholder"),
            ad = $("#bookmarkListDeckAd");

        ad.find("script").remove();
        ad.appendTo(placeholder);
        ad.show();
        placeholder.show();
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

        $("#right_column").bind('mouseenter', function() {
          return $(this).animate({
            'right': 0
          }, 200).addClass("open");
        });

        $("#right_column").bind('mouseleave', function(event) {
          if (event.offsetX < 0) {
            return $(this).animate({
              'right': -240
            }, 200).removeClass("open");
          }
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

          //selectedArticle = $(articleContainer).filter(":first");
          //repositionAd();
          //makeLinksOpenInNewTab();
          //showSelectedArticle();
          //bindEvents();
        });
      };

  initialize();
})();
