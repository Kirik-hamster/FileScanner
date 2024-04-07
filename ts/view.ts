import { fileInfoClick } from './controller.js';
let curPath: string = "/home";
function UpdateDOM(dataInfo:any, basePath:string) {
    if (dataInfo == undefined) {
        console.error("JSON данных не найден");
        return
    }
    const currentPath: HTMLDivElement | null = document.querySelector(".currenPath");
    if (currentPath != null) {
        currentPath.innerText = basePath;
        curPath = currentPath.innerText;
    }
    const container: HTMLDivElement | null = document.querySelector(".container");
    if (container != null) {
        container.innerHTML = "";
    }
    const data: any = dataInfo.FilesInfos;
    if (data == undefined) {
        console.error("Информация о файлах и папках не найдена из JSON");
    }
    const time: HTMLDivElement | null  = document.querySelector(".time")
    if (time != null) {
        time.innerText = formatTime(dataInfo.Time);
    }
    for (let i = 0; i < data.length; i++) {
        const fileInfos: HTMLDivElement =  document.createElement("div");
        fileInfos.className = "fileInfos";

        const fileInfo: HTMLDivElement = document.createElement("div");
        fileInfo.className = "fileInfo";

        const type: HTMLDivElement = document.createElement("div");
        type.className = "type";
        type.id = "info";
        type.innerHTML = data[i].IsDir;

        const name: HTMLDivElement = document.createElement("div");
        name.className = "name";
        name.id = "info";
        name.innerHTML = data[i].Name;

        const size: HTMLDivElement = document.createElement("div");
        size.className = "size";
        size.id = "info";
        size.innerHTML = data[i].Size;

        fileInfo.appendChild(type);
        fileInfo.appendChild(name);
        fileInfo.appendChild(size);

        fileInfos.appendChild(fileInfo);

        if (container != null) {
            container.appendChild(fileInfos);
        }
        if (data[i].IsRoot) {
            fileInfo.className = "root";
            type.className = "rootType";
            name.className = "rootName";
            size.className = "rootSize";
        }
        fileInfo.addEventListener('click', async function() {

            await fileInfoClick(fileInfo, basePath)

        });
    }
}

function formatTime(nanoseconds: number): string {
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
export { UpdateDOM, curPath }