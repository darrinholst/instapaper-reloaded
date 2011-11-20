(function() {
  var articleContainer = ".tableViewCell";
      selectedArticle = $(articleContainer).filter(":first");

  function makeLinksOpenInNewTab() {
    $(".textButton").attr("target", "_blank");
    $(".tableViewCellTitleLink").attr("target", "_blank");
  }

  function showSelectedArticle() {
    selectedArticle.addClass("selected");
  }

  function nextOrPreviousArticle(nextOrPrevious) {
    var nextArticle = selectedArticle[nextOrPrevious](articleContainer);

    if(nextArticle.length) {
      selectedArticle.removeClass("selected");
      selectedArticle = nextArticle;
      showSelectedArticle();
    }
  }

  function nextArticle() {
    nextOrPreviousArticle("next");
  }

  function previousArticle() {
    nextOrPreviousArticle("prev");
  }

  function clickLink(link) {
    var e = document.createEvent('MouseEvents');
    e.initEvent('click', true, true);
    link.dispatchEvent(e);
  }

  function openTextArticle() {
    clickLink(selectedArticle.find(".textButton")[0]);
  }

  function openOriginalArticle() {
    clickLink(selectedArticle.find(".tableViewCellTitleLink")[0]);
  }

  function bindShortcutKeys() {
    $(document).bind('keydown', 'j', nextArticle);
    $(document).bind('keydown', 'k', previousArticle);
    $(document).bind('keydown', 't', openTextArticle);
    $(document).bind('keydown', 'o', openOriginalArticle);
  }

  makeLinksOpenInNewTab();
  showSelectedArticle();
  bindShortcutKeys();
})();
