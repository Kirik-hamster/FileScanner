// Функция для отправки AJAX-запроса
function getFilesData() {
    const xhr = new XMLHttpRequest();
    const url = window.location.href;
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(jsonData);
            // Обработка полученных данных JSON

            console.log(data)
        }
    };
    xhr.send();
}

// Вызов функции для получения данных
getFilesData();