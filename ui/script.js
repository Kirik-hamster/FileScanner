const data = JSON.parse(jsonData);
console.log(data)
let container = document.querySelector(".container");
console.log(container)
for (i=0; i<data.length; i++) {
    let fileInfos = document.createElement("div");
    fileInfos.className = "fileInfos";

    let fileInfo = document.createElement("div");
    fileInfo.className = "fileInfo";

    let type = document.createElement("div")
    type.className = "type"
    type.innerHTML = data[i].IsDir

    let name = document.createElement("div")
    name.className = "name"
    name.innerHTML = data[i].Name

    let size = document.createElement("div")
    size.className = "size"
    size.innerHTML = data[i].Size

    fileInfo.appendChild(type)
    fileInfo.appendChild(name)
    fileInfo.appendChild(size)

    fileInfos.appendChild(fileInfo)

    container.appendChild(fileInfos)

}