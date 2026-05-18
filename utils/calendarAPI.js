/**
 * Получает список календарей пользователя.
 * @param {string} accessToken - Токен доступа Google OAuth.
 * @returns {Promise<Array>} - Список календарей.
 */
export async function getUserCalendars(accessToken) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Ошибка при получении списка календарей:", error);
    return [];
  }
}

/**
 * Добавляет событие в выбранный календарь.
 * @param {string} accessToken - Токен доступа Google OAuth.
 * @param {string} calendarId - ID календаря.
 * @param {Object} event - Объект события.
 * @returns {Promise<Object>} - Ответ от API.
 */
export async function addEventToCalendar(accessToken, calendarId, event) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка при добавлении события:", error);
    throw error;
  }
}