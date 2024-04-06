
async function SentGet(root: string, sort: string)  {

    const url: URL = new URL(window.location.href);

    url.href = `${url.protocol}//${url.hostname}:${url.port}/files`;

    const paramsFiles: URLSearchParams = new URLSearchParams();
    paramsFiles.append('root', root);
    paramsFiles.append('sort', sort);
    url.search = paramsFiles.toString();
    try {
        const response: Response = await fetch(url.href, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const dataInfo = await response.json();
        console.log(dataInfo);
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
    }


}
document.addEventListener('DOMContentLoaded', () => {
    const body: HTMLBodyElement | null = document.querySelector("body");
    if (body != null)  {
        body.addEventListener('click', async () => {
            try {
                let infoData: any = await SentGet("/home/kir/go", "");
                console.log(infoData);
                if (infoData == undefined) {
                    console.log("lox");
                }
                UpdateDOM(infoData, "");
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }

        })
    }
})

function UpdateDOM(dataInfo:any, basePath:string) {
    if (dataInfo == undefined) {
        console.log("lox1");
        return
    }
    const currentPath: HTMLDivElement | null = document.querySelector(".currenPath");
    if (currentPath != null) {
        currentPath.innerText = basePath;
    }
    const container: HTMLDivElement | null = document.querySelector(".container");
    if (container != null) {
        container.innerHTML = "";
    }
    const data: any = dataInfo.FileInfos;
    const time: HTMLDivElement | null  = document.querySelector(".time")
    if (time != null) {
        time.innerText = dataInfo.Time;
    }
    for (let i = 0; i < data.length; i++) {
        const fileInfos: HTMLDivElement =  document.createElement("div");
        fileInfos.className = "fileInfos";

        const fileInfo: HTMLDivElement = document.createElement("div");
        fileInfo.className = "fileInfo";

        const type: HTMLDivElement = document.createElement("div");
        type.className = "type";
        type.id = "info";
        type.innerHTML = data[i].IsDir;

        const name: HTMLDivElement = document.createElement("div");
        name.className = "name";
        name.id = "info";
        name.innerHTML = data[i].Name;

        const size: HTMLDivElement = document.createElement("div");
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



