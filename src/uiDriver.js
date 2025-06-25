import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';

// Arrays to store bulk update tags and price overrides
export var tagsArr = [] // array of strings (tags)
export var overridesArr =[] // array of objects ({code:"code", price:"price"})
export var fileObjList = [] // array of each file object
export var fileFormats = new Map() // save the SKU and price columns for each supported file type

// Price Override
let overridesCount = 0; // counter to tell when overrides are empty for display
fileFormats.set('B&M Singles', {"skuCol":1, "priceCol": 6})//push default values for B&M file structure

const overrideNode = document.getElementById("overridePrice");
overrideNode.addEventListener("keyup", function(event) { // detect enter key
    if (event.key === "Enter") {
        let code = document.getElementById("overrideCode").value;
        let price = document.getElementById("overridePrice").value;
        let emptyText = document.getElementById("overrideInnerText");

        if(code != "" && price != ""){ // Only work if there is content in the inputs

            let overrideObj = {"code": code, "price": price} //create object based on inputs
            overridesArr.push(overrideObj) //push object to array

            //create the div and text for the override
            var newText = document.createTextNode(code + "____$" + price);
            var newElement = document.createElement("div");
            newElement.className = "overrideItem"

            newElement.appendChild(newText)
            document.getElementById("overridesWrapper").prepend(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteOverride';
            deleteBtn.textContent = 'Delete';

            //create the delete logic for the delete button
            deleteBtn.addEventListener('click', () => {

                let index = overridesArr.indexOf(overrideObj);
                overridesArr.splice(index, 1)
                
                newElement.remove();
                overridesCount--
                if(overridesCount == 0){//if there are no overrides, show the placeholder text
                    emptyText.style.display = "block"
                }
                
            });

            newElement.appendChild(deleteBtn)

            //clear the inputs
            document.getElementById("overrideCode").value = ""
            document.getElementById("overridePrice").value = ""

            //edit the empty text if there is more than 0 elements
            emptyText.style.display = "none"
            overridesCount++
        } 
        
    }
});

document.getElementById("overrideBtn").addEventListener('click', function(){
  
    let code = document.getElementById("overrideCode").value;
    let price = document.getElementById("overridePrice").value;
    let emptyText = document.getElementById("overrideInnerText");

    if(code != "" && price != ""){ // Only work if there is content in the inputs

        let overrideObj = {"code": code, "price": price} //create object based on inputs
        overridesArr.push(overrideObj) //push object to array

        //create the div and text for the override
        var newText = document.createTextNode(code + "____$" + price);
        var newElement = document.createElement("div");
        newElement.className = "overrideItem"

        newElement.appendChild(newText)
        document.getElementById("overridesWrapper").prepend(newElement);

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'deleteOverride';
        deleteBtn.textContent = 'Delete';

        //create the delete logic for the delete button
        deleteBtn.addEventListener('click', () => {

            let index = overridesArr.indexOf(overrideObj);
            overridesArr.splice(index, 1)

            newElement.remove();
            overridesCount--
                
            if(overridesCount == 0){
                emptyText.style.display = "block"
            }
        });

        newElement.appendChild(deleteBtn)

        //clear the inputs
        document.getElementById("overrideCode").value = ""
        document.getElementById("overridePrice").value = ""

        //edit the empty text if there is more than 0 elements
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

        if(tag != ""){// only work if there is text in the input
            tagsArr.push(tag) // push tag to the array

            //create div and text for the new element
            var newText = document.createTextNode(tag);
            var newElement = document.createElement("div");
            newElement.className = "tagItem"

            newElement.appendChild(newText)
            document.getElementById("tagsWrapper").prepend(newElement);

            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'deleteTag';
            deleteBtn.textContent = 'Delete';

            // create delete logic for the delete button and append it 
            deleteBtn.addEventListener('click', () => {

                let index = tagsArr.indexOf(tag);
                tagsArr.splice(index, 1)

                newElement.remove();
                tagsCount--
                if(tagsCount == 0){
                    emptyText.style.display = "block"
                }
            });

            newElement.appendChild(deleteBtn)

            document.getElementById("addTag").value = "" //clear input field 

            emptyText.style.display = "none"
            tagsCount++
        } 
        
    }
});

document.getElementById("tagBtn").addEventListener('click', function(){
  
    let tag = document.getElementById("addTag").value;
    let emptyText = document.getElementById("tagsInnerText");

    if(tag != ""){// only work if there is text in the input
        tagsArr.push(tag) // push tag to the array

        //create div and text for the new element
        var newText = document.createTextNode(tag);
        var newElement = document.createElement("div");
        newElement.className = "tagItem"

        newElement.appendChild(newText)
        document.getElementById("tagsWrapper").prepend(newElement);

        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'deleteTag';
        deleteBtn.textContent = 'Delete';

        // create delete logic for the delete button and append it 
        deleteBtn.addEventListener('click', () => {

            let index = tagsArr.indexOf(tag);
            tagsArr.splice(index, 1)

            newElement.remove();
            tagsCount--
            if(tagsCount == 0){
                emptyText.style.display = "block"
            }
        });

        newElement.appendChild(deleteBtn)

        document.getElementById("addTag").value = "" //clear input field 

        emptyText.style.display = "none"
        tagsCount++
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

dropZone.addEventListener('change', async (event) => {
    event.preventDefault();
    dropZone.classList.remove('hover');
    //c.innerHTML = "Reading file...";


    const file = event.target.files[0];
    if (!file) {
      //c.innerHTML = "No file selected.";
      return;
    }

    addFile(file)

    const buffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

  });

  function addFile(file){

    fileObjList.push(file);

    let filename = file.name
    let parent = document.getElementById("filesWrapper")

    let newContainer = document.createElement("div")
    let newText = document.createTextNode(filename)
    let emptyText = document.getElementById("filesEmptyText")
    newContainer.className = "fileBar"

    let newDropdown = document.createElement("select");
    newDropdown.className = "filetypeDropdown"
        
    let options = ["Current Shopify Data","B&M Singles", "B&M Interior Sets"] //array of dropdown options (scales with the number of file types to be used)
    for (let i=0; i<options.length; i++){//create an option element and append it for each array element 
        let newOption = document.createElement("option");
        newOption.text = options[i]
        newOption.appendChild(newText)
        newDropdown.appendChild(newOption);
    }
         

    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'deleteTag';
    deleteBtn.textContent = 'Delete';

    //delete logic for file remove
    deleteBtn.addEventListener('click', () => {
        newContainer.remove();

        let index = fileObjList.indexOf(file);
        fileObjList.splice(index, 1)

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


document.getElementById("infoBtn").addEventListener('click', function(){ 
    let content = document.getElementById("content");
    let sidebar = document.getElementById("sidebar");
    let popup = document.getElementById("commandInfoPopup");

    content.style.opacity = "10%"
    sidebar.style.opacity = "10%"
    popup.style.display = "flex"

});

document.getElementById("closeInfo").addEventListener('click', function(){
    let content = document.getElementById("content");
    let sidebar = document.getElementById("sidebar");
    let popup = document.getElementById("commandInfoPopup");


    content.style.opacity = "100%"
    sidebar.style.opacity = "100%"
    popup.style.display = "none"

})


document.getElementById("formatInfo").addEventListener('click', function(){
    let content = document.getElementById("content");
    let sidebar = document.getElementById("sidebar");
    content.style.opacity = "10%"
    sidebar.style.opacity = "10%"
    document.getElementById("formatPopup").style.display = "block"

    
})


document.getElementById("closeFormat").addEventListener('click', function(){
    let content = document.getElementById("content");
    let sidebar = document.getElementById("sidebar");
    let popup = document.getElementById("formatPopup");

    let BM_setSKU = document.getElementById("BM_setSKU")
    let BM_setPrice = document.getElementById("BM_setPrice")


    if(fileFormats.has('B&M Singles')){
        fileFormats.delete('B&M Singles');
    }

    fileFormats.set('B&M Singles', {"skuCol":BM_setSKU.value, "priceCol": BM_setPrice.value})

    const obj = Object.fromEntries(fileFormats);
    const jsonString = JSON.stringify(obj);
    console.log(jsonString);

    content.style.opacity = "100%"
    sidebar.style.opacity = "100%"
    popup.style.display = "none"





})
