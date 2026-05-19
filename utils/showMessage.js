export default function showMessage(message) {
  // Создаём элементы модального окна
  const overlay = document.createElement('div');
  overlay.className = 'custom-alert-overlay';

  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';

  const alertMessage = document.createElement('p');
  alertMessage.textContent = message;

  const okButton = document.createElement('button');
  okButton.textContent = 'Ок';
  okButton.className = 'custom-alert-button';

  // Добавляем элементы в DOM
  alertBox.appendChild(alertMessage);
  alertBox.appendChild(okButton);
  overlay.appendChild(alertBox);
  document.body.appendChild(overlay);

  // Добавляем стили для модального окна
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  alertBox.style.backgroundColor = 'white';
  alertBox.style.padding = '20px';
  alertBox.style.borderRadius = '8px';
  alertBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  alertBox.style.maxWidth = '400px';
  alertBox.style.width = '80%';

  alertMessage.style.margin = '0 0 20px';
  alertMessage.style.textAlign = 'center';

  okButton.style.padding = '8px 16px';
  okButton.style.backgroundColor = '#4285f4';
  okButton.style.color = 'white';
  okButton.style.border = 'none';
  okButton.style.borderRadius = '4px';
  okButton.style.cursor = 'pointer';

  // Выравнивание кнопки по правому краю
  alertBox.style.display = 'flex';
  alertBox.style.flexDirection = 'column';
  alertBox.style.alignItems = 'center';
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'flex-end';
  buttonContainer.style.width = '100%';
  buttonContainer.appendChild(okButton);
  alertBox.appendChild(buttonContainer);

  // Добавляем обработчик для кнопки "Ок"
  okButton.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}