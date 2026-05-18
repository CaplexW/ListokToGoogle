import asyncMap from './utils/asyncMap.js';
import fetchJSON from './utils/fetchJSON.js';
import getMondaysWithCurrentMonthDays from './utils/getMondaysWithCurrentMonthDays.js';
import declineName from './utils/declineName.js';
import normalizeSchedule from './utils/normolizeSchedule.js';
import convertScheduleToGoogleCSV from './utils/convertScheduleToGoogleCSV.js'
import addEventToGoogleCalendar from './utils/addEventToGoogleCalendar.js';

const URL = `https://an7452.listok.online/wapi/week/`;
const googleCalendarButton = document.querySelector('#download-button-google-calendar');
const importToGoogleCalendarButton = document.querySelector('#import-to-google-calendar-btn');
const trainerSelector = document.querySelector('#trainer-selector');
const officeSelector = document.querySelector('#office-selector');
const monthSelector = document.querySelector('#month-selector');

monthSelector.value = new Date().getMonth().toString();

googleCalendarButton.addEventListener('click', downloadSchedule);
async function downloadSchedule() {
  const eventList = await getEventList();

  const CSVString = convertScheduleToGoogleCSV(eventList);
  downloadCSV(CSVString);
  console.log(eventList);
}

importToGoogleCalendarButton.addEventListener('click', importToGoogleCalendar);
async function importToGoogleCalendar() {
  const eventExample = {
    summary: "Тестовое событие из ListOK2Google",
    start: {
      dateTime: "2026-05-20T10:00:00+07:00",
      timeZone: "Asia/Krasnoyarsk",
    },
    end: {
      dateTime: "2026-05-20T11:00:00+07:00",
      timeZone: "Asia/Krasnoyarsk",
    },
    description: "Событие, созданное через ListOK2Google",
  };
  const accessToken = localStorage.getItem("googleAccessToken");

  if (accessToken) {
    addEventToGoogleCalendar(accessToken, eventExample);
    
    alert('Importing schedule to your GoogleCalendar...');
  }
}

async function getEventList() {
  const trainer = trainerSelector.value;
  const selectedMonth = parseInt(monthSelector.value);
  const displayedMonth = selectedMonth + 1;
  const officeId = parseInt(officeSelector.value);

  const startPoints = getMondaysWithCurrentMonthDays(selectedMonth);
  const targetURLs = startPoints.map((point) => URL + point);
  const dateData = await asyncMap(targetURLs, (targetURL) => {
    return fetchJSON(targetURL, officeId);
  });
  const eventList = dateData.map((date) => date.events);

  const normolizedEvents = normalizeSchedule(eventList, trainer, displayedMonth);

  return normolizedEvents
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
