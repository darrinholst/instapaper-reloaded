(function() {
  var scroller = new Scroller(),
      articleContainer = ".tableViewCell",
      textViewLink = ".textButton",
      archiveLink = ".archiveButton",
      originalArticleLink = ".tableViewCellTitleLink",
      selectedArticle = $(articleContainer).filter(":first"),
      nextArticle = null,
      previousArticle = null;

  function makeLinksOpenInNewTab() {
    $(textViewLink).attr("target", "_blank");
    $(originalArticleLink).attr("target", "_blank");
  }

  function showSelectedArticle() {
    $(articleContainer).removeClass("selected");
    selectedArticle.addClass("selected");
    nextArticle = selectedArticle.next();
    previousArticle = selectedArticle.prev();
  }

  function isAtTheTopOfTheList() {
    return previousArticle.length === 0;
  }

  function selectArticle(article) {
    if(article.length) {
      var goingDown = nextArticle.attr("id") === article.attr("id");
      selectedArticle = article;
      showSelectedArticle();

      if(isAtTheTopOfTheList()) {
        scroller.scrollToTop();
      }
      else if(goingDown) {
        scroller.scrollToBottomOf(selectedArticle);
      }
      else {
        scroller.scrollToTopOf(selectedArticle);
      }
    }
  }

  function selectNextArticle() {
    selectArticle(selectedArticle.next());
  }

  function selectPreviousArticle() {
    selectArticle(selectedArticle.prev());
  }

  function clickLink(link) {
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }

  function openTextArticle() {
    clickLink(selectedArticle.find(textViewLink)[0]);
  }

  function openOriginalArticle() {
    clickLink(selectedArticle.find(originalArticleLink)[0]);
  }

  function archiveSelectedArticle() {
    clickLink(selectedArticle.find(archiveLink)[0]);
  }

  function articleArchived() {
    var archivedArticle = $(this).closest(articleContainer);
    archivedArticle.addClass("archived");

    if(archivedArticle.hasClass("selected")) {
      selectedArticle = nextArticle.length ? nextArticle : previousArticle;
      showSelectedArticle();
    }
  }

  function articleClicked() {
    if(!($(this).hasClass("archived"))) {
      selectedArticle = $(this);
      showSelectedArticle();
    }
  }

  function bindEvents() {
    $(document).bind('keydown', 'j', selectNextArticle);
    $(document).bind('keydown', 'k', selectPreviousArticle);
    $(document).bind('keydown', 't', openTextArticle);
    $(document).bind('keydown', 'o', openOriginalArticle);
    $(document).bind('keydown', 'a', archiveSelectedArticle);
    $(articleContainer).click(articleClicked);
    $(archiveLink).click(articleArchived);
  }

  makeLinksOpenInNewTab();
  showSelectedArticle();
  bindEvents();
})();
