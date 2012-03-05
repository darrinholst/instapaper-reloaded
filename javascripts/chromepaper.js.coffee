do ->
  scroller = new Scroller()
  articleContainer = ".tableViewCell"
  textViewLink = ".textButton"
  archiveLink = ".archiveButton"
  deleteLink = ".deleteLink"
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

  findOriginalArticleLink = ->
    if selectedArticle.length
      selectedArticle.find(originalArticleLink)[0]
    else
      $('a:contains("View original")')[0]

  archiveSelectedArticle = () ->
    clickLink(selectedArticle.find(archiveLink)[0])

  deleteSelectedArticle = () ->
    clickLink(selectedArticle.find(deleteLink)[0])

  articleRemoved = ->
    removedArticle = $(this).closest(articleContainer)
    removedArticle.addClass("removed")

    if removedArticle.hasClass("selected")
      selectedArticle = if nextArticle.length then nextArticle else previousArticle
      showSelectedArticle()

  articleClicked = ->
    if !($(this).hasClass("removed"))
      selectedArticle = $(this)
      showSelectedArticle()

  dontHelpMe = ->
    $("#chromepaper-help").hide()

  helpMe = ->
    helpDiv = $("#chromepaper-help")
    console.log(helpDiv)

    if(helpDiv.length == 0)
      helpDiv = $("""
        <div id="chromepaper-help">
          <div class="inner">
            <ul>
              <li><span>?:</span>Show this help</li>
              <li><span>esc:</span>Dismiss this help</li>
            </ul>
            <hr>
            <ul>
              <li><span>a, y:</span>Archive selected article</li>
              <li><span>#:</span>Delete selected article</li>
              <li><span>j:</span>Select next article</li>
              <li><span>k:</span>Select previous article</li>
              <li><span>o:</span>Open original link for selected article</li>
              <li><span>t, enter:</span>Open text view for selected article</li>
            </ul>
            <hr>
            <ul>
              <li><span>A:</span>Show archived articles</li>
              <li><span>U:</span>Show unread articles</li>
            </ul>
          </div>
        </div>
      """).appendTo($("body"))

    helpDiv.show()



  bindEvents = () ->
    $(document).bind('keydown', 'shift+/', helpMe)
    $(document).bind('keydown', 'esc', dontHelpMe)
    $(document).bind('keydown', 'j', downDownDown)
    $(document).bind('keydown', 'k', upUpUp)
    $(document).bind('keydown', 't return', openTextArticle)
    $(document).bind('keydown', 'o', openOriginalArticle)
    $(document).bind('keydown', 'a y', archiveSelectedArticle)
    $(document).bind('keydown', '#', deleteSelectedArticle)
    $(document).bind('keydown', 'shift+a', -> window.location = window.location.origin + "/archive")
    $(document).bind('keydown', 'shift+u', -> window.location = window.location.origin + "/u")
    $("#right_column").bind 'mouseenter', -> $(this).animate('right': 0, 200).addClass("open")
    $("#right_column").bind 'mouseleave', (event) -> $(this).animate('right': -240, 200).removeClass("open") if event.offsetX < 0
    $(articleContainer).click(articleClicked)
    $(archiveLink).click(articleRemoved)
    $(deleteLink).click(articleRemoved)

  makeLinksOpenInNewTab()
  showSelectedArticle()
  bindEvents()

