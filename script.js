const page = document.querySelector('.weekContainer');
const weekHead = page.querySelector('.weekHead');

const nextWeekButton = page.querySelector('.nextWeek');
const prevWeekButton = page.querySelector('.prevWeek');

const schedual = [];

const thisDate = { day: new Date().getDate(), month: new Date().getMonth() + 1 };

let currentWeekDates = getCurrentWeekDates();
let startPointIsFound = false;
let endPointIsReached = false;
let currentOffice = 1;

const tickInterval = 100;

function getCurrentWeekDates() {
  return Array.from(weekHead.querySelectorAll('.weekColumn')).map(elem => elem.textContent).map((dateStr) => {
    const [day, month] = dateStr.split(' ')[1].split('.');
    return { day: parseInt(day), month: parseInt(month) };
  });
}
function findStartPoint() {
  if (!startPointIsFound) {
    if (thisDate.month < currentWeekDates[0].month) {
      prevWeekButton.click();
      setTimeout(() => {
        currentWeekDates = getCurrentWeekDates();
        console.log(`current week dates are:`, currentWeekDates);
        findStartPoint();
      }, tickInterval);
    } else if (thisDate.month > currentWeekDates[currentWeekDates.length - 1].month) {
      nextWeekButton.click();
      setTimeout(() => {
        currentWeekDates = getCurrentWeekDates();
        console.log(`current week dates are:`, currentWeekDates);
        findStartPoint();
      }, tickInterval);
    } else if (thisDate.month === currentWeekDates[0].month) {
      if (currentWeekDates.some((date) => date.day === 1)) {
        startPointIsFound = true;
        console.log(`current week dates are:`, currentWeekDates);
        console.log(`this date is:`, thisDate);
        console.log(`start point is found:`, startPointIsFound);
        startToTheEndPoint();
      } else {
        prevWeekButton.click();
        setTimeout(() => {
          currentWeekDates = getCurrentWeekDates();
          console.log(`current week dates are:`, currentWeekDates);
          findStartPoint();
        }, tickInterval);
      }
    }
  }
}
function startToTheEndPoint() {
  if (!endPointIsReached) {
    const weekResult = parseWeek();
    schedual.push(weekResult);
    nextWeekButton.click();

    setTimeout(() => {
      currentWeekDates = getCurrentWeekDates();
      if (currentWeekDates[0].month > thisDate.month || currentWeekDates[0].month === 1) {
        endPointIsReached = true;
        console.log('operation is done!');
        console.log(schedual)
      } else {
        startToTheEndPoint();
      }
    }, tickInterval)
  }
}
function parseWeek() {
  const week = document.querySelector('.weekContainer');
  const weekHead = week?.querySelector('.weekHead');
  const weekDays = weekHead ? Array.from(weekHead.querySelectorAll('.weekColumn')) : [];
  const nextButton = weekHead?.querySelector('.nextWeek');
  const prevButton = weekHead?.querySelector('.prevWeek');
  const weekBody = week?.querySelector('.weekBody')?.querySelectorAll('.weekColumn');

  if (!weekHead || weekDays.length === 0 || !weekBody || !nextButton || !prevButton) {
    return [];
  }

  const widths = weekDays.map(day => day.offsetWidth);
  const uniqueWidths = [...new Set(widths)];

  if (uniqueWidths.length === 1) {
    return [];
  }

  const maxWidth = Math.max(...uniqueWidths);

  const busyDays = weekDays.reduce((acc, dayElem, index) => {
    if (dayElem.offsetWidth === maxWidth) {
      const dayText = dayElem.textContent;
      const [dayOfWeek, date] = dayText ? dayText.split(' ') : [];
      const [day, month] = date ? date.split('.') : [];
      const dayBlocks = weekBody[index].querySelectorAll('.dayBlock');
      const trainingsData = getSubElementsFromNodeList(dayBlocks, '.minimizeHover');

      const trainings = trainingsData.map(training => {
        const time = training.querySelector('.timePeriod')?.textContent;
        const [start, end] = time ? time.split(' – ') : [];
        const name = training.querySelector('.eventName')?.textContent;

        return {
          eventTime: {
            start,
            end,
          },
          name,
        };
      });

      const busyDay = {
        date: {
          dayOfWeek,
          day: day ? parseInt(day) : NaN,
          month: month ? parseInt(month) : NaN,
          year: new Date().getFullYear(),
        },
        trainings,
      };

      acc.push(busyDay);
    }
    return acc;
  }, []);

  return busyDays;
}
function getSubElementsFromNodeList(nodeList, elementSelector) {
  const subElements = [];
  nodeList.forEach(elem => {
    const subElem = elem.querySelector(elementSelector);
    if (subElem) subElements.push(subElem);
  });

  return subElements;
}
function startProgramm() { findStartPoint() };

startProgramm();