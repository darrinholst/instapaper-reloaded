var Scroller = function() {
  var scrollPadding = 30,

      scrollBy = function(pixels) {
        document.body.scrollTop = document.body.scrollTop + pixels;
      },

      scrollToTop = function() {
        scrollBy(-1000);
      },

      scrollToTopOf = function(element) {
        var windowTop = document.body.scrollTop;
        var windowHeight = $(window).height();
        var elementTop = element.offset().top;

        if(elementTop < windowTop) {
          scrollBy(-(windowTop - elementTop + scrollPadding));
        }
      },

      scrollToBottomOf = function(element) {
        var windowTop = document.body.scrollTop;
        var windowHeight = $(window).height();
        var elementBottom = element.offset().top + element.outerHeight();

        if(elementBottom > windowTop + windowHeight) {
          scrollBy(elementBottom - windowHeight - windowTop + scrollPadding);
        }
      };

  return {
    scrollToTop: scrollToTop,
    scrollToTopOf: scrollToTopOf,
    scrollToBottomOf: scrollToBottomOf
  }
}
