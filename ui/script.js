document.addEventListener('DOMContentLoaded', function() {
    let dt =  fetch('http://localhost:8080/files/jsonData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(dataJson => {   
            const data = dataJson.FilesInfos;
            let time = document.querySelector(".time")
            time.innerText = formatTime(dataJson.Time)
            let container = document.querySelector(".container");
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
                    if (root != null && root != "") {
                        let arrRoot = root.split("/");
                        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                        if (type.innerText == "Dir" && fileInfo.className != "root") {
                            root += "/" + name.innerText + "/";
                            url.searchParams.set('root', root);
                            window.location.href = url;
                        }
                    } else if (root == null) {
                        url.searchParams.append("root", "/home");
                        window.location.href = url;
                    } else if (root == "") {
                        root = "/home";
                        url.searchParams.set('root', root);
                        window.location.href = url;
                    }
                });
            }
            let back = document.querySelector(".back");
            back.addEventListener('click', function() {
                let url = new URL(window.location.href);
                let root = url.searchParams.get("root");
                if (root != null) {
                    let arrRoot = root.split("/");
                    if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                    arrRoot.pop();
                    root = arrRoot.join("/");
                    url.searchParams.set('root', root);
                    window.location.href = url;
                }
            });
        })
        .catch(error => {
        console.error('Произошла ошибка при получении данных:', error);
    });

})

function formatTime(nanoseconds) {
    let time;
    let unit;
  
    if (nanoseconds < 1e6) { 
      time = nanoseconds;
      unit = 'ns';
    } else if (nanoseconds < 1e9) { 
      time = nanoseconds / 1e6; 
      unit = 'ms';
    } else { 
      time = nanoseconds / 1e9; 
      unit = 's';
    }
  
    return `${time.toFixed(2)} ${unit}`;
  }