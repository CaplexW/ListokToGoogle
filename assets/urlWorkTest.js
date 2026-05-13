const targetUrl = 'https://an7452.listok.online/wapi';
const weekUrl = 'https://an7452.listok.online/wapi/week/27-04-2026';
const targetResponse = fetch(targetUrl);
const weekResponse = fetch(weekUrl);

const iframe = document.createElement('iframe');
iframe.src = 'https://an7452.listok.online/wapi';
iframe.style.display = 'none';
document.body.appendChild(iframe);

iframe.onload = () => {
  console.log('Iframe загружен');
  try {
    console.log('Doctype:', iframe.contentDocument.doctype);
    console.log('Title:', iframe.contentDocument.title);
    console.log('Можно работать с DOM iframe!');
  } catch (e) {
    console.error('Ошибка доступа к DOM iframe:', e.message);
  }
};

iframe.onerror = () => {
  console.error('Iframe не загружен из-за CORS или другой ошибки');
};
