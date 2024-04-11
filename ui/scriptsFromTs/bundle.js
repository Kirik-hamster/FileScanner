/*! For license information please see bundle.js.LICENSE.txt */
(()=>{"use strict";var __webpack_modules__={"./ts/controller.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   backClick: () => (/* binding */ backClick),\n/* harmony export */   fileInfoClick: () => (/* binding */ fileInfoClick)\n/* harmony export */ });\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ "./ts/model.ts");\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view */ "./ts/view.ts");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\n\ndocument.addEventListener(\'DOMContentLoaded\', () => __awaiter(void 0, void 0, void 0, function* () {\n    const dataInfo = yield (0,_model__WEBPACK_IMPORTED_MODULE_0__.SentGet)("", "");\n    let basePath;\n    if (dataInfo !== undefined) {\n        basePath = dataInfo.BasePath;\n        (0,_view__WEBPACK_IMPORTED_MODULE_1__.UpdateDOM)(dataInfo, basePath);\n    }\n    else {\n        console.error("No data to update the DOM");\n    }\n    const back = document.querySelector(".back");\n    if (back != null) {\n        back.addEventListener(\'click\', (e) => __awaiter(void 0, void 0, void 0, function* () {\n            e.preventDefault();\n            yield backClick(_view__WEBPACK_IMPORTED_MODULE_1__.curPath);\n        }));\n    }\n}));\nfunction backClick(basePath) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const sort = "";\n        if (basePath !== "/home") {\n            const arrRoot = basePath.split("/");\n            if (arrRoot[arrRoot.length - 1] === "")\n                arrRoot.pop();\n            arrRoot.pop();\n            basePath = arrRoot.join("/");\n            const dataInfo = yield (0,_model__WEBPACK_IMPORTED_MODULE_0__.SentGet)(basePath, sort);\n            (0,_view__WEBPACK_IMPORTED_MODULE_1__.UpdateDOM)(dataInfo, basePath);\n        }\n        else {\n            const dataInfo = yield (0,_model__WEBPACK_IMPORTED_MODULE_0__.SentGet)(basePath, sort);\n            (0,_view__WEBPACK_IMPORTED_MODULE_1__.UpdateDOM)(dataInfo, basePath);\n        }\n    });\n}\nfunction fileInfoClick(fileInfo, basePath) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const fileInfos = fileInfo;\n        const name = fileInfos.querySelector(".name");\n        const sort = "";\n        if (name != null) {\n            if (basePath !== "/" + name.innerText) {\n                basePath += "/" + name.innerText;\n                const dataInfo = yield (0,_model__WEBPACK_IMPORTED_MODULE_0__.SentGet)(basePath, sort);\n                (0,_view__WEBPACK_IMPORTED_MODULE_1__.UpdateDOM)(dataInfo, basePath);\n            }\n            else {\n                const dataInfo = yield (0,_model__WEBPACK_IMPORTED_MODULE_0__.SentGet)(basePath, sort);\n                (0,_view__WEBPACK_IMPORTED_MODULE_1__.UpdateDOM)(dataInfo, basePath);\n            }\n        }\n    });\n}\n\n\n\n//# sourceURL=webpack://filescanner/./ts/controller.ts?')},"./ts/index.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SentGet: () => (/* reexport safe */ _model__WEBPACK_IMPORTED_MODULE_1__.SentGet),\n/* harmony export */   UpdateDOM: () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_2__.UpdateDOM),\n/* harmony export */   backClick: () => (/* reexport safe */ _controller__WEBPACK_IMPORTED_MODULE_0__.backClick),\n/* harmony export */   curPath: () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_2__.curPath),\n/* harmony export */   fileInfoClick: () => (/* reexport safe */ _controller__WEBPACK_IMPORTED_MODULE_0__.fileInfoClick)\n/* harmony export */ });\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./ts/controller.ts");\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ "./ts/model.ts");\n/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view */ "./ts/view.ts");\n\n\n\n\n\n//# sourceURL=webpack://filescanner/./ts/index.ts?')},"./ts/model.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SentGet: () => (/* binding */ SentGet)\n/* harmony export */ });\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nfunction SentGet(root, sort) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const url = new URL(window.location.href);\n        url.href = `${url.protocol}//${url.hostname}:${url.port}/files`;\n        const paramsFiles = new URLSearchParams();\n        paramsFiles.append(\'root\', root);\n        paramsFiles.append(\'sort\', sort);\n        url.search = paramsFiles.toString();\n        try {\n            const response = yield fetch(url.href, {\n                method: \'GET\',\n            });\n            if (!response.ok) {\n                throw new Error(`Ошибка HTTP: ${response.status}`);\n            }\n            const dataInfo = yield response.json();\n            const hidd = document.querySelector(".loading");\n            if (hidd != null) {\n                hidd.className = "hiddenEl";\n            }\n            return dataInfo;\n        }\n        catch (error) {\n            console.error("Ошибка при отправке запроса:", error);\n            return null;\n        }\n    });\n}\n\n\n\n//# sourceURL=webpack://filescanner/./ts/model.ts?')},"./ts/view.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{eval('__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   UpdateDOM: () => (/* binding */ UpdateDOM),\n/* harmony export */   curPath: () => (/* binding */ curPath)\n/* harmony export */ });\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ "./ts/controller.ts");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n\nlet curPath = "/";\nfunction UpdateDOM(dataInfo, basePath) {\n    if (dataInfo === undefined) {\n        console.error("JSON данных не найден");\n        return;\n    }\n    const currentPath = document.querySelector(".currenPath");\n    if (currentPath != null) {\n        currentPath.innerText = basePath;\n        curPath = currentPath.innerText;\n    }\n    const container = document.querySelector(".container");\n    if (container != null) {\n        container.innerHTML = "";\n    }\n    const data = dataInfo.FilesInfos;\n    if (data === undefined) {\n        console.error("Информация о файлах и папках не найдена из JSON");\n    }\n    const time = document.querySelector(".time");\n    if (time != null) {\n        time.innerText = formatTime(dataInfo.Time);\n    }\n    for (let i = 0; i < data.length; i++) {\n        const fileInfos = document.createElement("div");\n        fileInfos.className = "fileInfos";\n        const fileInfo = document.createElement("div");\n        fileInfo.className = "fileInfo";\n        const type = document.createElement("div");\n        type.className = "type";\n        type.id = "info";\n        type.innerHTML = data[i].IsDir;\n        const name = document.createElement("div");\n        name.className = "name";\n        name.id = "info";\n        name.innerHTML = data[i].Name;\n        const size = document.createElement("div");\n        size.className = "size";\n        size.id = "info";\n        size.innerHTML = data[i].Size;\n        fileInfo.appendChild(type);\n        fileInfo.appendChild(name);\n        fileInfo.appendChild(size);\n        fileInfos.appendChild(fileInfo);\n        if (container != null) {\n            container.appendChild(fileInfos);\n        }\n        if (data[i].IsRoot) {\n            fileInfo.className = "root";\n            type.className = "rootType";\n            name.className = "rootName";\n            size.className = "rootSize";\n        }\n        fileInfo.addEventListener(\'click\', () => __awaiter(this, void 0, void 0, function* () {\n            yield (0,_controller__WEBPACK_IMPORTED_MODULE_0__.fileInfoClick)(fileInfo, basePath);\n        }));\n    }\n}\nfunction formatTime(nanoseconds) {\n    let time;\n    let unit;\n    if (nanoseconds < 1e3) {\n        time = nanoseconds;\n        unit = \'ns\';\n    }\n    if (nanoseconds < 1e6) {\n        time = nanoseconds / 1e3;\n        unit = \'μs\';\n    }\n    else if (nanoseconds < 1e9) {\n        time = nanoseconds / 1e6;\n        unit = \'ms\';\n    }\n    else {\n        time = nanoseconds / 1e9;\n        unit = \'s\';\n    }\n    return `${time.toFixed(2)} ${unit}`;\n}\n\n\n\n//# sourceURL=webpack://filescanner/./ts/view.ts?')}},__webpack_module_cache__={};function __webpack_require__(e){var n=__webpack_module_cache__[e];if(void 0!==n)return n.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.d=(e,n)=>{for(var t in n)__webpack_require__.o(n,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},__webpack_require__.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__=__webpack_require__("./ts/index.ts")})();