class Scroller
  constructor: ->
    @scrollPadding = 30

  scrollToTop: ->
    @scrollBy(-1000)

  scrollToTopOf: (element) ->
    windowTop = document.body.scrollTop
    windowHeight = $(window).height()
    elementTop = element.offset().top

    if elementTop < windowTop
      @scrollBy(-(windowTop - elementTop + @scrollPadding))

  scrollToBottomOf:  (element) ->
    windowTop = document.body.scrollTop
    windowHeight = $(window).height()
    elementBottom = element.offset().top + element.outerHeight()

    if elementBottom > windowTop + windowHeight
      @scrollBy(elementBottom - windowHeight - windowTop + @scrollPadding)

  #private

  scrollBy:  (pixels) ->
    document.body.scrollTop = document.body.scrollTop + pixels
