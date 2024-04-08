var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SentGet } from "./model.js";
import { UpdateDOM, curPath } from "./view.js";
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const dataInfo = yield SentGet("", "");
    let basePath;
    if (dataInfo !== undefined) {
        basePath = dataInfo.BasePath;
        UpdateDOM(dataInfo, basePath);
    }
    else {
        console.error("No data to update the DOM");
    }
    const back = document.querySelector(".back");
    if (back != null) {
        back.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            yield backClick(curPath);
        }));
    }
}));
function backClick(basePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const sort = "";
        if (basePath !== "/home") {
            const arrRoot = basePath.split("/");
            if (arrRoot[arrRoot.length - 1] === "")
                arrRoot.pop();
            arrRoot.pop();
            basePath = arrRoot.join("/");
            const dataInfo = yield SentGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        }
        else {
            const dataInfo = yield SentGet(basePath, sort);
            UpdateDOM(dataInfo, basePath);
        }
    });
}
function fileInfoClick(fileInfo, basePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileInfos = fileInfo;
        const name = fileInfos.querySelector(".name");
        const sort = "";
        if (name != null) {
            if (basePath !== "/" + name.innerText) {
                basePath += "/" + name.innerText;
                const dataInfo = yield SentGet(basePath, sort);
                UpdateDOM(dataInfo, basePath);
            }
            else {
                const dataInfo = yield SentGet(basePath, sort);
                UpdateDOM(dataInfo, basePath);
            }
        }
    });
}
export { fileInfoClick, backClick };
