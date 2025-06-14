
//document.getElementById("fileInput").style.color = "white"

const inputElement = document.getElementById("fileInput");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */

alert(fileList.length)

}
