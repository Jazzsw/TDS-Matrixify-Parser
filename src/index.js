import { fileObjList } from './uiDriver.js';
import { addFile } from './uiDriver.js';

  const dropZone = document.getElementById('uploadDiv');
  const fileInput = document.getElementById('fileInput');

  // Highlight drop zone when dragging over
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  // Remove highlight on drag leave
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  // Handle file drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');

    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // Handle manual selection
  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  // Example function to process files
  function handleFiles(files) {
    for (const file of files) {
      console.log('File:', file.name, file.size, file.type);
      addFile(file);
      // You can add your file processing logic here
    }
  }

