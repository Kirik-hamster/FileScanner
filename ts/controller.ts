import { SentGet } from "./model";
import { UpdateDOM, curPath } from "./view";

document.addEventListener('DOMContentLoaded', async () => {

    const dataInfo: any = await SentGet("", "");
    let basePath: string;
    if (dataInfo !== undefined) {
        basePath = dataInfo.BasePath;
        UpdateDOM(dataInfo, basePath);
    } else {
        console.error("No data to update the DOM");
    }

    const back: HTMLBodyElement | null =  document.querySelector(".back");
    if (back != null) {
        back.addEventListener('click', async (e) => {
            e.preventDefault();
            await backClick(curPath);
        });
    }
});

async function backClick(basePath: string) {
    const sort: string = "";
    if (basePath !== "/home") {
        const arrRoot: string[] = basePath.split("/");
        if (arrRoot[arrRoot.length-1] === "") arrRoot.pop();
        arrRoot.pop();
        basePath = arrRoot.join("/");
        const dataInfo: any = await SentGet(basePath, sort);
        UpdateDOM(dataInfo, basePath);
    } else {
        const dataInfo = await SentGet(basePath, sort);
        UpdateDOM(dataInfo, basePath);
    }
}

async function fileInfoClick(fileInfo: any, basePath: string) {
    const fileInfos: any = fileInfo;
    const name: HTMLBodyElement | null = fileInfos.querySelector(".name");
    const sort: string = "";

    if (name != null) {
        if (basePath !== "/" + name.innerText) {
            basePath += "/" + name.innerText;
            const dataInfo = await SentGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        } else {
            const dataInfo = await SentGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        }
    }
}
export { fileInfoClick, backClick }