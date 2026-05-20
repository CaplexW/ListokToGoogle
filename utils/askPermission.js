export default async function askPermission(message) {
  return new Promise((resolve) => {
    // Создаём элементы модального окна
    const overlay = document.createElement('div');
    overlay.className = 'custom-confirm-overlay';

    const confirmBox = document.createElement('div');
    confirmBox.className = 'custom-confirm';

    const confirmMessage = document.createElement('p');
    confirmMessage.textContent = message;

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Да';
    yesButton.className = 'custom-confirm-button';

    const noButton = document.createElement('button');
    noButton.textContent = 'Нет';
    noButton.className = 'custom-confirm-button';

    // Добавляем элементы в DOM
    confirmBox.appendChild(confirmMessage);
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.width = '100%';
    buttonContainer.appendChild(noButton);
    buttonContainer.appendChild(yesButton);
    confirmBox.appendChild(buttonContainer);
    overlay.appendChild(confirmBox);
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

    confirmBox.style.backgroundColor = 'white';
    confirmBox.style.padding = '20px';
    confirmBox.style.borderRadius = '8px';
    confirmBox.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    confirmBox.style.maxWidth = '400px';
    confirmBox.style.width = '80%';

    confirmMessage.style.margin = '0 0 20px';
    confirmMessage.style.textAlign = 'center';

    yesButton.style.padding = '8px 16px';
    yesButton.style.backgroundColor = '#4285f4';
    yesButton.style.color = 'white';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '4px';
    yesButton.style.cursor = 'pointer';

    noButton.style.padding = '8px 16px';
    noButton.style.backgroundColor = '#f44336';
    noButton.style.color = 'white';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '4px';
    noButton.style.cursor = 'pointer';

    // Обработчики для кнопок
    yesButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(true);
    });

    noButton.addEventListener('click', () => {
      document.body.removeChild(overlay);
      resolve(false);
    });
  });
}
