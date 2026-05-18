export default function normalizeSchedule(data, trainer, thisMonth) {
  const result = [];

  for (const timeSlotObj of data) {

    for (const time in timeSlotObj) {
      const datesObj = timeSlotObj[time];

      for (const dateStr in datesObj) {
        const eventArray = datesObj[dateStr];
        const event = eventArray[0];
        const [year, month, day] = dateStr.split('-').map(Number);

        if (!event) continue;
        if (month !== thisMonth) continue;
        if (event.teacherName !== trainer) continue;



        result.push({
          date: `${day}/${month}/${year}`,
          name: event.groupName,
          startTime: time,
          endTime: event.endTime,
        });
      }
    }
  }

  return result;
}