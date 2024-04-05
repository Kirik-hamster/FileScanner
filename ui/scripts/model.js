//модель  
async function SentGet(root, sort) {
    
    
    if (root == null) root = ""
    if (sort == null) sort = ""
    let url = new URL(window.location.href);

    url.href = url.protocol+"//"+url.hostname+":"+url.port+"/files"

    let paramsFiles = new URLSearchParams();
    paramsFiles.append('root', root);
    paramsFiles.append('sort', sort);
    url.search = paramsFiles.toString();
    try {
        const response = await fetch(url.href, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`)
        }

        const dataInfo = await response.json();
        return dataInfo
    } catch (error) {
        console.error("Ошибка при отправке запроса:", error)
        return null;
    }
}

export { SentGet };