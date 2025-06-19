import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesArr } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';

document.getElementById("createFile").addEventListener('click', function(){

    let commandMode = document.getElementById("commandSelect").value

    alert(commandMode)


    // for (let i = 0; i<overridesArr.length; i++){
    //     alert(JSON.stringify(overridesArr[i]))
    // }



})