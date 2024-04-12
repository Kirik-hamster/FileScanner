import { fileInfoClick } from './controller';

enum Classes {
    currenPath = "currenPath",
    infoContainer = "container",
    fileInfos = "fileInfos",
    fileInfo = "fileInfo",
    type = "type",
    name = "name",
    size = "size",
    root = "root",
    rootType = "rootType",
    rootName = "rootName",
    rootSize = "rootSize"
} 
enum Ids {
    info = "info",
}

let curPath: string = "/";
function UpdateDOM(dataInfo:any, basePath:string) {
    if (dataInfo === undefined) {
        console.error("JSON данных не найден");
        return
    }
    const currentPath: HTMLDivElement | null = document.querySelector(`.${Classes.currenPath}`);
    if (currentPath != null) {
        currentPath.innerText = basePath;
        curPath = currentPath.innerText;
    }
    const container: HTMLDivElement | null = document.querySelector(`.${Classes.infoContainer}`);
    if (container != null) {
        container.innerHTML = "";
    }
    const data: any = dataInfo.FilesInfos;
    if (data === undefined) {
        console.error("Информация о файлах и папках не найдена из JSON");
    }
    const time: HTMLDivElement | null  = document.querySelector(".time")
    if (time != null) {
        time.innerText = formatTime(dataInfo.Time);
    }
    for (let i = 0; i < data.length; i++) {
        const fileInfos: HTMLDivElement =  document.createElement("div");
        fileInfos.className = Classes.fileInfos;

        const fileInfo: HTMLDivElement = document.createElement("div");
        fileInfo.className = Classes.fileInfo;

        const type: HTMLDivElement = document.createElement("div");
        type.className = Classes.type;
        type.id = Ids.info;
        type.innerHTML = data[i].IsDir;

        const name: HTMLDivElement = document.createElement("div");
        name.className = Classes.name;
        name.id = Ids.info;
        name.innerHTML = data[i].Name;

        const size: HTMLDivElement = document.createElement("div");
        size.className = Classes.size;
        size.id = Ids.info;
        size.innerHTML = data[i].Size;

        fileInfo.appendChild(type);
        fileInfo.appendChild(name);
        fileInfo.appendChild(size);

        fileInfos.appendChild(fileInfo);

        if (container != null) {
            container.appendChild(fileInfos);
        }

        fileInfo.addEventListener('click', async () => {

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