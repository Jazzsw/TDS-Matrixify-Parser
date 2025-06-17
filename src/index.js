//Triggers
const node = document.getElementById("overridePrice");
node.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let code = document.getElementById("overrideCode").value;
        let price = document.getElementById("overridePrice").value;

        if(code != "" && price != ""){
          var newText = document.createTextNode(code + "- $" + price);
          var newElement = document.createElement("div");
          newElement.style.color = "#ccc"

          newElement.appendChild(newText)
          document.getElementById("overridesWrapper").appendChild(newElement);

          document.getElementById("overrideCode").value = ""
          document.getElementById("overridePrice").value = ""
  } 
        
    }
});

document.getElementById("overrideBtn").addEventListener('click', function(){
  
 let code = document.getElementById("overrideCode").value;
  let price = document.getElementById("overridePrice").value;

  if(code != "" && price != ""){
    var newText = document.createTextNode(code + "- $" + price);
    var newElement = document.createElement("div");
    newElement.style.color = "#ccc"

    newElement.appendChild(newText)
    document.getElementById("overridesWrapper").appendChild(newElement);

    document.getElementById("overrideCode").value = ""
    document.getElementById("overridePrice").value = ""
  } 
})

//swap focus to the second input
document.getElementById("overrideCode").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        document.getElementById("overridePrice").focus();
    }
});

