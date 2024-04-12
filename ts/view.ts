import { fileInfoClick } from './controller';

enum Classes {
    statisticLink = "link",
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

let curPath: string = "/";
// UpdateDOM отрисовывает список вложеных дирекорий и папок
function UpdateDOM(dataInfo:DataInfo, basePath:string) {

    if (dataInfo === undefined) {
        console.error("JSON данных не найден");
        return
    }
    const statisticLink: HTMLElement | null = document.querySelector(`.${Classes.statisticLink}`);
    if (statisticLink instanceof HTMLAnchorElement) {
        statisticLink.href = dataInfo.Statistic;
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
    const data: FileInfo[] = dataInfo.FilesInfos;
    if (data === undefined) {
        console.error("Информация о файлах и папках не найдена из JSON");
    }
    const time: HTMLDivElement | null  = document.querySelector(".time")
    if (time != null) {
        time.innerText = formatTime(dataInfo.Time);
    }
    data.forEach((_: FileInfo, i: number) => {
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
    });

}
// formatTime форматирует время из наносекунт в микро/мили/секунды
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