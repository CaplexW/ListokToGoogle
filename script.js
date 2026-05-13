const page = document.querySelector('.weekContainer');
const weekHead = page.querySelector('.weekHead');

const nextWeekButton = page.querySelector('.nextWeek');
const prevWeekButton = page.querySelector('.prevWeek');

const schedual = [];

const today = { day: new Date().getDate(), month: new Date().getMonth() + 1 };

let currentWeekDates = getCurrentWeekDates();
let startPointIsFound = false;
let endPointIsReached = false;
let currentOffice = 0;

const tickInterval = 100;

function getCurrentWeekDates() {
  return Array.from(weekHead.querySelectorAll('.weekColumn')).map(elem => elem.textContent).map((dateStr) => {
    const [day, month] = dateStr.split(' ')[1].split('.');
    return { day: parseInt(day), month: parseInt(month) };
  });
}
function findStartPoint() {
  if (!startPointIsFound) {
    console.info('Начинаю проверку новой недели...');

    const firstDayOfWeek = currentWeekDates[0];
    const lastDayOfWeek = currentWeekDates[currentWeekDates.length - 1];

    const weekStartsInThisMonth = today.month === firstDayOfWeek.month;
    const weekStartsInNextMonth = today.month < firstDayOfWeek.month;
    const weekStartsInPrevMonth = today.month > firstDayOfWeek.month;
    const weekEndsInPrevMonth = today.month > lastDayOfWeek.month;

    if (weekStartsInNextMonth) {

      console.info('Неделя начинается в следующем месяце.');
      console.info('Проверяю предыдущую неделю...');

      prevWeekButton.click();
      setTimeout(() => {
        currentWeekDates = getCurrentWeekDates();
        console.log(`current week dates are:`, currentWeekDates);
        findStartPoint();
      }, tickInterval);
      console.log('subCond-1');
      console.log(today.month > currentWeekDates[currentWeekDates.length - 1].month);
      console.log('subCond-2');
      console.log(currentWeekDates.some((date) => date.day === 1));
    } else if (weekEndsInPrevMonth) {

      console.info('Неделя заканчивается в прошлом месяце.');
      console.info('Проверяю следующую неделю...');

      nextWeekButton.click();
      setTimeout(() => {
        currentWeekDates = getCurrentWeekDates();
        findStartPoint();
      }, tickInterval);
    } else if (weekStartsInThisMonth) {

      console.info('Неделя начинается в текущем месяце.');
      console.info('Проверяю наличие 1-го дня текущего месяца...');

      if (currentWeekDates.some((date) => date.day === 1)) {
        console.info('Начало текущего месяца найдено!');
        console.info('Начинаю поиск последней недели текущего месяца...');

        startPointIsFound = true;
        startToTheEndPoint();
      } else {

        console.info('Текущий месяц начинается не на этой неделе.');
        console.info('Проверяю предыдущую неделю...');

        prevWeekButton.click();
        setTimeout(() => {
          currentWeekDates = getCurrentWeekDates();
          findStartPoint();
        }, tickInterval);
      }
    } else if (weekStartsInPrevMonth) {

      console.info('Неделя начинается в прошлом месяце.');
      console.info('Проверяю наличие 1-го дня текущего месяца...');

      if (currentWeekDates.some((date) => date.day === 1 && date.month === today.month)) {
        console.info('Начало текущего месяца найдено!');
        console.info('Начинаю поиск последней недели текущего месяца...');

        startPointIsFound = true;
        startToTheEndPoint();
      } else {
        console.info('Текущий месяц начинается не на этой неделе.');
        console.info('Проверяю следующую неделю...');

        nextWeekButton.click();
        setTimeout(() => {
          currentWeekDates = getCurrentWeekDates();
          findStartPoint();
        }, tickInterval);
      }
    } else {
      console.error('Ни одно из проверяемых условий не соотвутвует нынешнему состоянию');

      showElement(weekStartsInNextMonth, 'неделя начинается в следующем месяце');
      showElement(weekStartsInThisMonth, 'неделя начинается в текущем месяце');
      showElement(weekStartsInPrevMonth, 'неделя начинается в прошлом месяце');
      showElement(weekEndsInPrevMonth, 'неделя заканчивается в прошлом месяце');

      showElement(today.month, 'Текущий месяц');
      showElement(firstDayOfWeek, 'Первый день недели');
      showElement(lastDayOfWeek, 'Послдений день недели');
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
      if (currentWeekDates[0].month > today.month || currentWeekDates[0].month === 1) {
        endPointIsReached = true;
        console.log('operation is done!');
        console.log(schedual)
        const csvResult = convertToGoogleCalendarCSV(schedual);

        console.log(csvResult);
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const office = currentOffice ? "в Невском" : "на Ленина";
        const fileName = `График за ${month}.${year} ${office}`;
        downloadCSV(csvResult, fileName);
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
          day: day.length > 1 ? day : `0${day}`,
          month: month.length > 1 ? month : `0${month}`,
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
function convertToGoogleCalendarCSV(month) {
  const csvRows = new Set();

  const headers = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private';
  csvRows.add(headers);

  for (const week of month) {

    week.forEach((day) => {
      const date = day.date;
      const startDate = `${date.day}/${date.month}/${date.year}`;
      const endDate = `${date.day}/${date.month}/${date.year}`;

      day.trainings.forEach((event) => {
        const startTime = event.eventTime.start;
        const endTime = event.eventTime.end;

        const values = [
          `"${event.name}"`, // Subject
          startDate,         // Start Date
          startTime,         // Start Time
          endDate,           // End Date
          endTime,           // End Time
          'FALSE',           // All Day Event
          '""',              // Description (пустое)
          '""',              // Location (пустое)
          'FALSE'            // Private
        ];

        csvRows.add(values.join(','));
      });
    })

  }
  console.log(csvRows);

  return Array.from(csvRows).join('\n');
}
function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(`download`, fileName + ".csv");

  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function startProgramm() { console.info('Начинаю поиск первой недели текущего месяца...'); findStartPoint() };

startProgramm();



function showElement(element, name) {
  console.log(name, element);
}
