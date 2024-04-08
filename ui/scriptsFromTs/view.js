var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fileInfoClick } from './controller.js';
let curPath = "/home";
function UpdateDOM(dataInfo, basePath) {
    if (dataInfo === undefined) {
        console.error("JSON данных не найден");
        return;
    }
    const currentPath = document.querySelector(".currenPath");
    if (currentPath != null) {
        currentPath.innerText = basePath;
        curPath = currentPath.innerText;
    }
    const container = document.querySelector(".container");
    if (container != null) {
        container.innerHTML = "";
    }
    const data = dataInfo.FilesInfos;
    if (data === undefined) {
        console.error("Информация о файлах и папках не найдена из JSON");
    }
    const time = document.querySelector(".time");
    if (time != null) {
        time.innerText = formatTime(dataInfo.Time);
    }
    for (let i = 0; i < data.length; i++) {
        const fileInfos = document.createElement("div");
        fileInfos.className = "fileInfos";
        const fileInfo = document.createElement("div");
        fileInfo.className = "fileInfo";
        const type = document.createElement("div");
        type.className = "type";
        type.id = "info";
        type.innerHTML = data[i].IsDir;
        const name = document.createElement("div");
        name.className = "name";
        name.id = "info";
        name.innerHTML = data[i].Name;
        const size = document.createElement("div");
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
        fileInfo.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            yield fileInfoClick(fileInfo, basePath);
        }));
    }
}
function formatTime(nanoseconds) {
    let time;
    let unit;
    if (nanoseconds < 1e3) {
        time = nanoseconds;
        unit = 'ns';
    }
    if (nanoseconds < 1e6) {
        time = nanoseconds / 1e3;
        unit = 'μs';
    }
    else if (nanoseconds < 1e9) {
        time = nanoseconds / 1e6;
        unit = 'ms';
    }
    else {
        time = nanoseconds / 1e9;
        unit = 's';
    }
    return `${time.toFixed(2)} ${unit}`;
}
export { UpdateDOM, curPath };
