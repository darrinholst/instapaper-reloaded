(function() {
  var articleContainer = ".tableViewCell",
      textViewLink = ".textButton",
      archiveLink = ".archiveButton",
      originalArticleLink = ".tableViewCellTitleLink",
      selectedArticle = $(articleContainer).filter(":first"),
      scrollPadding = 30;

  function makeLinksOpenInNewTab() {
    $(textViewLink).attr("target", "_blank");
    $(originalArticleLink).attr("target", "_blank");
  }

  function showSelectedArticle() {
    selectedArticle.addClass("selected");
  }

  function scrollBy(pixels) {
    document.body.scrollTop = document.body.scrollTop + pixels;
  }

  function scrollToTop() {
    scrollBy(-1000);
  }

  function makeSelectedArticleVisible(isGoingDown) {
    var windowTop = document.body.scrollTop;
    var windowHeight = $(window).height();
    var selectedTop = selectedArticle.offset().top;
    var selectedBottom = selectedTop + selectedArticle.outerHeight();

    if(isGoingDown) {
      if(selectedBottom > windowTop + windowHeight) {
        scrollBy(selectedBottom - windowHeight - windowTop + scrollPadding);
      }
    }
    else {
      if(selectedTop < windowTop) {
        scrollBy(-(windowTop - selectedTop + scrollPadding));
      }
    }
  }

  function selectArticle(nextOrPrevious) {
    var nextArticle = selectedArticle[nextOrPrevious](articleContainer);

    if(nextArticle.length) {
      selectedArticle.removeClass("selected");
      selectedArticle = nextArticle;
      showSelectedArticle();
      makeSelectedArticleVisible(nextOrPrevious === 'next');

      if(nextOrPrevious === 'prev' && !nextArticle.prev(articleContainer).length) {
        scrollToTop();
      }
    }
  }

  function nextArticle() {
    selectArticle("next");
  }

  function previousArticle() {
    selectArticle("prev");
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
    var nextArticle = selectedArticle.next().length != 0 ? selectedArticle.next() : selectedArticle.prev();
    clickLink(selectedArticle.find(archiveLink)[0]);
    if(nextArticle.length){
        selectedArticle = nextArticle;
        showSelectedArticle();
    }
 }

  function bindShortcutKeys() {
    $(document).bind('keydown', 'j', nextArticle);
    $(document).bind('keydown', 'k', previousArticle);
    $(document).bind('keydown', 't', openTextArticle);
    $(document).bind('keydown', 'o', openOriginalArticle);
    $(document).bind('keydown', 'a', archiveSelectedArticle);
  }

  makeLinksOpenInNewTab();
  showSelectedArticle();
  bindShortcutKeys();
})();
