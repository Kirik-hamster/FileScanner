"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function SentGet(root, sort) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(window.location.href);
        url.href = `${url.protocol}//${url.hostname}:${url.port}/files`;
        const paramsFiles = new URLSearchParams();
        paramsFiles.append('root', root);
        paramsFiles.append('sort', sort);
        url.search = paramsFiles.toString();
        try {
            const response = yield fetch(url.href, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const dataInfo = yield response.json();
            console.log(dataInfo);
        }
        catch (error) {
            console.error("Ошибка при отправке запроса:", error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector("body");
    if (body != null) {
        body.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const infoData = yield SentGet("/home/kir/go", "");
                console.log(infoData);
                if (infoData == undefined) {
                    console.log("lox");
                }
                UpdateDOM(infoData, "");
            }
            catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }));
    }
});
function UpdateDOM(dataInfo, basePath) {
    if (dataInfo == undefined) {
        console.log("lox1");
        return;
    }
    const currentPath = document.querySelector(".currenPath");
    if (currentPath != null) {
        currentPath.innerText = basePath;
    }
    const container = document.querySelector(".container");
    if (container != null) {
        container.innerHTML = "";
    }
    const data = dataInfo.FileInfos;
    const time = document.querySelector(".time");
    if (time != null) {
        time.innerText = dataInfo.Time;
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
    }
}
