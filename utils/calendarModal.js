import askPermission from "./askPermission.js";
import getUserCalendars from "./calendarAPI.js";
import declineName from "./declineName.js";
import showMessage from "./showMessage.js";

/**
 * Отображает модальное окно с селектором календарей.
 * @param {string} accessToken - Токен доступа Google OAuth.
 * @returns {Promise<string>} - ID выбранного календаря.
 */
export default async function showCalendarSelector(accessToken) {
  return new Promise(async (resolve) => {
    const calendars = await getUserCalendars(accessToken);
    const modal = document.getElementById("calendar-modal");
    const selector = document.getElementById("calendar-selector");
    selector.innerHTML = "";

    calendars.forEach(calendar => {
      const option = document.createElement("option");
      option.value = calendar.id;
      option.textContent = calendar.summary;
      selector.appendChild(option);
    });

    modal.style.display = "block";

    document.getElementById("confirm-calendar-selection").onclick = async () => {
      const selectedCalendarId = selector.value;
      modal.style.display = "none";
      const calendarSelector = document.querySelector('#calendar-selector');
      const trainerSelector = document.querySelector('#trainer-selector');
      const monthSelector = document.querySelector('#month-selector');
      const officeSelector = document.querySelector('#office-selector');

      const officeName = parseInt(officeSelector.value) ? 'в Невском' : 'на Ленина';
      const selectedMonth = monthSelector.options[monthSelector.selectedIndex].textContent;
      const calendarName = calendarSelector.options[calendarSelector.selectedIndex].textContent;
      const trainerName = declineName(trainerSelector.options[trainerSelector.selectedIndex].textContent);

      const confirmed = await askPermission(`Вы собираетесь импортировать график ${trainerName} ${officeName} за ${selectedMonth} в календарь "${calendarName}". Импортировать? `)
      if (confirmed) {
        resolve(selectedCalendarId);
      } else {
        showMessage('Импорт отменен!');
      }
    };

    document.getElementById("cancel-calendar-selection").onclick = () => {
      modal.style.display = "none";
      resolve(null);
    };
  });
}
