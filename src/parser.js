import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesArr } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';
import { saveAs } from 'https://cdn.skypack.dev/file-saver';

document.getElementById("createFile").addEventListener('click', function(){

    let commandMode = document.getElementById("commandSelect").value

    console.log(JSON.stringify(tagsArr));

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

        const downloadWorkbook = new ExcelJS.Workbook();
        const downloadSheet = downloadWorkbook.addWorksheet('Products');
        downloadSheet.columns = [
        { header: 'Variant SKU', key: 'sku', width: 30 },
        { header: 'Variant Price', key: 'price', width: 10 },
        { header: 'Command', key: 'command', width: 10},
        { header: 'Tags', key: 'tags', width: 10},
        { header: 'Tags Command', key: 'tagscommand', width: 15}

        ];

        const buffer = await file.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.eachSheet((worksheet) => {
        //alert(worksheet.name);
        
        worksheet.eachRow((row, rowNumber) => {
            let SKU = row.values[1] // find SKU
            let lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
            let code = SKU.slice(lastIndex);
            let prefix = SKU.slice(0,lastIndex);
            let price = row.values[6].result
            

            SKU = replaceCode(prefix, code);
            SKU = "BM-".concat(SKU);
            
            if(SKU.length < 50){
                console.log(arrToStr(tagsArr))
                downloadSheet.addRow({sku: SKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)});
            }

            //console.log(SKU);

        });

        })


        downloadWorkbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
        
          saveAs(blob, 'test.xlsx'); // Trigger download
        });

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
        case "-BN":
            return SKU.concat("-C15");
            break;
        case "-PL":
            return SKU.concat("-C3");
            break;
        case "-20":
            return SKU.concat(code)
        default:
            if(code[0] != "-"){
                return SKU;
            }
            else{
                console.log("%c SKU NOT CONVERTED " + SKU.concat(code), "color: red; font-weight: bold;");
                return SKU.concat(code)
            }
    }

}


function arrToStr(array){
    return array.join(",");
}