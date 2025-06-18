// Price Override
const overrideNode = document.getElementById("overridePrice");
overrideNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let code = document.getElementById("overrideCode").value;
        let price = document.getElementById("overridePrice").value;

        if(code != "" && price != ""){
            var newText = document.createTextNode(code + "  -> $" + price);
            var newElement = document.createElement("div");
            newElement.className = "overrideItem"

            newElement.appendChild(newText)
            document.getElementById("overridesWrapper").appendChild(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteOverride';
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("overrideCode").value = ""
            document.getElementById("overridePrice").value = ""
  } 
        
    }
});

document.getElementById("overrideBtn").addEventListener('click', function(){
  
    let code = document.getElementById("overrideCode").value;
    let price = document.getElementById("overridePrice").value;

  if(code != "" && price != ""){
    var newText = document.createTextNode(code + "  -> $" + price);
    var newElement = document.createElement("div");
    newElement.className = "overrideItem"

    newElement.appendChild(newText)
    document.getElementById("overridesWrapper").appendChild(newElement);

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'deleteOverride';
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {
      newElement.remove();
    });

    newElement.appendChild(deleteBtn)

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





// Bulk Tags
const tagNode = document.getElementById("addTag");
tagNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let tag = document.getElementById("addTag").value;

        if(tag != ""){
            var newText = document.createTextNode(tag);
            var newElement = document.createElement("div");
            newElement.className = "tagItem"

            newElement.appendChild(newText)
            document.getElementById("tagsWrapper").appendChild(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteTag';
            deleteBtn.textContent = ' X ';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("addTag").value = ""
  } 
        
    }
});

document.getElementById("tagBtn").addEventListener('click', function(){
  
    let tag = document.getElementById("addTag").value;

        if(tag != ""){
            var newText = document.createTextNode(tag);
            var newElement = document.createElement("div");
            newElement.className = "tagItem"

            newElement.appendChild(newText)
            document.getElementById("tagsWrapper").appendChild(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteTag';
            deleteBtn.textContent = ' X ';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("addTag").value = ""
  } 
})