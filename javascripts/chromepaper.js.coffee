do ->
  scroller = new Scroller()
  articleContainer = ".tableViewCell"
  textViewLink = ".textButton"
  archiveLink = ".archiveButton"
  originalArticleLink = ".tableViewCellTitleLink"
  selectedArticle = $(articleContainer).filter(":first")
  nextArticle = null
  previousArticle = null

  onArticlePage = () ->
    $(articleContainer).length > 0

  makeLinksOpenInNewTab = () ->
    $(textViewLink).attr("target", "_blank")
    $(originalArticleLink).attr("target", "_blank")

  showSelectedArticle = () ->
    $(articleContainer).removeClass("selected")
    selectedArticle.addClass("selected")
    nextArticle = selectedArticle.next()
    previousArticle = selectedArticle.prev()

  isAtTheTopOfTheList = () ->
    previousArticle.length == 0

  selectArticle = (article) ->
    if article.length
      goingDown = nextArticle.attr("id") == article.attr("id")
      selectedArticle = article
      showSelectedArticle()

      if isAtTheTopOfTheList()
        scroller.scrollToTop()
      else if goingDown
        scroller.scrollToBottomOf(selectedArticle)
      else
        scroller.scrollToTopOf(selectedArticle)

  downDownDown = () ->
    if onArticlePage()
      selectNextArticle()
    else
      scroller.scrollBy(20)

  selectNextArticle = () ->
    selectArticle(selectedArticle.next())

  upUpUp = () ->
    if onArticlePage()
      selectPreviousArticle()
    else
      scroller.scrollBy(-20)

  selectPreviousArticle = () ->
    selectArticle(selectedArticle.prev())

  clickLink = (link) ->
    e = document.createEvent('MouseEvents')
    e.initEvent('click', true, true)
    link.dispatchEvent(e)

  openTextArticle = () ->
    clickLink(selectedArticle.find(textViewLink)[0])

  openOriginalArticle = () ->
    clickLink(findOriginalArticleLink())

  findOriginalArticleLink = () ->
    if selectedArticle.length
      selectedArticle.find(originalArticleLink)[0]
    else
      $('a:contains("View original")')[0]

  archiveSelectedArticle = () ->
    clickLink(selectedArticle.find(archiveLink)[0])

  articleArchived = () ->
    archivedArticle = $(this).closest(articleContainer)
    archivedArticle.addClass("archived")

    if archivedArticle.hasClass("selected")
      selectedArticle = if nextArticle.length then nextArticle else previousArticle
      showSelectedArticle()

  articleClicked = () ->
    if !($(this).hasClass("archived"))
      selectedArticle = $(this)
      showSelectedArticle()

  bindEvents = () ->
    $(document).bind('keydown', 'j', downDownDown)
    $(document).bind('keydown', 'k', upUpUp)
    $(document).bind('keydown', 't', openTextArticle)
    $(document).bind('keydown', 'o', openOriginalArticle)
    $(document).bind('keydown', 'a', archiveSelectedArticle)
    $(document).bind('keydown', 'shift+a', -> window.location = window.location.origin + "/archive")
    $(document).bind('keydown', 'shift+u', -> window.location = window.location.origin + "/u")
    $("#right_column").bind 'mouseenter', -> $(this).animate('right': 30, 200)
    $("#right_column").bind 'mouseleave', (event) -> $(this).animate('right': -240, 200) if event.offsetX < 0
    $(articleContainer).click(articleClicked)
    $(archiveLink).click(articleArchived)

  makeLinksOpenInNewTab()
  showSelectedArticle()
  bindEvents()

