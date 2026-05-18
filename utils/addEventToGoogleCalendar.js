export default async function addEventToGoogleCalendar(accessToken, event) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
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
    const result = await response.json();
    console.log("Событие создано:", result);
    return result;
  } catch (error) {
    console.error("Ошибка при добавлении события:", error);
    alert(`Ошибка: ${error.message}`);
  }
}