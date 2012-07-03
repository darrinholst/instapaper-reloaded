chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.command == "getCredentials") {
    sendResponse({email: localStorage["email"], password: localStorage["password"]})
  }

  if(request.command == "saveCredentials") {
    localStorage["email"] = request.email
    localStorage["password"] = request.password
    sendResponse()
  }
})

