import { SentGet } from "./model.js";
import { UpdateDOM, curPath } from "./view.js";

document.addEventListener('DOMContentLoaded', async () => {

    let dataInfo: any = await SentGet("", "");
    let basePath: string; 
    if (dataInfo != undefined) {
        basePath = dataInfo.BasePath;
        UpdateDOM(dataInfo, basePath)
    } else {
        console.error("No data to update the DOM");
    }

    let back: HTMLBodyElement | null =  document.querySelector(".back");
    if (back != null) {
        back.addEventListener('click', async (e) => {
            e.preventDefault();
            await backClick(curPath);
        });
    }
});

async function backClick(basePath: string) {
    let sort: string = "";
    if (basePath != "/home") {
        let arrRoot: string[] = basePath.split("/");
        
        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
        arrRoot.pop();
        basePath = arrRoot.join("/");
        let dataInfo: any = await SentGet(basePath, sort)
        UpdateDOM(dataInfo, basePath);
        
    } else {
        let dataInfo = await SentGet(basePath, sort)

        UpdateDOM(dataInfo, basePath);
    }
}

async function fileInfoClick(fileInfo: any, basePath: string) {
    let fileInfos: any = fileInfo;
    let name: HTMLBodyElement | null = fileInfos.querySelector(".name");
    let sort: string = "";


    if (name != null) {
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