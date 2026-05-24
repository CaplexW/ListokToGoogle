export default async function getUserCalendars(accessToken) {
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
