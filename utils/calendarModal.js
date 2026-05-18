import { getUserCalendars } from "./calendarAPI.js";

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

    document.getElementById("confirm-calendar-selection").onclick = () => {
      const selectedCalendarId = selector.value;
      modal.style.display = "none";
      const confirmed = confirm(`Вы собираетесь импортировать график в календаро "${calendars[0].summary}". Импортировать? `)
      if (confirmed) resolve(selectedCalendarId);
    };

    document.getElementById("cancel-calendar-selection").onclick = () => {
      modal.style.display = "none";
      resolve(null);
    };
  });
}