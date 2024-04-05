import { SentGet } from './model.js';
import { UpdateDOM } from './view.js';

//контроллер
document.addEventListener('DOMContentLoaded',  async function() {
    let basePath = "/home";
    let url = new URL(window.location.href);
    let root = url.searchParams.get("root");
    let sort = url.searchParams.get("sort");
    let dataInfo;
    if (root != null) {
        if (sort != null) sort = "";
        dataInfo = await SentGet(basePath, sort);
    } else {
        dataInfo = await SentGet(basePath, sort);
    }
    if (dataInfo) {
        UpdateDOM(dataInfo);
    } else {
        console.error("No data to update the DOM");
    }
    
    let container = document.querySelector(".container");
    container.addEventListener('click', async function(event){
  
        if (event.target.classList.contains("fileInfo") ||
            event.target.classList.contains("name") ||
            event.target.classList.contains("type") ||
            event.target.classList.contains("size")) {
        
            for (let i = 0; i < container.children.length; i++) {
                container.children[i].addEventListener('click', async function() {
                    let fileInfos = container.children[i];
                    let name = fileInfos.querySelector(".name")
                    let url = new URL(window.location.href);
                    let root = url.searchParams.get("root");
                    let sort = url.searchParams.get("sort");
                    if (sort == null) sort = "";
        
                    if (root != null && root != "") {
                        console.log(root)
                        let arrRoot = root.split("/");
                        if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                        if (type.innerText == "Dir" && fileInfos.className != "root") {
                            console.log(name.innerHTML)
                            root += "/" + name.innerText + "/";
                            let dataInfo = await SentGet(basePath, sort)
                            UpdateDOM(dataInfo);
                        }
                    } else if (root == null || root == "") {
                        
                        if (basePath != "/" + name.innerText) {
                            
                            basePath += "/" + name.innerText
                            let dataInfo = await SentGet(basePath, sort)
                            UpdateDOM(dataInfo);
                        } else {
                            let dataInfo = await SentGet(basePath, sort)
                            UpdateDOM(dataInfo);
                        }
                        
                    }
                })
            }
        }

    })
    

    
    let back = document.querySelector(".back"); 
    back.addEventListener('click', async function(event) {
        event.preventDefault();
        let url = new URL(window.location.href);
        let root = url.searchParams.get("root");
        let sort = url.searchParams.get("sort");
        if (sort == null) sort = ""
        if (root != null) {
            
            let arrRoot = root.split("/");
            if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
            arrRoot.pop();
            root = arrRoot.join("/");
            let dataInfo = await SentGet(basePath, sort)
            UpdateDOM(dataInfo);
        }
        if (root == null) {
            let arrRoot = basePath.split("/");

            if ("/home" != arrRoot.join("/")) {
                if (arrRoot[arrRoot.length-1] == "") arrRoot.pop();
                arrRoot.pop();
                basePath = arrRoot.join("/");
                let dataInfo = await SentGet(basePath, sort)
                UpdateDOM(dataInfo);
            }

        
        }
    });



})
