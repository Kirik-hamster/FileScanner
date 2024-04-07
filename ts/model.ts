import { UpdateDOM } from "./view.js";

document.addEventListener('DOMContentLoaded', async () => {
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
        return dataInfo
        //console.log(dataInfo);
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
    }

}

export { SentGet }





