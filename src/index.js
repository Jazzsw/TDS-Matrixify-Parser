// Item Override Section
document.getElementById("overrideBtn").addEventListener('click', function(){
  let code = document.getElementById("overrideCode").value;
  let price = document.getElementById("overridePrice").value;

  var newText = document.createTextNode(code + "- $" + price);
  var newElement = document.createElement("div");
  newElement.style.color = "#ccc"

  newElement.appendChild(newText)
  document.getElementById("overridesWrapper").appendChild(newElement);

  document.getElementById("overrideCode").value = ""
  document.getElementById("overridePrice").value = ""
})  