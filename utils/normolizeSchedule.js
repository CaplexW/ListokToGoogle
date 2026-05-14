function normalizeSchedule(data, trainer = null) {
    const result = [];

    // Проходим по всем временным слотам (09:00, 10:00 и т.д.)
    for (const time in data) {
        const datesObj = data[time];

        // Проходим по всем датам в временном слоте
        for (const dateStr in datesObj) {
            const [event] = datesObj[dateStr]; // Берем первый (и единственный) элемент массива

            // Фильтрация по тренеру, если передан аргумент
            if (trainer !== null && event.teacherName !== trainer) {
                continue;
            }

            // Разбиваем строку даты на год, месяц, день
            const [year, month, day] = dateStr.split('-').map(Number);

            // Добавляем нормализованный объект в результат
            result.push({
                date: { year, month, day },
                gptName: event.gptName,
                startTime: event.startTime,
                endTime: event.endTime,
            });
        }
    }

    return result;
}
