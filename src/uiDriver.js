import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';

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



let filesCount = 0;

//File Upload
var dropZone = document.getElementById("dropBox")
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('hover');
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('hover');
});

const c = document.getElementById('consoleText');
c.innerHTML = "Waiting for file...";


dropZone.addEventListener('change', async (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
    c.innerHTML = "Reading file...";


    const file = event.target.files[0];
    if (!file) {
      c.innerHTML = "No file selected.";
      return;
    }

    c.innerHTML = (file.name)
    addFile(file.name)

    const buffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

  });

  function addFile(filename){
        let parent = document.getElementById("filesWrapper")

        let newContainer = document.createElement("div")
        let newText = document.createTextNode(filename)
        let emptyText = document.getElementById("filesEmptyText")
        newContainer.className = "fileBar"

        let newDropdown = document.createElement("select");
        //add options

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'deleteTag';
        deleteBtn.textContent = 'Delete';

        deleteBtn.addEventListener('click', () => {
                newContainer.remove();
                filesCount--;
                if(filesCount == 0){
                    emptyText.style.display = "block"
                }
            });

        newContainer.appendChild(newText);
        newContainer.appendChild(newDropdown);
        newContainer.appendChild(deleteBtn);

        parent.appendChild(newContainer)


        filesCount++;
        emptyText.style.display = "none"





  }

