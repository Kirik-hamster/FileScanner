function UpdateDOM(dataInfo, basePath) {
    if (dataInfo == undefined) {
        console.error("JSON данных не найден");
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
    const data = dataInfo.FilesInfos;
    if (data == undefined) {
        console.error("Информация о файлах и папках не найдена из JSON");
    }
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
console.log(123123);
export { UpdateDOM };
