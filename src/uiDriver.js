// Price Override
let overridesCount = 0;

const overrideNode = document.getElementById("overridePrice");
overrideNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let code = document.getElementById("overrideCode").value;
        let price = document.getElementById("overridePrice").value;
        let emptyText = document.getElementById("overrideInnerText");

        if(code != "" && price != ""){
            var newText = document.createTextNode(code + "  -> $" + price);
            var newElement = document.createElement("div");
            newElement.className = "overrideItem"

            newElement.appendChild(newText)
            document.getElementById("overridesWrapper").prepend(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteOverride';
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
                overridesCount--
                if(overridesCount == 0){
                    emptyText.style.display = "block"
                }
                
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("overrideCode").value = ""
            document.getElementById("overridePrice").value = ""

            emptyText.style.display = "none"
            overridesCount++
  } 
        
    }
});

document.getElementById("overrideBtn").addEventListener('click', function(){
  
    let code = document.getElementById("overrideCode").value;
    let price = document.getElementById("overridePrice").value;
    let emptyText = document.getElementById("overrideInnerText");

    if(code != "" && price != ""){
    var newText = document.createTextNode(code + "  -> $" + price);
    var newElement = document.createElement("div");
    newElement.className = "overrideItem"

    newElement.appendChild(newText)
    document.getElementById("overridesWrapper").prepend(newElement);

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'deleteOverride';
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', () => {
      newElement.remove();
      overridesCount--;
      if(overridesCount == 0){
            emptyText.style.display = "block"
        }
    });

    newElement.appendChild(deleteBtn)

    document.getElementById("overrideCode").value = ""
    document.getElementById("overridePrice").value = ""
    
    emptyText.style.display = "none"
    overridesCount++
  } 
})

//swap focus to the second input
document.getElementById("overrideCode").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        document.getElementById("overridePrice").focus();
    }
});





let tagsCount = 0;

// Bulk Tags
const tagNode = document.getElementById("addTag");
tagNode.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        let tag = document.getElementById("addTag").value;
        let emptyText = document.getElementById("tagsInnerText");

        if(tag != ""){
            var newText = document.createTextNode(tag);
            var newElement = document.createElement("div");
            newElement.className = "tagItem"

            newElement.appendChild(newText)
            document.getElementById("tagsWrapper").prepend(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteTag';
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
                tagsCount--
                if(tagsCount == 0){
                    emptyText.style.display = "block"
                }
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("addTag").value = ""

            emptyText.style.display = "none"
            tagsCount++
  } 
        
    }
});

document.getElementById("tagBtn").addEventListener('click', function(){
  
    let tag = document.getElementById("addTag").value;
    let emptyText = document.getElementById("tagsInnerText");

        if(tag != ""){
            var newText = document.createTextNode(tag);
            var newElement = document.createElement("div");
            newElement.className = "tagItem"

            newElement.appendChild(newText)
            document.getElementById("tagsWrapper").prepend(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteTag';
            deleteBtn.textContent = 'Delete';

            deleteBtn.addEventListener('click', () => {
                newElement.remove();
                tagsCount--;
                if(tagsCount == 0){
                    emptyText.style.display = "block"
                }
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("addTag").value = "";

            emptyText.style.display = "none"
            tagsCount++;
  } 
})