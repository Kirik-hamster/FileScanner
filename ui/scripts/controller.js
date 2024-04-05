import { SentGet } from './model.js';
import { UpdateDOM, CurrenPath } from './view.js';
let basePath;
//контроллер
document.addEventListener('DOMContentLoaded',  async function() {
    
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let sort = url.searchParams.get("sort");
    let dataInfo;
    if (root != null) {
        if (sort != null) sort = "";
        dataInfo = await SentGet("", sort);
    } else {
        dataInfo = await SentGet("", sort);
    }
    if (dataInfo) {
        basePath = dataInfo.BasePath;
        
        UpdateDOM(dataInfo, basePath);
    } else {
        console.error("No data to update the DOM");
    }

 
    let back = document.querySelector(".back"); 
    back.addEventListener('click', async function(event) {
        event.preventDefault();
        await backClick(CurrenPath)

    })



})

async function backClick(basePath) {
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let sort = url.searchParams.get("sort");
    if (sort == null) sort = ""
    if (root != null) {
        
        let arrRoot = root.split("/");
        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
        arrRoot.pop();
        root = arrRoot.join("/");
        let dataInfo = await SentGet(basePath, sort)
        UpdateDOM(dataInfo, basePath);
    }
    if (root == null) {
        if (basePath != "/home") {
            let arrRoot = basePath.split("/");
            
            if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
            arrRoot.pop();
            basePath = arrRoot.join("/");
            let dataInfo = await SentGet(basePath, sort)
            UpdateDOM(dataInfo, basePath);
            
        } else {
            let dataInfo = await SentGet(basePath, sort)

            UpdateDOM(dataInfo, basePath);
        }
    }
}
async function fileInfoClick(fileInfo, basePath) {
    let fileInfos = fileInfo;
    let name = fileInfos.querySelector(".name")
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let sort = url.searchParams.get("sort");
    if (sort == null) sort = "";

    if (root != null && root != "") {
        let arrRoot = root.split("/");
        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
        if (type.innerText == "Dir" && fileInfos.className != "root") {
            root += "/" + name.innerText + "/";
            let dataInfo = await SentGet(basePath, sort)
            UpdateDOM(dataInfo, basePath);
        }
    } else if (root == null || root == "") {
        
        if (basePath != "/" + name.innerText) {
            
            basePath += "/" + name.innerText
            let dataInfo = await SentGet(basePath, sort)
            UpdateDOM(dataInfo, basePath);
        } else {
            let dataInfo = await SentGet(basePath, sort)
            UpdateDOM(dataInfo, basePath);
        }
        
    }
}

export { fileInfoClick, backClick }
