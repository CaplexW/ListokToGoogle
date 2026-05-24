function formatDateToISO(dateStr) {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export default async function importNormalizedEvents(calendarId, normolizedEvents) {
  if (!window.gapi?.client?.calendar) {
    throw new Error("gapi.client.calendar не инициализирован. Проверьте загрузку gapi.client.");
  }

  // Создаём пакетный запрос через gapi.client.newBatch()
  const batch = gapi.client.newBatch();

  normolizedEvents.forEach(event => {
    const formattedDate = formatDateToISO(event.date);
    const googleEvent = {
      summary: event.name,
      start: {
        dateTime: `${formattedDate}T${event.startTime.padStart(5, '0')}:00+07:00`,
      },
      end: {
        dateTime: `${formattedDate}T${event.endTime.padStart(5, '0')}:00+07:00`,
      },
    };

    // Добавляем запрос на добавление события в пакет
    batch.add(
      gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: googleEvent,
      })
    );
  });

  try {
    // Выполняем все запросы из пакета
    const results = await batch.execute();
    return results;
  } catch (error) {
    console.error("Ошибка при пакетном импорте:", error);
    throw error;
  }
}