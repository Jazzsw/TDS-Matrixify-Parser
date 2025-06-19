import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesArr } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';

document.getElementById("createFile").addEventListener('click', function(){

    let commandMode = document.getElementById("commandSelect").value

    let filePairings =[]

    let dropDownElements = document.getElementsByClassName("filetypeDropdown")
    let index = 0;

    Array.from(dropDownElements).forEach(function (element) {//loop for each dropdown pair it with the corresponding file object 
        let pair = {"file": fileObjList[index], "type": element.value}
        filePairings.push (pair)
        index++;
    })


    for (let i = 0; i<filePairings.length; i++){
        switch (filePairings[i].type){
            case "B&M Singles":
                parseBM(filePairings[i].file, commandMode);
                break;

        }

    }

})

function parseBM(file, mode){
    



}