document.addEventListener("keydown", function(event) {
  if(event.keyCode === 73 && event.ctrlKey) {
    window.location = "http://instapaper.com/text?u=" + encodeURIComponent(window.location.href);
  }
});
