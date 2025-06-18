// import ExcelJS from 'https://cdn.jsdelivr.net/npm/exceljs/+esm';

//   const c = document.getElementById('consoleText');
//   c.innerHTML = "Waiting for file...";

//   document.getElementById('fileInput').addEventListener('change', async (event) => {
//     c.innerHTML = "Reading file...";

//     const file = event.target.files[0];
//     if (!file) {
//       c.innerHTML = "No file selected.";
//       return;
//     }

//     const buffer = await file.arrayBuffer();

//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.load(buffer);

//     workbook.eachSheet((worksheet) => {
//       c.innerHTML += `<br><strong>Sheet: ${worksheet.name}</strong>`;
//       worksheet.eachRow((row, rowNumber) => {
//         //c.innerHTML += `<br>Row ${rowNumber}: ${row.values.slice(1).join(', ')}`;
//         c.innerHTML += `<br>Row ${rowNumber}: ${row.values[6].result}`;
//       });
//     });
//   });