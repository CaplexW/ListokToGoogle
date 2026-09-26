export default function normalizeSchedule(weekList, trainer, thisMonth, roomid) {
  const result = [];
  for (const weekTimes of weekList) {
    for (const timeSlot in weekTimes) {
      const daysInTimeSlot = weekTimes[timeSlot];
      for (const dateStr in daysInTimeSlot) {

        const eventArray = daysInTimeSlot[dateStr];
        const [year, month, day] = dateStr.split('-').map(Number);

        const event = eventArray[0];
        if (month !== thisMonth) continue;
        if (!event) continue;


        eventArray.forEach((event) => {
          if (event.teacherName !== trainer) return;
          if (event.roomId !== roomid) return;

          result.push({
            date: `${day}/${month}/${year}`,
            name: event.groupName,
            startTime: timeSlot,
            endTime: event.endTime,
            roomName: event.roomName,
          });
        });
      }
    }
  }

  return result;
}