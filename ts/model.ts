// SentGet отправлят запрос на сервер с параметрами root и sort и получает ответ с json
async function SendGet(root: string, sort: string)  {

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

        const hidd: HTMLDivElement | null = document.querySelector(".loading");
        if (hidd != null) {hidd.className = "hiddenEl";}
        return dataInfo;
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error);
        return null;
    }

}

export { SendGet }





