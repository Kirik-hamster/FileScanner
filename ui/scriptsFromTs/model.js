var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            const hidd = document.querySelector(".loading");
            if (hidd != null) {
                hidd.className = "hiddenEl";
            }
            return dataInfo;
        }
        catch (error) {
            console.error("Ошибка при отправке запроса:", error);
            return null;
        }
    });
}
export { SentGet };
