//import { file } from 'electron-settings';
import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';

// Arrays to store bulk update tags and price overrides
export var tagsArr = [] // array of strings (tags)
export var overridesMap = new Map () // map of overrides matching the sku to the override price
export var fileObjList = [] // array of each file object
export var fileFormats = new Map() // save the SKU and price columns for each supported file type

let customFormats = new Map();
let numberOfFormats = 0;
let options = ["Current Shopify Data", "B&M Singles", "Reggio"] //array of dropdown options

// Price Override
let overridesCount = 0; // counter to tell when overrides are empty for display
fileFormats.set('B&M Singles', {"skuCol":1, "priceCol": 6})//push default values for B&M file structure
fileFormats.set('Reggio', {"skuCol":2, "priceCol": 20, "matCol": 6})//push default values for Reggio file structure

const overrideNode = document.getElementById("overridePrice");
overrideNode.addEventListener("keyup", function(event) { // detect enter key
    if (event.key === "Enter") {
        let code = document.getElementById("overrideCode").value;
        let price = document.getElementById("overridePrice").value;
        let emptyText = document.getElementById("overrideInnerText");

        if(code != "" && price != ""){ // Only work if there is content in the inputs

            //let overrideObj = {"code": code, "price": price} //create object based on inputs
            //overridesMap.push(overrideObj) //push object to array
            overridesMap.set(code, price)

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
            deleteBtn.addEventListener('click', function () {
                // let index = overridesMap.indexOf(overrideObj);
                // overridesMap.splice(index, 1)
                overridesMap.delete(code)
                console.log(JSON.stringify(overridesMap))
                
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

        //let overrideObj = {"code": code, "price": price} //create object based on inputs
        //overridesMap.push(overrideObj) //push object to array
        overridesMap.set(code, price)


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

            // let index = overridesMap.indexOf(overrideObj);
            // overridesMap.splice(index, 1)
            overridesMap.delete(code)
            console.log(JSON.stringify(overridesMap))

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

  export function addFile(file){

    fileObjList.push(file);

    console.log(JSON.stringify(fileObjList))

    let filename = file.name
    let parent = document.getElementById("filesWrapper")

    let newContainer = document.createElement("div")
    let newText = document.createTextNode(filename)
    let emptyText = document.getElementById("filesEmptyText")
    newContainer.className = "fileBar"

    let newDropdown = document.createElement("select");
    newDropdown.className = "filetypeDropdown"
        
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

    let RG_setSKU = document.getElementById("RG_setSKU")
    let RG_setPrice = document.getElementById("RG_setPrice")
    let RG_setMat = document.getElementById("RG_setMaterial")


    if(fileFormats.has('B&M Singles')){
        fileFormats.delete('B&M Singles');
    }

    if(fileFormats.has('Reggio')){
        fileFormats.delete('Reggio');
    }
    fileFormats.set('Reggio', {"skuCol":RG_setSKU.value, "priceCol": RG_setPrice.value, "matCol": RG_setMat.value})//reset Reggio file structure
    fileFormats.set('B&M Singles', {"skuCol":BM_setSKU.value, "priceCol": BM_setPrice.value})

    // Loop through custom formats and add them to the fileFormats map
    for(const [key, val] of customFormats){
        let sku = val.skuInput.value
        let price = val.priceInput.value

        fileFormats.set(key, {"skuCol":sku, "priceCol": price});
        options.push(key)
    }
    
    //debug print for the list of file formats that will be sent to the parser
    const obj = Object.fromEntries(fileFormats);
    const jsonString = JSON.stringify(obj);
    console.log(jsonString);

    content.style.opacity = "100%"
    sidebar.style.opacity = "100%"
    popup.style.display = "none"

})


document.getElementById("addCustomFormat").addEventListener('click', function(){

    let parentDiv = document.createElement("div")
    let skuInput = document.createElement("input")
    let priceInput = document.createElement("input")

    parentDiv.className = "customFormat"

    skuInput.type = "text"
    priceInput.type = "text"

    skuInput.placeholder = "SKU Column Value"
    priceInput.placeholder = "Price Column Value"

    skuInput.className = "formatInput"
    priceInput.className = "formatInput"

    let skuText = document.createElement("p");
    skuText.appendChild(document.createTextNode("SKU Column"));
    let priceText = document.createElement("p")
    priceText.appendChild(document.createTextNode("Price Column"));


    let delP = document.createElement("p");
    let delText = document.createTextNode("Delete");

    delP.appendChild(delText)
    delP.className = "deleteOverride"

    skuText.className = "textNode"
    priceText.className = "textNode"

    delP.addEventListener('click', function(){//delete logic for the custom format
        parentDiv.remove()
    })

    parentDiv.appendChild(skuText)
    parentDiv.appendChild(skuInput)
    parentDiv.appendChild(priceText)
    parentDiv.appendChild(priceInput)
    parentDiv.appendChild(delP)

    document.getElementById("formatContainer").appendChild(parentDiv)

    numberOfFormats++//insures unique key for the custom format

    customFormats.set(("custom_"+numberOfFormats), {"skuInput":skuInput, "priceInput": priceInput})// add the inputs to the customFormats map so they can be accessed later

})
