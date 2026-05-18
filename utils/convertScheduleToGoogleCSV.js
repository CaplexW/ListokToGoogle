export default function convertScheduleToGoogleCSV(normalizedEvents) {
  const header = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private';

  const rows = normalizedEvents.map(event => {
    const startDate = `${event.date}`;
    const endDate = `${event.date}`;

    return [
      `"${event.name}"`,
      startDate,
      event.startTime,
      endDate,
      event.endTime,
      'FALSE',
      '""',
      '""',
      'FALSE'
    ].join(',');
  });

  return [header, ...rows].join('\n');
}
