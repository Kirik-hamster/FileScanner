var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UpdateDOM } from "./view.js";
document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const body = document.querySelector("body");
    if (body != null) {
        body.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let infoData = yield SentGet("/home/kir/go", "");
                console.log(infoData);
                if (infoData == undefined) {
                    console.log("lox");
                }
                UpdateDOM(infoData, "");
            }
            catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        }));
    }
}));
function SentGet(root, sort) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(window.location.href);
        url.href = `${url.protocol}//${url.hostname}:${url.port}/files`;
        const paramsFiles = new URLSearchParams();
        paramsFiles.append('root', root);
        paramsFiles.append('sort', sort);
        url.search = paramsFiles.toString();
        try {
            const response = yield fetch(url.href, {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const dataInfo = yield response.json();
            return dataInfo;
            //console.log(dataInfo);
        }
        catch (error) {
            console.error("Ошибка при отправке запроса:", error);
        }
    });
}
export { SentGet };
