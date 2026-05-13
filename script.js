const page = document.querySelector('.weekContainer');
const currentOffice = parseInt(document.querySelector('.inlineSelect').value);
const weekHead = page.querySelector('.weekHead');
const nextWeekButton = page.querySelector('.nextWeek');
const prevWeekButton = page.querySelector('.prevWeek');

const schedule = [];
const today = { day: new Date().getDate(), month: new Date().getMonth() + 1 };
let currentWeekDates = getCurrentWeekDates();
let startPointIsFound = false;
let endPointIsReached = false;
const tickInterval = 300;

const MESSAGES = {
  START_SEARCH: 'Начинаю поиск первой недели текущего месяца...',
  CHECK_NEW_WEEK: 'Начинаю проверку новой недели...',
  WEEK_STARTS_NEXT_MONTH: 'Неделя начинается в следующем месяце.',
  CHECK_PREV_WEEK: 'Проверяю предыдущую неделю...',
  WEEK_ENDS_PREV_MONTH: 'Неделя заканчивается в прошлом месяце.',
  CHECK_NEXT_WEEK: 'Проверяю следующую неделю...',
  WEEK_STARTS_THIS_MONTH: 'Неделя начинается в текущем месяце.',
  CHECK_FIRST_DAY: 'Проверяю наличие 1-го дня текущего месяца...',
  START_FOUND: 'Начало текущего месяца найдено!',
  START_SEARCH_END: 'Начинаю поиск последней недели текущего месяца...',
  MONTH_STARTS_NOT_THIS_WEEK: 'Текущий месяц начинается не на этой неделе.',
  WEEK_STARTS_PREV_MONTH: 'Неделя начинается в прошлом месяце.',
  OPERATION_DONE: 'Операция завершена!',
  START_POINT_ERROR: 'Первая неделя текущего месяца найдена, но по какой-то причине программа всё равно запустила функцию findStartPoint',
  END_POINT_ERROR: 'Конец месяца уже достигнут, но функция startToTheEndPoint была вызвана повторно',
  NO_CONDITION_MATCH: 'Ни одно из проверяемых условий не соответствует нынешнему состоянию',
};

function getCurrentWeekDates() {
  return Array.from(weekHead.querySelectorAll('.weekColumn'))
    .map(elem => elem.textContent)
    .map(dateStr => {
      const [, date] = dateStr.split(' ');
      const [day, month] = date.split('.');
      return { day: parseInt(day), month: parseInt(month) };
    });
}

function navigateWeek(direction, callback) {
  const button = direction === 'next' ? nextWeekButton : prevWeekButton;
  button.click();
  setTimeout(() => {
    currentWeekDates = getCurrentWeekDates();
    callback();
  }, tickInterval);
}

function checkWeekConditions() {
  const firstDayOfWeek = currentWeekDates[0];
  const lastDayOfWeek = currentWeekDates[currentWeekDates.length - 1];

  const weekStartsInThisMonth = today.month === firstDayOfWeek.month;
  const weekStartsInNextMonth = today.month < firstDayOfWeek.month;
  const weekStartsInPrevMonth = today.month > firstDayOfWeek.month;
  const weekEndsInPrevMonth = today.month > lastDayOfWeek.month;

  return {
    weekStartsInThisMonth,
    weekStartsInNextMonth,
    weekStartsInPrevMonth,
    weekEndsInPrevMonth,
    firstDayOfWeek,
    lastDayOfWeek
  };
}

function findStartPoint() {
  if (startPointIsFound) {
    console.error(MESSAGES.START_POINT_ERROR);
    return;
  }

  console.info(MESSAGES.CHECK_NEW_WEEK);
  const {
    weekStartsInThisMonth,
    weekStartsInNextMonth,
    weekStartsInPrevMonth,
    weekEndsInPrevMonth,
  } = checkWeekConditions();

  if (weekStartsInNextMonth) {
    console.info(MESSAGES.WEEK_STARTS_NEXT_MONTH);
    console.info(MESSAGES.CHECK_PREV_WEEK);
    navigateWeek('prev', findStartPoint);
  }
  else if (weekEndsInPrevMonth) {
    console.info(MESSAGES.WEEK_ENDS_PREV_MONTH);
    console.info(MESSAGES.CHECK_NEXT_WEEK);
    navigateWeek('next', findStartPoint);
  }
  else if (weekStartsInThisMonth) {
    console.info(MESSAGES.WEEK_STARTS_THIS_MONTH);
    console.info(MESSAGES.CHECK_FIRST_DAY);
    if (currentWeekDates.some(date => date.day === 1)) {
      console.info(MESSAGES.START_FOUND);
      console.info(MESSAGES.START_SEARCH_END);
      startPointIsFound = true;
      startToTheEndPoint();
    } else {
      console.info(MESSAGES.MONTH_STARTS_NOT_THIS_WEEK);
      console.info(MESSAGES.CHECK_PREV_WEEK);
      navigateWeek('prev', findStartPoint);
    }
  }
  else if (weekStartsInPrevMonth) {
    console.info(MESSAGES.WEEK_STARTS_PREV_MONTH);
    console.info(MESSAGES.CHECK_FIRST_DAY);
    if (currentWeekDates.some(date => date.day === 1 && date.month === today.month)) {
      console.info(MESSAGES.START_FOUND);
      console.info(MESSAGES.START_SEARCH_END);
      startPointIsFound = true;
      startToTheEndPoint();
    } else {
      console.info(MESSAGES.MONTH_STARTS_NOT_THIS_WEEK);
      console.info(MESSAGES.CHECK_NEXT_WEEK);
      navigateWeek('next', findStartPoint);
    }
  }
  else {
    console.error(MESSAGES.NO_CONDITION_MATCH);
    showElement(weekStartsInNextMonth, 'неделя начинается в следующем месяце');
    showElement(weekStartsInThisMonth, 'неделя начинается в текущем месяце');
    showElement(weekStartsInPrevMonth, 'неделя начинается в прошлом месяце');
    showElement(weekEndsInPrevMonth, 'неделя заканчивается в прошлом месяце');
    showElement(today.month, 'Текущий месяц');
    showElement(firstDayOfWeek, 'Первый день недели');
    showElement(lastDayOfWeek, 'Последний день недели');
  }
}

function startToTheEndPoint() {
  if (endPointIsReached) {
    console.error(MESSAGES.END_POINT_ERROR);
    return;
  }

  const weekResult = parseWeek();
  schedule.push(weekResult);
  nextWeekButton.click();

  setTimeout(() => {
    currentWeekDates = getCurrentWeekDates();
    if (currentWeekDates[0].month > today.month || currentWeekDates[0].month === 1) {
      endPointIsReached = true;
      console.info(MESSAGES.OPERATION_DONE);
      console.info('Обработано ', schedule.length, ' недель:');
      console.info(schedule);
      const csvResult = convertToGoogleCalendarCSV(schedule);
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const office = currentOffice ? "в Невском" : "на Ленина";
      const fileName = `График за ${month}.${year} ${office}`;
      downloadCSV(csvResult, fileName);
    } else {
      startToTheEndPoint();
    }
  }, tickInterval);
}

function parseWeek() {
  const week = document.querySelector('.weekContainer');
  const weekHead = week?.querySelector('.weekHead');
  const weekDays = weekHead ? Array.from(weekHead.querySelectorAll('.weekColumn')) : [];
  const weekBody = week?.querySelector('.weekBody')?.querySelectorAll('.weekColumn');

  if (!weekHead || weekDays.length === 0 || !weekBody) {
    return [];
  }

  const widths = weekDays.map(day => day.offsetWidth);
  const uniqueWidths = [...new Set(widths)];
  if (uniqueWidths.length === 1) return [];

  const maxWidth = Math.max(...uniqueWidths);

  return weekDays.reduce((acc, dayElem, index) => {
    if (dayElem.offsetWidth === maxWidth) {
      const [dayOfWeek, date] = dayElem.textContent?.split(' ') || [];
      const [day, month] = date?.split('.') || [];
      const dayBlocks = weekBody[index].querySelectorAll('.dayBlock');
      const trainingsData = getSubElementsFromNodeList(dayBlocks, '.minimizeHover');

      const trainings = trainingsData.map(training => {
        const time = training.querySelector('.timePeriod')?.textContent;
        const [start, end] = time?.split(' – ') || [];
        const name = training.querySelector('.eventName')?.textContent;
        return { eventTime: { start, end }, name };
      });

      acc.push({
        date: {
          dayOfWeek,
          day: day.padStart(2, '0'),
          month: month.padStart(2, '0'),
          year: new Date().getFullYear(),
        },
        trainings,
      });
    }
    return acc;
  }, []);
}

function getSubElementsFromNodeList(nodeList, elementSelector) {
  return Array.from(nodeList)
    .map(elem => elem.querySelector(elementSelector))
    .filter(Boolean);
}

function convertToGoogleCalendarCSV(month) {
  const csvRows = new Set();
  const headers = 'Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private';
  csvRows.add(headers);

  month.forEach(week => {
    week.forEach(day => {
      const { day: d, month: m, year } = day.date;
      const startDate = `${d}/${m}/${year}`;
      const endDate = `${d}/${m}/${year}`;

      day.trainings.forEach(event => {
        const { start: startTime, end: endTime } = event.eventTime;
        const values = [
          `"${event.name}"`,
          startDate,
          startTime,
          endDate,
          endTime,
          'FALSE',
          '""',
          '""',
          'FALSE'
        ];
        csvRows.add(values.join(','));
      });
    });
  });

  return Array.from(csvRows).join('\n');
}

function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function startProgramm() {
  console.info(MESSAGES.START_SEARCH);
  findStartPoint();
}

function showElement(element, name) {
  console.log(name, element);
}

startProgramm();
