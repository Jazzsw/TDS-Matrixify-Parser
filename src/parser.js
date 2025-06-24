import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesArr } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';
import { saveAs } from 'https://cdn.skypack.dev/file-saver';

const existingData = new Map(); // map for all existing data from the shopify export file

document.getElementById("createFile").addEventListener('click', function(){

    let commandMode = document.getElementById("commandSelect").value
    let filePairings = []

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
                parseBM(filePairings[i].file, commandMode, 1, 6);
                break;
            case "Current Shopify Data":
                handleExistingData(filePairings[i].file);
                
                break;

        }

    }

})

async function parseBM(file, mode, skuCol, priceCol){

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
            let SKU = row.values[skuCol] // find SKU
            let lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
            let code = SKU.slice(lastIndex);
            let prefix = SKU.slice(0,lastIndex);
            let price = row.values[priceCol].result
            

            SKU = replaceCode(prefix, code);
            SKU = "BM-".concat(SKU);
            
            for(let i = 0 ; i<overridesArr.length; i++){
                if(SKU == overridesArr[i].code){
                    price = parseInt(overridesArr[i].price);
                    console.log("price for "+ SKU + " was overrided to "+ price)
                }
            }

            if(SKU.length < 50){
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



function findDiff(file, code){

}

// document.getElementById("closeFormat").addEventListener('click', function(){
//     let bmSKU = document.getElementById("BM_setSKU");
//     let bmPrice = document.getElementById("BM_setPrice");

//     window.electronAPI.setSetting('SKU', bmSKU).then(() => {
//         alert('Setting saved!');
//     });
//     // settings.set('key', {
//     //     'SKU': bmSKU.value,
//     //     'PRICE': bmPrice.value
//     // });
// })


async function handleExistingData(file){
    const buffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);


    let skuCol = 32;
    let priceCol = 37;


    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {

            let SKU = row.values[skuCol]
            let price = row.values[priceCol]
            let lastIndex = null;
            let code = null;
            let prefix = null;

            if (!SKU || typeof SKU !== 'string'){
                console.log("ERROR SKU CAUGHT" + SKU)
            }

            else{
                lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
                code = SKU.slice(lastIndex);
                prefix = SKU.slice(0,lastIndex);
                SKU = replaceCode(prefix, code);
                
           
                if(existingData.has(prefix) == false){ // if the prefix (ie the SKU) does not exist then create the first entry
                    if(code == "-C3NL"){
                        existingData.set(prefix, {'C3NL': price, 'C10BNL': 0, 'diff': 0})
                    }
                    if(code == "-C10BNL"){
                        existingData.set(prefix, {'C3NL': 0, 'C10BNL': price, 'diff': 0})
                    } 
                }else{ // if the prefix exists then update the other value and the diff
                    if(code == "-C3NL"){
                        existingData.get(prefix).C3NL = price;
                        let high = existingData.get(prefix).C10BNL;
                        let low = existingData.get(prefix).C3NL;
                
                        existingData.get(prefix).diff = high-low;
                            
                    }
                    if(code == "-C10BNL"){
                        existingData.get(prefix).C10BNL = price;
                        let high = existingData.get(prefix).C10BNL;
                        let low = existingData.get(prefix).C3NL;
                
                        existingData.get(prefix).diff = high-low;
                    } 
                }

            }
                
        })
            const obj = Object.fromEntries(existingData); // Convert Map to a plain object
            const jsonString = JSON.stringify(obj); // Serialize the object to JSON
            console.log(jsonString);
        })

}