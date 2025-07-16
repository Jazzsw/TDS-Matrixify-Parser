import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';
import { tagsArr } from './uiDriver.js';
import { overridesMap } from './uiDriver.js';
import { fileObjList } from './uiDriver.js';
import { saveAs } from 'https://cdn.skypack.dev/file-saver';
import { fileFormats } from './uiDriver.js';

const existingData = new Map(); // map for all existing data from the shopify export file [used for finding the custom diff for each finish]
const BM_map = new Map(); 
const notSoldComponents = new Map(); // map for all the B&M components that are not sold on Shopify but are used in interior sets
var masterFile = null; //a file object that gets assigned to the file with all the shopify info [used to loop through to find all the custom available finishes]
let undefinedCount = 0;
let brandArr = [];
let hardwareSet = [];


const codeMap = {
    "-PB": "-C3NL",
    "-OB": "-C10B",
    "-AB": "-C5",
    "-SB": "-C4NL",
    "-PN": "-C14",
    "-BN": "-C15",
    "-PL": "-C3",
    "-BK": "-C19"
};

let validKnobSets = ["8746", "8745", "8755", "8754", "8753", "8752", "8851", "8852", "8853"]

let validPlates = [   
    "8864", "8866", 
    "8862", "8865",
    "8764-B", "8764-K",
    "8767-B", "8767-K",
    "8762-B", "8762-K",
    "8763-B", "8763-K",
    "8871",
    "8876",
    "8876",
    "8741",
    "8742",
    "8873-B", "8873-D",
    "8875-B"
]

const downloadWorkbook = new ExcelJS.Workbook();
let downloadSheet = null;


document.getElementById("createFile").addEventListener('click', async function(){

    existingData.clear();
    BM_map.clear();
    document.getElementById("loading-overlay").style.display = "flex";

    let commandMode = document.getElementById("commandSelect").value
    let filePairings = []
    let dropDownElements = document.getElementsByClassName("filetypeDropdown")
    let index = 0;

    downloadSheet = downloadWorkbook.addWorksheet('Products');

    downloadSheet.columns = [ // create the columns for the Matrixify file, these header names are very specific, see Matrixify docs for more info
        { header: 'Variant SKU', key: 'sku', width: 30 },
        { header: 'Variant Price', key: 'price', width: 10 },
        { header: 'Command', key: 'command', width: 10},
        { header: 'Tags', key: 'tags', width: 20},
        { header: 'Tags Command', key: 'tagscommand', width: 15}
    ];
    let shopifyFlag = false;
    let BMFlag = false;

    Array.from(dropDownElements).forEach(function (element) {//loop for each dropdown pair it with the corresponding file object 
        let pair = {"file": fileObjList[index], "type": element.value}
        filePairings.push(pair)
        if(element.value == "Current Shopify Data"){ // if the file is the current shopify data then set the flag to false
            shopifyFlag = true;
        }
        if(element.value == "B&M"){ // if the file is the B&M Singles then set the flag to false
            BMFlag = true;
        }
        index++;
    })

    if(shopifyFlag && !BMFlag){
        alert("Warning: You are uploading a Shopify data file without a B&M file. This will have no effect. Please see README documentation on Shopify Export Files or B&M Files for more information")
    }
    if(!shopifyFlag && BMFlag){
        alert("Warning: You are uploading a B&M file without a Shopify data file. This will cause the program to fail.");
    }
    //First we must isolate and remove the current shopify data so we can find the custom finish cost diff for each item 
    for(let i = 0; i<filePairings.length; i++){  
        if(filePairings[i].type == "Current Shopify Data"){
            masterFile = filePairings[i].file // set the master file to the file marked Current Shopify Data
        }
    }

    for(let i = 0; i<filePairings.length; i++){
        if(filePairings[i].type == "Overrides"){
            await populateOverrides(filePairings[i].file); // populate the overrides map with the overrides file
        }
    }


    //Loop through the files and process them based on their dropdown classification 
    for (let i = 0; i<filePairings.length; i++){
        if(filePairings[i].type.startsWith("custom_")){
            await parseCustom(filePairings[i].file, fileFormats.get(filePairings[i].type).skuCol, fileFormats.get(filePairings[i].type).priceCol, commandMode)
        }
        switch (filePairings[i].type){
            case "B&M":
                brandArr.push("B&M");
                await handleExistingData(masterFile);
                if(undefinedCount > 10){
                    //alert("Warning: The program identified [" +undefinedCount+ "] undefined SKU values identified. This is likely due to a format error. Check that your file uploads are properly specified using the dropdown, and that the file format requirement are met")
                    undefinedCount = 0;
                }
                await parseBM(filePairings[i].file, fileFormats.get('B&M').skuCol, fileFormats.get('B&M').priceCol);//use the fileformat map from UI driver to get any possible override of the default file formats
                await writeFile(masterFile, commandMode, BM_map)
                break;
            case "Reggio":
                brandArr.push("Reggio Registers");
                await parseReg(filePairings[i].file, fileFormats.get('Reggio').skuCol, fileFormats.get('Reggio').priceCol, fileFormats.get('Reggio').matCol, commandMode);
                break;
        }

    }

    downloadFile(downloadSheet); //trigger the download of the file
    document.getElementById("loading-overlay").style.display = "none";// hide the loading overlay

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
 *                   {code: code; price: price}
 *               ]
 *           }          
 */

async function parseBM(file, skuCol, priceCol){
       
    //excelJS overhead to load a file
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    try{
        await workbook.xlsx.load(buffer);
    }catch(e){
        alert("ERROR: It appears the file that you are trying to upload is not a .xlsx file");
        return;
    }
    //loop for each sheet and then each row of each sheet
    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            let SKU = row.values[skuCol] // find SKU
            if(typeof SKU !== 'string'){ // if the SKU is not a string then convert it to a string
                SKU = SKU.toString();
            }
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
                
            price = checkOverrides(SKU, price); // check for overrides
                
            //required to get the proper postfix (ie. C3NL <- PB)
            let goodCode = SKU.slice(SKU.lastIndexOf("-")+1);
            let goodPrefix = "BM-".concat(prefix);
            if(goodPrefix.endsWith("W")){
                goodPrefix = goodPrefix.slice(0, -2); // remove the W from the end of the prefix
                goodPrefix = goodPrefix + "W"; // add the W back to the end of the prefix

            }
            if(BM_map.has(goodPrefix)){ // if the prefix exists then simply push a variation code to the info array
                BM_map.get(goodPrefix).info.push({'code': goodCode, 'price': price});
            } else{ // if the prefix does not exist then create a new object in the Map
                BM_map.set(goodPrefix, {'info': [{'code': goodCode, 'price': price}]});
            };
        });
    });

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
    if (typeof SKU !== "string" || typeof code !== "string") {
        alert("Invalid input to replaceCode:", { SKU, code });
        return SKU;
    }
    
    const convertedCode = codeMap[code];

    if (convertedCode) {
        return SKU.concat(convertedCode);
    } else if (!code.startsWith("-")) {
        // Not a finish code, just return the base SKU
        return SKU;
    } else { 
        // console.log(
        //     `%c SKU NOT CONVERTED ${SKU.concat(code)}`,
        //     "color: red; font-weight: bold;"
        // );
        return SKU.concat(code);
    }
}

function arrToStr(array){
    return array.join(",");
}




/**
 * @name handleExistingData
 * @param file the file holding the existing Shopify price data
 * @summary takes the existing data from shopify and compares the price of the C3NL and the C7NL to find the custom 
 * price diff for each item. It stores this data in the "existingData" map. 
 */

async function handleExistingData(file){

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    try{
        await workbook.xlsx.load(buffer);
    }catch(e){
        alert("ERROR: It appears the file that you are trying to upload is not a .xlsx file");
        return;
    }

    let skuCol = null //32;
    let priceCol = null//37;


    workbook.eachSheet((worksheet) => {
        if(worksheet.name.toLowerCase() == "products"){ // only process the master sheet
            worksheet.eachRow((row, rowNumber) => {
                if(rowNumber == 1){
                    for(let i = 0; i<row.values.length; i++){
                        if(row.values[i] == "Variant SKU"){//set the skuCol to the column with the header "Variant SKU"
                            skuCol = i;
                        }
                        if(row.values[i] == "Variant Price"){//set the priceCol to the column with the header "Variant Price"
                            priceCol = i;
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
                        undefinedCount++;
                        //console.log("ERROR SKU CAUGHT " + SKU+ rowNumber)
                    } else{
                        lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code 
                        if(lastIndex <= 2){
                            //console.log("++ Adding SKU without postfix: " + SKU);
                            existingData.set(SKU, "no postfix code");
                        }
                        code = SKU.slice(lastIndex);
                        prefix = SKU.slice(0,lastIndex);
                        SKU = replaceCode(prefix, code);

                
                        if(!existingData.has(prefix)){ // if the prefix (ie the SKU) does not exist then create the first entry
                            if(code == "-C3NL"){
                                //console.log("new prefix "+ prefix)      
                                existingData.set(prefix, {'C3NL': price, 'C7NL': 0, 'diff': null})
                            }
                            if(["-C4NL", "-C7NL", "-C5NL", "-C10BNL"].includes(code)){
                                //console.log("new prefix "+ prefix)    
                                existingData.set(prefix, {'C3NL': 0, 'C7NL': price, 'diff': null})
                            }
                        }else{ // if the prefix exists then update the other value and the diff
                            //console.log("EXISTING PREFIX " + prefix);
                            if(code == "-C3NL" && existingData.get(prefix).C3NL == 0){ // if the C3NL price is not set then set it
                                existingData.get(prefix).C3NL = price;
                                let high = existingData.get(prefix).C7NL;
                                let low = existingData.get(prefix).C3NL;
                        
                                existingData.get(prefix).diff = high-low;
                                //console.log("DIFF FOR " + prefix + " IS " + existingData.get(prefix).diff);

                            }
                            if(["-C4NL", "-C7NL", "-C5NL", "-C10BNL"].includes(code) && existingData.get(prefix).C7NL == 0){
                                existingData.get(prefix).C7NL = price;
                                let high = existingData.get(prefix).C7NL;
                                let low = existingData.get(prefix).C3NL;
                        
                                existingData.get(prefix).diff = high-low;
                                //console.log("DIFF FOR " + prefix + " IS " + existingData.get(prefix).diff)
                            } 
                        }
                    }

                }
                    
            })
        }
    })
}

/**
 * @name writeFile
 * @param file takes the masterFile to loop through to get each available variation of the SKU
 * @param mode takes the update mode that the user has selected via dropdown
 * @param map takes the map with the proper prices and diff for the given info
 */

async function writeFile(file, mode, map){

    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    try{
        await workbook.xlsx.load(buffer);
    }catch(e){
        alert("ERROR: Write file failed to load.");
        return;
    }

    let skuCol = null //32;
    let priceCol = null //37;

    

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            if(rowNumber == 1){ // use row 1 to find the SKU and Price columns
               for(let i = 0; i<row.values.length; i++){
                    if(row.values[i] == "Variant SKU"){ //names are by convention based on the Matrixify docs
                        skuCol = i;
                    }
                    if(row.values[i] == "Variant Price"){ //names are by convention based on the Matrixify docs
                        priceCol = i;
                    }
                }

                if (!skuCol || !priceCol) { // if the SKU or Price columns are not found then alert the user
                    alert("Required headers not found. Ensure 'Variant SKU' and 'Variant Price' exist within the Shopify export file");
                    return;
                }

            }else{
                
                let SKU = row.values[skuCol]
                let price = row.values[priceCol]
                let lastIndex = null;
                let code = null;
                let prefix = null;
                let newPrice = null;

                let brand = row.values[6]; // get the brand from the second column of the row
                let formatValid = false;

                if(brandArr.includes(brand)){ // if the brand is in the brandArr then set the formatValid to true
                    formatValid = true;
                }

                if(SKU != undefined && formatValid){ // if the sku is valid continue

                    if(SKU.startsWith("101-")){
                        handleHardwareSet(SKU, mode, price, row.values[8]); // handle the hardware set separately (8 is tags)
                    } else if(SKU.startsWith("100-")){
                       // console.log(" !! 100 Entry Hardware Skipped " + SKU + "!!");
                    }else{

                        lastIndex = SKU.lastIndexOf("-"); //remove and convert the postfix code

                        if(lastIndex<= 2){// if the last index is the one after the BM- then it does not have a postfix and can just be added
                            if(existingData.has(SKU)){
                                //console.log("---SKU without postfix: " + SKU + " price: " + price);
                                price = checkOverrides(SKU, price); // check for overrides
                                downloadSheet.addRow({sku: SKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
                            }
                        }

                        code = SKU.slice(lastIndex);
                        prefix = SKU.slice(0,lastIndex);
                        SKU = replaceCode(prefix, code);


                        if(map.has(prefix)){ // try to find the corresponding item in the good price map 
                            for(let i = 0; i< map.get(prefix).info.length; i++){
                                if(map.get(prefix).info[i].code == "C3NL"){ // identify the base price using C3NL
                                    newPrice = map.get(prefix).info[i].price // set the newPrice to the C3NL price
                                }
                            }
                        }

                        // if the current item being processed is a custom variant then take the C3NL price stored in newPrice and add the diff for this item before saving
                        if(["-C4NL", "-C7NL", "-C5NL", "-C10BNL"].includes(code)){ // if the code is one of the custom finishes, then set the price to the C3NL price plus the pre-calculated diff
                            //console.log("SKU: "+ prefix + "; existingData: "+ JSON.stringify(existingData.get(prefix))+ "Price: " + newPrice + "DIFF: " + existingData.get(prefix).diff )
                            if(existingData.has(prefix)){
                                newPrice = newPrice + (existingData.get(prefix).diff)
                                //console.log(`%c ${SKU} +" " + ${existingData.get(prefix).diff} + "" +${newPrice}`,"color: green; font-weight: bold;");
                                newPrice = checkOverrides(SKU, newPrice); // check for overrides
                                downloadSheet.addRow({sku: SKU, price: newPrice, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
                            }
                        }else{
                            if(map.has(prefix)){ // try to find the corresponding item in the good price map 
                                let index = map.get(prefix).info.indexOf(prefix);
                                //console.log(JSON.stringify(map.get(prefix)));
                                for (let item of map.get(prefix).info){
                                    if(prefix + "-" + item.code == SKU){
                                        //console.log(`%c ${SKU} + " "${JSON.stringify(item)}`,"color: green; font-weight: bold;");
                                        newPrice = item.price; // set the newPrice to the price in the map
                                        newPrice = checkOverrides(SKU, newPrice); // check for overrides
                                        downloadSheet.addRow({sku: SKU, price: newPrice, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
                                    }
                                }
                                
                            }
                        }
                    }  
                }
            }
        })
    })

    console.log("WRITE COMPLETE")
    undefinedCount = 0;

}

async function parseReg(file, skuCol, priceCol, matCol, mode){
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    try{
        await workbook.xlsx.load(buffer);
    }catch(e){
        alert("ERROR: It appears the file that you are trying to upload is not a .xlsx file");
        return;
    }

    workbook.eachSheet((worksheet) => {
        if(worksheet.name.toLowerCase() == "master sheet"){
            worksheet.eachRow((row, rowNumber) => {
                let price = Math.round(row.values[priceCol].result) ?? row.values[priceCol]; // handle the case where price is an object with a result property
                let sku = row.values[skuCol].result ?? row.values[skuCol]; // handle the case where sku is an object with a result property

                if(typeof sku !== 'string'){
                    sku = sku.toString(); // convert to string if not already
                }

                let aluminumSteelColors = ["MSG", "RB", "S", "W", "B",""]//B is Black. MSG is Sun Gold, RB is Oil Rubbed Bronze. S is Silver. W is White.
                if(!isNaN(price)){

                    if(row.values[matCol] == "ALUMINUM"){
                        sku = sku.concat("A");
                        for(let color of aluminumSteelColors){
                            let variantSKU = sku + color + "NH"; // Aluminum web default is NH
                            if (overridesMap.has(variantSKU)){ // handle sku overrides
                                price = parseInt(overridesMap.get(variantSKU))
                                console.log("price for "+ variantSKU + " was overridden to "+ price)
                            }
                            price = checkOverrides(variantSKU, price); // check for overrides
                            downloadSheet.addRow({sku: variantSKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
                        }
                    }else if(row.values[matCol] == "STEEL"){
                        sku = sku.concat("S");
                        for(let color of aluminumSteelColors){
                            let variantSKU = sku + color + "H"; // Steel web default is H
                            if (overridesMap.has(variantSKU)){ // handle sku overrides
                                price = parseInt(overridesMap.get(variantSKU))
                                console.log("price for "+ variantSKU + " was overridden to "+ price)
                            }
                            price = checkOverrides(variantSKU, price); // check for overrides
                            downloadSheet.addRow({sku: variantSKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
                        }
                    }else if(row.values[matCol] == "IRON"){
                        sku = sku.concat("NH");
                        price = checkOverrides(sku, price); // check for overrides
                        downloadSheet.addRow({sku: sku, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet 
                    } else if(row.values[matCol] == undefined){ // empty material column means it is a louver register
                        sku = sku.concat("BL");
                        price = checkOverrides(sku, price); // check for overrides
                        downloadSheet.addRow({sku: sku, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet 
                    }
                }
            })
        }
    })

}


async function parseCustom(file, skuCol, priceCol, mode){
        //excelJS overhead to load a file
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        try{
            await workbook.xlsx.load(buffer);
        }catch(e){
            alert("ERROR: It appears the file that you are trying to upload is not a .xlsx file");
            return;
        }

     workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            let SKU = row.values[skuCol] // find SKU
            let price = row.values[priceCol].result ?? row.values[priceCol]


            if(typeof SKU !== 'string'){
                SKU = SKU.toString(); // convert to string if not already
            }
            if(!isNaN(price)){
                if(overridesMap.has(SKU)){ // if the SKU is in the overrides map then use the overridden price
                    price = parseInt(overridesMap.get(SKU))
                    console.log("price for "+ SKU + " was overridden to "+ price)
                }
                price = checkOverrides(SKU, price); // check for overrides
                downloadSheet.addRow({sku: SKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet
            }
        })
    })
}


function checkOverrides(SKU, originalPrice){
    if (overridesMap.has(SKU)){ // handle sku overrides
        let price = parseInt(overridesMap.get(SKU))
        console.log("price for "+ SKU + " was overridden to "+ price)
        return price;
    }
    return originalPrice;
}



async function handleHardwareSet(SKU, mode, originalPrice, tags){
if(!hardwareSet.includes(SKU)){
    if(!tags.includes("entrance hardware")){
        const intersectionKnobs = validKnobSets.filter(item => tags.includes(item));
        const intersectionPlates = validPlates.filter(item => tags.includes(item));
        let cutSKU = SKU.slice(0, SKU.lastIndexOf("-"));

        if(intersectionKnobs.length == 0 || intersectionPlates.length == 0){
            //THIS IS B&M WITH ANOTHER KNOB OR PLATE (KEEP COST AND ADD A TAG)
            let tempTagsArr = tagsArr.slice(); // create a copy of the tagsArr
            tempTagsArr.push("B&M Mix");
            let price = checkOverrides(SKU, originalPrice); // check for overrides
            downloadSheet.addRow({sku: SKU, price: originalPrice, command: mode, tagscommand: "MERGE", tags: arrToStr(tempTagsArr)}); //add the row to

        }
        else{

            if(intersectionPlates.length != 1){
                if(cutSKU.endsWith("K")){
                    for (let item of intersectionPlates){
                        if(item.endsWith("B")){
                            intersectionPlates.splice(intersectionPlates.indexOf(item), 1); // remove the item from the array
                        }
                    }
                }else{
                    for (let item of intersectionPlates){
                        if(item.endsWith("K")){
                            intersectionPlates.splice(intersectionPlates.indexOf(item), 1); // remove the item from the array
                        }
                    }
                }
            }

            // if(intersectionKnobs.length != 1 || intersectionPlates.length != 1){
            //     console.log("knobs: " + intersectionKnobs + " plates: " + intersectionPlates);
            // }

            let knobSKU = "BM-" + intersectionKnobs[0];
            let plateSKU = "BM-" + intersectionPlates[0];
            let variant = SKU.slice(SKU.lastIndexOf("-")+1);
            let price = 0;

            

            for (let item of BM_map.get(knobSKU).info){
                if(["C4NL", "C5NL", "C7NL", "C10BNL"].includes(variant)){
                    if(item.code == "C3NL"){
                        price += item.price + 25 // set the price to the price in the map plus the $25 charge
                    }
                } else if(item.code == variant){
                    price += item.price; // set the price to the price in the map
                }
            }

            if(plateSKU.startsWith("BM-8873")){// special case for the 8873 plates which require one of each B and D plates
                let plateOne = "BM-8873-B";
                let plateTwo = "BM-8873-D";
                for (let item of BM_map.get(plateOne).info){
                    if(["C4NL", "C5NL", "C7NL", "C10BNL"].includes(variant)){
                        if(item.code == "C3NL"){
                            price += (item.price) // no 25 charge bc it is all one set, just 1 charge
                        }
                    } else if(item.code == variant){
                        price += item.price; // set the price to the price in the map
                    }
                }
                for (let item of BM_map.get(plateTwo).info){
                    if(["C4NL", "C5NL", "C7NL", "C10BNL"].includes(variant)){
                        if(item.code == "C3NL"){
                            price += (item.price) // no 25 charge bc it is all one set, just 1 charge
                        }
                    } else if(item.code == variant){
                        price += item.price; // set the price to the price in the map
                    }
                }
                
            } else {

                for (let item of BM_map.get(plateSKU).info){
                    if(["C4NL", "C5NL", "C7NL", "C10BNL"].includes(variant)){
                        if(item.code == "C3NL"){
                            price += (2 * item.price) // no 25 charge bc it is all one set, just 1 charge
                        }
                    } else if(item.code == variant){
                        price += 2 * item.price; // set the price to the price in the map
                    }
                }
            }

            tagsArr.push(knobSKU)
            tagsArr.push(plateSKU)

            price = checkOverrides(SKU, price); // check for overrides
            downloadSheet.addRow({sku: SKU, price: price, command: mode, tagscommand: "MERGE", tags: arrToStr(tagsArr)}); //add the row to the worksheet

            tagsArr.pop();
            tagsArr.pop();
            //console.log(SKU + " Hardware Set Knob: " + knobSKU + " Plate: " + plateSKU + " Variant: " + variant + " Price: " + price + " diff: " + existingData.get(cutSKU).diff);

        } 
    }
    hardwareSet.push(SKU); // add the SKU to the hardwareSet to avoid duplicates
}

}


async function populateOverrides(file){
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();

    try{
        await workbook.xlsx.load(buffer);
    }catch(e){
        alert("ERROR: Write file failed to load.");
        return;
    }

    let skuCol = 1;
    let priceCol = 2;

    workbook.eachSheet((worksheet) => {
        worksheet.eachRow((row, rowNumber) => {
            let SKU = row.values[skuCol] // find SKU
            let price = row.values[priceCol]
            overridesMap.set(SKU, price); // set the SKU and price in the overrides map
        });
    });

}


function downloadFile(downloadSheet){

    downloadWorkbook.xlsx.writeBuffer().then((buffer) => { //convert buffer to blob and trigger download
            const blob = new Blob([buffer], {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
          saveAs(blob, 'SheetForge Export.xlsx'); // Trigger download
        });
    
    downloadWorkbook.removeWorksheet(downloadSheet.id)// reset the worksheet for the next download
}