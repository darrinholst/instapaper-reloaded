var Scroller = (function() {
  function Scroller() {
    this.scrollPadding = 30;
  }

  Scroller.prototype.scrollToTop = function() {
    return this.scrollBy(-1000);
  };

  Scroller.prototype.scrollToTopOf = function(element) {
    var elementTop, windowHeight, windowTop;
    windowTop = document.body.scrollTop;
    windowHeight = $(window).height();
    elementTop = element.offset().top;
    if (elementTop < windowTop) {
      return this.scrollBy(-(windowTop - elementTop + this.scrollPadding));
    }
  };

  Scroller.prototype.scrollToBottomOf = function(element) {
    var elementBottom, windowHeight, windowTop;
    windowTop = document.body.scrollTop;
    windowHeight = $(window).height();
    elementBottom = element.offset().top + element.outerHeight();
    if (elementBottom > windowTop + windowHeight) {
      return this.scrollBy(elementBottom - windowHeight - windowTop + this.scrollPadding);
    }
  };

  Scroller.prototype.scrollBy = function(pixels) {
    return document.body.scrollTop = document.body.scrollTop + pixels;
  };

  return Scroller;
})();
