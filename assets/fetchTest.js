fetch('https://an7452.listok.online/wapi#filtered/%7B%22employee%22:%5B2732%5D%7D')
  .then(response => response.text())
  .then(html => console.log('HTML получен:', html.substring(0, 200) + '...'))
  .catch(error => console.error('Ошибка CORS:', error));