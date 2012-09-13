(function() {
  var reloadOptions = function() {
        chrome.extension.sendMessage({command: "getOption", name: "reverse_sort"}, function(response) {
          document.getElementById("reverse_sort").checked = response === "true";
        });
      },

      showMessage = function(text) {
        var message = document.getElementById("message");
        message.innerHTML = text;

        setTimeout(function() {
          message.innerHTML = "";
        }, 2000);
      },

      saveOptions = function() {
        var reverseSort = document.getElementById("reverse_sort").checked;

        chrome.extension.sendMessage({command: "setOption", name: "reverse_sort", value: reverseSort}, function() {
          showMessage("Options Saved");
        });
      },

      bindSaveButton = function() {
        document.getElementById("save").addEventListener('click', saveOptions, false);
      };

  reloadOptions();
  bindSaveButton();
})();

