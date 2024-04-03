const data = JSON.parse(jsonData);
console.log(data)
let container = document.querySelector(".container");
for (i=0; i<data.length; i++) {
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
    if (data[i].IsRoot) fileInfo.className = "root"
    fileInfo.addEventListener('click', function() {
        let url = new URL(window.location.href);
        let root = url.searchParams.get("root");
        let arrRoot = root.split("/");
        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
        if (type.innerText == "Dir" && fileInfo.className != "root") {
            root += "/" + name.innerText + "/";
            url.searchParams.set('root', root);
            window.location.href = url
        }
    });
}
let back = document.querySelector(".back");
back.addEventListener('click', function() {
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let arrRoot = root.split("/");
    if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
    arrRoot.pop();
    root = arrRoot.join("/");
    url.searchParams.set('root', root);
    window.location.href = url;
});