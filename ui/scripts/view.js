//вид
import { fileInfoClick, backClick } from './controller.js';
let CurrenPath = "/home";
function UpdateDOM(dataInfo, basePath) {
    let currentPath = document.querySelector(".currenPath")
    currentPath.innerText = basePath;
    CurrenPath = currentPath.innerText;
    let container = document.querySelector(".container");
    container.innerHTML = '';
    let data = dataInfo.FilesInfos
    let time = document.querySelector(".time")
    time.innerText = formatTime(dataInfo.Time)
    for (let i=0; i<data.length; i++) {
        let fileInfos = document.createElement("div");
        fileInfos.className = "fileInfos";

        let fileInfo = document.createElement("div");
        fileInfo.className = "fileInfo";

        let type = document.createElement("div");
        type.className = "type";
        type.id = "info"
        type.innerHTML = data[i].IsDir;

        let name = document.createElement("div");
        name.className = "name";
        name.id = "info"
        name.innerHTML = data[i].Name;

        let size = document.createElement("div");
        size.className = "size";
        size.id = "info"
        size.innerHTML = data[i].Size;

        fileInfo.appendChild(type);
        fileInfo.appendChild(name);
        fileInfo.appendChild(size);

        fileInfos.appendChild(fileInfo);

        container.appendChild(fileInfos);
        if (data[i].IsRoot) {
            fileInfo.className = "root";
            type.className = "rootType";
            name.className = "rootName";
            size.className = "rootSize";
        }

        fileInfo.addEventListener('click', async function() {

            await fileInfoClick(fileInfo, basePath)

        })

    }

    return currentPath


    
    
}

function formatTime(nanoseconds) {
    let time;
    let unit;
    if (nanoseconds < 1e3) {
        time = nanoseconds 
        unit = 'ns'
    }
    if (nanoseconds < 1e6) { 
        time = nanoseconds / 1e3;
        unit = 'μs';
    } else if (nanoseconds < 1e9) { 
        time = nanoseconds / 1e6; 
        unit = 'ms';
    } else { 
        time = nanoseconds / 1e9; 
        unit = 's';
    }
    
    return `${time.toFixed(2)} ${unit}`;
}

export { UpdateDOM, CurrenPath}