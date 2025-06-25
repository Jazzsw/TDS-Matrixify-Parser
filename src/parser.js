import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesArr } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';
import { saveAs } from 'https://cdn.skypack.dev/file-saver';
import { fileFormats } from './uiDriver.js';

const existingData = new Map(); // map for all existing data from the shopify export file [used for finding the custom diff for each finish]
const BM_map = new Map(); 
var masterFile = null; //a file object that gets assigned to the file with all the shopify info [used to loop through to find all the custom available finishes]

document.getElementById("createFile").addEventListener('click', async function(){

    let commandMode = document.getElementById("commandSelect").value
    let filePairings = []
    let dropDownElements = document.getElementsByClassName("filetypeDropdown")
    let index = 0;

    
    Array.from(dropDownElements).forEach(function (element) {//loop for each dropdown pair it with the corresponding file object 
        let pair = {"file": fileObjList[index], "type": element.value}
        filePairings.push(pair)
        index++;
    })

    //First we must isolate and remove the current shopify data so we can find the custom finish cost diff for each item 
    for(let i = 0; i<filePairings.length; i++){  
        if(filePairings[i].type == "Current Shopify Data"){
            await handleExistingData(filePairings[i].file); //this function populates the existingData Map
            masterFile = filePairings[i].file // set the master file to the file marked Current Shopify Data
            filePairings.splice(i,1)
        }
    }

    console.log("DATA HAS BEEN MAPPED")

    //Loop through the files and process them based on their dropdown classification 
    for (let i = 0; i<filePairings.length; i++){
        switch (filePairings[i].type){
            case "B&M Singles":
                console.log("B&M TRIGGERED")
                await parseBM(filePairings[i].file, fileFormats.get('B&M Singles').skuCol, fileFormats.get('B&M Singles').priceCol);//use the fileformat map from UI driver to get any possible override of the default file formats
                writeFile(masterFile, commandMode, BM_map)
                break;
        }

    }

})

/**
 * @name parseBM
 * @param file The file that contains new B&M prices, this should follow the format requirements outlined
 * @param skuCol the column of the file param in which the SKU is stored
 * @param priceCol the column of the file param in which the Price value is stored
 * @returns 1 for proper exit
 * @summary designed to take a B&M file with updated prices and populate the 'BM_map' map with the SKU and 
 *           price of each of the items in the file. The format of the map is:
 *           prefix : {
 *               info: [
 *                   {code: code; price: price}
 *               ]
 *           }          
 */

async function parseBM(file, skuCol, priceCol){

        //excelJS overhead to load a file
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        //loop for each sheet and then each row of each sheet
        workbook.eachSheet((worksheet) => {
            worksheet.eachRow((row, rowNumber) => {
                let SKU = row.values[skuCol] // find SKU
                let lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
                let code = SKU.slice(lastIndex);
                let prefix = SKU.slice(0,lastIndex);
                let price = null

                if(typeof(row.values[priceCol]) == 'object'){
                    price = row.values[priceCol].result

                } else{
                    price = row.values[priceCol]
                }
                

                SKU = replaceCode(prefix, code);
                SKU = "BM-".concat(SKU);
                
                //override the price value for any manual override items requested by the user
                for(let i = 0 ; i<overridesArr.length; i++){
                    if(SKU == overridesArr[i].code){
                        price = parseInt(overridesArr[i].price);
                        console.log("price for "+ SKU + " was overrided to "+ price)
                    }
                }
                
                //required to get the proper postfix (ie. C3NL <- PB)
                let goodCode = SKU.slice(SKU.lastIndexOf("-")+1)
                let goodPrefix = "BM-".concat(prefix)

                if(BM_map.has(goodPrefix)){ // if the prefix exists then simply push a variation code to the info array
                    BM_map.get(goodPrefix).info.push({'code': goodCode, 'price': price})
                }
                else{ // if the prefix does not exist then create a new object in the Map
                    BM_map.set(goodPrefix, {'info': [{'code': goodCode, 'price': price}]});
                }
            });

        })

        //debug printing the object in JSON format
        const obj = Object.fromEntries(BM_map);
        const jsonString = JSON.stringify(obj); 
        console.log(jsonString);

        return 1;
}

/**
 * @name replaceCode
 * @param SKU sku is the only the first part/prefix of the full SKU. For example for BM-1010-PB the SKU is "BM-1010"
 * @param code code is the variation code corresponding to the finish (including the -). For example for BM-1010-PB the code is "-PB"
 * @returns if the code is one of the known convertible codes then it returns the full SKU in proper format. For example "BM-1010-C3NL". If it is not a known code, then it returns the same SKU and code it is given just together.
 * @summary takes an SKU and code and converts it if possible, if not returns what it was given in a single string  
*/
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


/**
 * @name handleExistingData
 * @param file the file holding the existing Shopify price data
 * @summary takes the existing data from shopify and compares the price of the C3NL and the C7NL to find the custom 
 * price diff for each item. It stores this data in the "existingData" map. 
 */

async function handleExistingData(file){

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    let skuCol = null //32;
    let priceCol = null//37;

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber == 1){
               for(let i = 0; i<row.values.length; i++){
                if(row.values[i] == "Variant SKU"){
                    skuCol = i;
                    console.log('SKU COL SET TO '+ skuCol)
                }
                if(row.values[i] == "Variant Price"){
                    priceCol = i;
                    console.log('PRice COL SET TO '+ priceCol)
                }
               }
            }else{

                let SKU = row.values[skuCol]
                let price = row.values[priceCol]
                let lastIndex = null;
                let code = null;
                let prefix = null;

                //catch non-SKU entries
                if (!SKU || typeof SKU !== 'string'){
                    console.log("ERROR SKU CAUGHT" + SKU)
                } else{
                    lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
                    code = SKU.slice(lastIndex);
                    prefix = SKU.slice(0,lastIndex);
                    SKU = replaceCode(prefix, code);
            
                    if(existingData.has(prefix) == false){ // if the prefix (ie the SKU) does not exist then create the first entry
                        if(code == "-C3NL"){
                            existingData.set(prefix, {'C3NL': price, 'C7NL': 0, 'diff': 0})
                        }
                        if(code == "-C7NL"){
                            existingData.set(prefix, {'C3NL': 0, 'C7NL': price, 'diff': 0})
                        } 
                    }else{ // if the prefix exists then update the other value and the diff
                        if(code == "-C3NL"){
                            existingData.get(prefix).C3NL = price;
                            let high = existingData.get(prefix).C7NL;
                            let low = existingData.get(prefix).C3NL;
                    
                            existingData.get(prefix).diff = high-low;
                                
                        }
                        if(code == "-C7NL"){
                            existingData.get(prefix).C7NL = price;
                            let high = existingData.get(prefix).C7NL;
                            let low = existingData.get(prefix).C3NL;
                    
                            existingData.get(prefix).diff = high-low;
                        } 
                    }
                }

            }
                
        })
            // debug print in JSON format
            // const obj = Object.fromEntries(existingData);
            // const jsonString = JSON.stringify(obj);
            // console.log(jsonString);
        })

}

/**
 * @name writeFile
 * @param file takes the masterFile to loop through to get each available variation of the SKU
 * @param mode takes the update mode that the user has selected via dropdown
 * @param map takes the map with the proper prices and diff for the given info
 */

async function writeFile(file, mode, map){

    const downloadWorkbook = new ExcelJS.Workbook();
    const downloadSheet = downloadWorkbook.addWorksheet('Products');
    downloadSheet.columns = [ // create the columns for the Matrixify file, these header names are very specific, see Matrixify docs for more info
        { header: 'Variant SKU', key: 'sku', width: 30 },
        { header: 'Variant Price', key: 'price', width: 10 },
        { header: 'Command', key: 'command', width: 10},
        { header: 'Tags', key: 'tags', width: 10},
        { header: 'Tags Command', key: 'tagscommand', width: 15}
    ];

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    let skuCol = null //32;
    let priceCol = null //37;

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber == 1){
               for(let i = 0; i<row.values.length; i++){
                if(row.values[i] == "Variant SKU"){
                    skuCol = i;
                    console.log('SKU COL SET TO '+ skuCol)
                }
                if(row.values[i] == "Variant Price"){
                    priceCol = i;
                    console.log('PRice COL SET TO '+ priceCol)
                }
               }
            }else{

                let SKU = row.values[skuCol]
                let price = row.values[priceCol]
                let lastIndex = null;
                let code = null;
                let prefix = null;
                let newPrice = null;

                if(SKU != undefined){ // if the sku is valid continue

                    lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
                    code = SKU.slice(lastIndex);
                    prefix = SKU.slice(0,lastIndex);
                    SKU = replaceCode(prefix, code);

                    //console.log("SKU SEARCH:" + SKU)
                    //console.log("PRE SEARCH:" + map.get(prefix))


                    if(map.get(prefix) != undefined){ // try to find the corresponding item in the good price map 
                        for(let i = 0; i< map.get(prefix).info.length; i++){
                            if(map.get(prefix).info[i].code == "C3NL"){ // identify the base price using C3NL
                                newPrice = map.get(prefix).info[i].price // set the newPrice to the C3NL price
                            }
                        }
                    }
                    // if the current item being processed is a custom variant then take the C3NL price stored in newPrice and add the diff for this item before saving
                    if(["-C4NL", "-C7NL", "-C5NL", "-C10BNL"].includes(code)){ // if the code is one of the custom finishes, then set the price to the C3NL price plus the pre-calculated diff
                        //console.log("SKU: "+ prefix + "; existingData: "+ JSON.stringify(existingData.get(prefix))+ "Price: " + newPrice + "DIFF: " + existingData.get(prefix).diff )
                        price = newPrice + (existingData.get(prefix).diff)
                    }
                    downloadSheet.addRow({sku: SKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet   
                }
            }
        })
    })

    console.log("WRITE COMPLETE")

    //trigger download logic 
    downloadWorkbook.xlsx.writeBuffer().then((buffer) => { //convert buffer to blob and trigger download
            const blob = new Blob([buffer], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          saveAs(blob, 'test.xlsx'); // Trigger download
        });
}