const url = 'https://an7452.listok.online/wapi/week/27-04-2026';
const fileName = 'week_data.js'; // Имя файла

fetch(url)
  .then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then(data => {
    // Формируем JS-код: экспортируем объект как модуль
    const jsContent = `const weekData = ${JSON.stringify(data, null, 2)};\n\nexport default weekData;`;

    // Создаём и скачиваем файл
    const blob = new Blob([jsContent], { type: 'text/javascript' });
    const urlBlob = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = urlBlob;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Очищаем
    document.body.removeChild(link);
    URL.revokeObjectURL(urlBlob);
  })
  .catch(error => console.error('Ошибка:', error));
  