// import asyncMap from "./utils/asyncMap";
// import fetchJSON from "./utils/fetchJSON";
// import getMondaysWithCurrentMonthDays from "./utils/getMondaysWithCurrentMonthDays";

const URL = `https://an7452.listok.online/wapi/week/`;
const googleCalendarButton = document.querySelector('#download-button-google-calendar');
const trainerSelector = document.querySelector('#trainer-selector');
const officeSelector = document.querySelector('#office-selector');
const monthSelector = document.querySelector('#month-selector');

monthSelector.value = new Date().getMonth().toString();

googleCalendarButton.addEventListener('click', downloadSchedule);

async function getEventList() {
  const startPoints = getMondaysWithCurrentMonthDays();
  const targetURLs = startPoints.map((point) => URL + point);
  const dateData = await asyncMap(targetURLs, fetchJSON);
  const eventList = dateData.map((date) => date.events);
  const trainer = trainerSelector.value;

  const normolizedEvents = normalizeSchedule(eventList)

  return normolizedEvents
}
async function downloadSchedule() {
  const eventList = await getEventList();

  const CSVString = normalizeScheduleToCSV(eventList);
  downloadCSV(CSVString);
  console.log(eventList);
}
function getMondaysWithCurrentMonthDays() {
  const now = new Date();
  const year = now.getFullYear();
  const month = parseInt(monthSelector.value);

  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysToSubtractForFirst = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const firstMonday = new Date(year, month, 1 - daysToSubtractForFirst);

  const lastDayOfMonth = new Date(year, month + 1, 0);

  const lastDayOfWeek = lastDayOfMonth.getDay();
  const daysToSubtractForLast = lastDayOfWeek === 0 ? 6 : lastDayOfWeek - 1;
  const lastMonday = new Date(year, month + 1, 0 - daysToSubtractForLast);

  const mondays = [];
  const currentMonday = new Date(firstMonday);

  while (currentMonday <= lastMonday) {
    mondays.push(new Date(currentMonday));
    currentMonday.setDate(currentMonday.getDate() + 7);
  }

  return mondays.map(date => {
    const day = String(date.getDate()).padStart(2, '0');
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const yearStr = date.getFullYear();
    return `${day}-${monthStr}-${yearStr}`;
  });
}
async function fetchJSON(url) {
  const officeId = parseInt(officeSelector.value)
  const payload = {
    officeId: officeId,
    currentContactId: 0
  };

  try {
    const response = await fetch(url, {
      method: 'POST', // или 'GET', если сервер ожидает GET с body (редко, но возможно)
      headers: {
        'Content-Type': 'application/json', // Указываем, что отправляем JSON
      },
      body: JSON.stringify(payload) // Преобразуем объект в JSON-строку
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    throw error;
  }
}
async function asyncMap(array, asyncFn) {
  const promises = array.map(item => asyncFn(item));
  return Promise.all(promises);
}
function normalizeSchedule(data) {
  const result = [];
  const trainer = trainerSelector.value;
  const thisMonth = parseInt(monthSelector.value) + 1;

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
function normalizeScheduleToCSV(normalizedEvents) {
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
function downloadCSV(csvString) {
  const today = new Date();
  const thisMonth = parseInt(monthSelector.value) + 1;
  const thisYear = today.getFullYear();
  const currentOffice = parseInt(officeSelector.value) ? "в Невском" : "на Ленина";
  const trainerName = declineName(trainerSelector.value);

  const fileName = `График ${trainerName} на ${thisMonth > 9 ? thisMonth : "0" + thisMonth}.${thisYear} ${currentOffice}.csv`;
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 100);
}
function declineName(name) {
  const nameArr = name.split('');
  nameArr[nameArr.length - 1] = 'ы';
  const declinedName = nameArr.join('');

  return declinedName;
}

function showElement(name, element) {
  console.log(element, name);
}
