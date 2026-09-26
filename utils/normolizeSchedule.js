export default function normalizeSchedule(data, trainer, thisMonth) {
  const result = [];

  for (const timeSlotObj of data) {

    for (const time in timeSlotObj) {
      const datesObj = timeSlotObj[time];
      for (const dateStr in datesObj) {
        const eventArray = datesObj[dateStr];
        const [year, month, day] = dateStr.split('-').map(Number);

        const event = eventArray[0];
        if (month !== thisMonth) continue;
        if (!event) continue;


        eventArray.forEach((event) => {
          if (event.teacherName !== trainer) return;

          result.push({
          date: `${day}/${month}/${year}`,
          name: event.groupName,
          startTime: time,
          endTime: event.endTime,
        });
        });
      }
    }
  }

  return result;
}