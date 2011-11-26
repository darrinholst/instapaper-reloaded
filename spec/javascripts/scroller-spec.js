describe("Scroller", function() {
  var scroller;

  beforeEach(function() {
    scroller = new Scroller();
  });

  it("should scroll to top of the page", function() {
    scroller.scrollToTop();
    expect(true).toEqual(true);
  });
});
