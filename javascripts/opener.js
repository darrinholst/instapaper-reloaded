document.addEventListener("keydown", function (event) {
  var cssAdded = false,
      messageHider = false,

      css = '                                       \
      #__instapaper_reloaded_message__ {            \
        position: fixed;                            \
        z-index: 999999;                            \
        top: 0;                                     \
        width: 100%;                                \
        background: rgba(0, 0, 0, .85);             \
        padding: 20px 0;                            \
        font-family: Helvetica, Arial, sans-serif;  \
        color: #bada55;                             \
        font-size: 30px;                            \
        text-align: center;                         \
      }                                             \
                                                    \
      #__instapaper_reloaded_credentials__ {        \
        position: fixed;                            \
        z-index: 999999;                            \
        -moz-box-sizing: border-box;                \
        -webkit-box-sizing: border-box;             \
        box-sizing: border-box;                     \
        top: 100px;                                 \
        left: 50%;                                  \
        width: 400px;                               \
        margin-left: -200px;                        \
        border: 3px solid #bada55;                  \
        background: rgba(0, 0, 0, .85);             \
        color: #bada55;                             \
        padding: 20px;                              \
        font-family: Helvetica, Arial, sans-serif;  \
        text-align: left;                           \
      }                                             \
                                                    \
      #__instapaper_reloaded_credentials__ h1 {     \
        font-size: 22px;                            \
        margin: 0;                                  \
        padding: 0;                                 \
        margin-bottom: 10px;                        \
      }                                             \
                                                    \
      #__instapaper_reloaded_credentials__ label {  \
        display: inline-block;                      \
        width: 80px;                                \
        font-size: 16px;                            \
      }                                             \
                                                    \
      #__instapaper_reloaded_credentials__ input {  \
        width: 200px;                               \
        font-size: 16px;                            \
        margin-bottom: 8px;                         \
      }                                             \
                                                    \
      #__instapaper_reloaded_credentials__ button { \
        padding: 5px 10px;                          \
      }                                             \
    '.replace(/ {2,}/g, " "),

    credentials_html = '                                                                                                   \
      <form id="__instapaper_reloaded_form__">                                                                 \
        <h1>Instapaper Credentials</h3>                                                                        \
                                                                                                               \
        <label for="__instapaper_reloaded_email__">Email:</label>                                              \
        <input id="__instapaper_reloaded_email__" name="__instapaper_reloaded_email__" type="text">            \
        <br>                                                                                                   \
                                                                                                               \
        <label for="__instapaper_reloaded_password__">Password:</label>                                        \
        <input id="__instapaper_reloaded_password__" name="__instapaper_reloaded_password__" type="password""> \
        <br>                                                                                                   \
                                                                                                               \
        <button id="__instapaper_reloaded_save__">Save</button>                                                \
      </form>                                                                                                  \
    '.replace(/ {2,}/g, " "),

    addCss = function() {
      if(!cssAdded) {
        var styleElement = document.createElement('style')
        styleElement.setAttribute('type', 'text/css')
        styleElement.appendChild(document.createTextNode(css))
        document.getElementsByTagName("head")[0].appendChild(styleElement)
        cssAdded = true
      }
    },

    showMessage = function(message, keep) {
      addCss()
      var messageContainer = document.getElementById("__instapaper_reloaded_message__")

      if(!messageContainer) {
        messageContainer = document.createElement("div")
        messageContainer.id = "__instapaper_reloaded_message__"
        document.getElementsByTagName("body")[0].appendChild(messageContainer)
      }

      messageContainer.innerHTML = message
      messageContainer.style.display = "block"

      if(messageHider) {
        clearTimeout(messageHider)
      }

      if(!keep) {
        messageHider = setTimeout(function() {
          messageContainer.style.display = "none"
        }, 3000)
      }
    },

    promptForCredentials = function() {
      addCss()

      var wrapper = document.createElement("div")
      wrapper.innerHTML = credentials_html
      wrapper.id = "__instapaper_reloaded_credentials__"
      document.getElementsByTagName("body")[0].appendChild(wrapper)

      document.getElementById("__instapaper_reloaded_form__").addEventListener("submit", saveCredentials)
    },

    saveCredentials = function(event) {
      event.preventDefault()

      email = document.getElementById("__instapaper_reloaded_email__").value
      password = document.getElementById("__instapaper_reloaded_password__").value

      chrome.extension.sendMessage({command: "saveCredentials", email: email, password: password}, function(response) {
        var wrapper = document.getElementById("__instapaper_reloaded_credentials__")
        wrapper.parentNode.removeChild(wrapper)
        savePage()
      })
    },

    savePage = function() {
      showMessage("Saving...", true)

      chrome.extension.sendMessage({command: "getCredentials"}, function(response) {
        if(!response.email || !response.password) {
          promptForCredentials()
        }
        else {
          var xhr = new XMLHttpRequest()
          xhr.open("POST", "https://www.instapaper.com/api/add", true)
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
          xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              if(xhr.status == 403) {
                showMessage("Invalid Credentials")
                promptForCredentials()
              }
              else if(xhr.status >= 200 && xhr.status <= 299) {
                showMessage("Saved!")
              }
              else {
                showMessage("Unable to save page (" + xhr.status + ")!")
              }
            }
          }
          xhr.send("username=" + response.email + "&password=" + response.password + "&url=" + encodeURIComponent(window.location.href))
        }
      })
    }

  if(event.keyCode === 73 && event.ctrlKey) {
    if(event.shiftKey) {
      window.location = "http://instapaper.com/text?u=" + encodeURIComponent(window.location.href)
    }
    else {
      savePage()
    }
  }
})

