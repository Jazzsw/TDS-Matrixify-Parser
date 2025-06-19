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

async function parseBM(file, mode){

        const buffer = await file.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.eachSheet((worksheet) => {
        alert(worksheet.name)
        
        worksheet.eachRow((row, rowNumber) => {
            let SKU = row.values[1] // find SKU
            let lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
            let code = SKU.slice(lastIndex);
            let prefix = SKU.slice(0,lastIndex)
            

            SKU = replaceCode(prefix, code)
            SKU = "BM-".concat(SKU)
            console.log(SKU)



            //c.innerHTML += `<br>Row ${rowNumber}: ${row.values.slice(1).join(', ')}`;
            //c.innerHTML += `<br>Row ${rowNumber}: ${row.values[6].result}`;
        });

        })

        // const worksheet = workbook.addWorksheet('Products');
        // worksheet.columns = [
        // { header: 'Variant SKU', key: 'Variant SKU', width: 10 },
        // { header: 'Variant Price', key: 'Variant Price', width: 10 },
        // { header: 'Tags', key: 'Tags', width: 10}
        // ];

        // if(tagsArr.length > 0){
        //     (worksheet.columns).push({ header: 'Variant SKU', key: 'Variant SKU', width: 10 })
        // }






}



function replaceCode(SKU, code){
    switch(code){
        case "-PB":
            return SKU.concat("-C3NL");
            break;
        case "-OB":
            return SKU.concat("-C10BNL");
            break;
        case "-AB":
            return SKU.concat("-C5NL");
            break;
        case "-SB":
            return SKU.concat("-C4NL");
            break;
        case "-PN":
            return SKU.concat("-C14");
            break;
        case "SN":
            return SKU.concat("-C15");
            break;
        default:
            return "UNKNOWN SKU POSTFIX"
    }

}