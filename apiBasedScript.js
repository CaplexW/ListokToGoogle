// import asyncMap from "./utils/asyncMap";
// import fetchJSON from "./utils/fetchJSON";
// import getMondaysWithCurrentMonthDays from "./utils/getMondaysWithCurrentMonthDays";

const URL = `https://an7452.listok.online/wapi/week/`;
const mainButton = document.querySelector('#generate-button');

mainButton.addEventListener('click', downloadSchedule);

async function getEventList() {
  const startPoints = getMondaysWithCurrentMonthDays();
  const targetURLs = startPoints.map((point) => URL + point);
  const dateData = await asyncMap(targetURLs, fetchJSON);
  const eventList = dateData.map((date) => date.events);

  return eventList
}

async function downloadSchedule() {
  const eventList = await getEventList();

  console.log(eventList);
}


function getMondaysWithCurrentMonthDays() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

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
    try {
        const response = await fetch(url);

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

