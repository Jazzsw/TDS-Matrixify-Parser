import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';

document.getElementById("createFile").addEventListener('click', function(){
    //alert('file')

    var 
    const fileInput = document.getElementById('fileInput'); 
    
    const fileList = fileInput.files;

    for(let i = 0; i<fileList.length; i++){
        alert(fileList[i].name)
    }



})