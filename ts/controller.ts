import { SendGet } from "./model";
import { UpdateDOM, curPath } from "./view";

interface FileInfo {
    IsDir: string,
    IsRoot: boolean,
    Name: string,
    Size: string,
    SizeInt64: number
}

interface DataInfo {
    BasePath: string,
    FilesInfos: FileInfo[],
    RootInfo: FileInfo,
    Statistic: string,
    Time: number
}

document.addEventListener('DOMContentLoaded', async () => {

    const dataInfo: DataInfo = await SendGet("", "");
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
// backClick оборобатывает нажатие кнопки "back"
async function backClick(basePath: string) {
    const sort: string = "";
    if (basePath !== "/home") {
        const arrRoot: string[] = basePath.split("/");
        if (arrRoot[arrRoot.length-1] === "") arrRoot.pop();
        arrRoot.pop();
        basePath = arrRoot.join("/");
        const dataInfo: DataInfo = await SendGet(basePath, sort);
        UpdateDOM(dataInfo, basePath);
    } else {
        const dataInfo = await SendGet(basePath, sort);
        UpdateDOM(dataInfo, basePath);
    }
}
// fileInfoClick обрабатывает нажатие на дректорию или файл из списка содержимого директории
async function fileInfoClick(fileInfo: HTMLDivElement, basePath: string) {
    const fileInfos: HTMLDivElement = fileInfo;
    const name: HTMLBodyElement | null = fileInfos.querySelector(".name");
    const sort: string = "";

    if (name != null) {
        if (basePath !== "/" + name.innerText) {
            basePath += "/" + name.innerText;
            const dataInfo = await SendGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        } else {
            const dataInfo = await SendGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        }
    }
}
export { fileInfoClick, backClick }