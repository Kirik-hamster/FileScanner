document.addEventListener('DOMContentLoaded',  async function() {
    let basePath = "/home";
    async function sentGet(root, sort) {
        
        
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

            dataInfo = await response.json();
            
            
            await updateDOM(dataInfo);
            
            return dataInfo
        } catch (error) {
            console.log("Ошибка при отправке запроса:", error)
        }
        return dataInfo
    }

    async function updateDOM(dataInfo) {
        let container = document.querySelector(".container");
        
        container.innerHTML = '';
        data = dataInfo.FilesInfos
        let time = document.querySelector(".time")
        time.innerText = formatTime(dataInfo.Time)
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
                let sort = url.searchParams.get("sort");
                if (sort == null) sort = ""
                if (root != null && root != "") {
                    console.log(root)
                    let arrRoot = root.split("/");
                    if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                    if (type.innerText == "Dir" && fileInfo.className != "root") {
                        console.log(name.innerText)
                        root += "/" + name.innerText + "/";
                        url.href += root;
                        sentGet(root, sort);
                    }
                } else if (root == null) {
                    if (basePath != "/" + name.innerText) {
                        basePath += "/" + name.innerText
                        sentGet(basePath, sort);
                    } else {
                        sentGet(basePath, sort);
                    }
                    
                }
            });
        }
        
        
    }
    let back = document.querySelector(".back"); 
    back.addEventListener('click', function() {
        let url = new URL(window.location.href);
        let root = url.searchParams.get("root");
        let sort = url.searchParams.get("sort");
        if (sort == null) sort = ""
        if (root != null) {
            
            let arrRoot = root.split("/");
            if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
            arrRoot.pop();
            root = arrRoot.join("/");
            url.href += root;
            sentGet(root, sort);
        }
        if (root == null) {
            let arrRoot = basePath.split("/");

            if ("/home" != arrRoot.join("/")) {
                if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                arrRoot.pop();
                basePath = arrRoot.join("/");
                sentGet(basePath, sort);
            }

        
        }
    });
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let sort = url.searchParams.get("sort");
    if (root != null) {
        if (sort != null) sort = "";
        await sentGet(root, sort);
    } else {
        await sentGet("","");
    }

    function formatTime(nanoseconds) {
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
})



