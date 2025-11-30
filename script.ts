function formatData(days: NodeListOf<Element>, date: DateOfWorkout) {
    const result: FormatedData[] = [];

    days.forEach((item) => {
        const itemNorm = {
            name: item.querySelector('.eventName')?.textContent,
            time: item.querySelector('.timePeriod')?.textContent,
            date,
        }
        if (typeof itemNorm.name) result.push(itemNorm);
    })

    return result;
}

function parseWeek(page: HTMLElement) {
    const week = page.querySelector('.weekContainer');

    const weekHead = week?.querySelector('.weekHead');
    const weekDays = Array.from(weekHead?.querySelectorAll('.weekColumn'));
    const nextButton = weekHead?.querySelector('.nextWeek');
    const prevButton = weekHead?.querySelector('.prevWeek');

    const weekBody = week?.querySelector('.weekBody')?.querySelectorAll('.weekColumn');

    if (!weekHead || !weekDays || !weekBody || !nextButton || !prevButton) return;

    const widths = weekDays.map(day => day.offsetWidth);
    const uniqueWidths = [...new Set(widths)];
    if (uniqueWidths.length === 1) {
        return [];
    }
    const maxWidth = Math.max(...uniqueWidths);

    const busyDays = weekDays.reduce((acc, dayElem, index) => {
        if (dayElem.offsetWidth === maxWidth) {
            const [dayOfWeek, date] = dayElem.querySelector('.weekColumn')?.textContent.split(' ');
            const [day, month] = date.split('.');
            const trainings = weekBody[index].querySelectorAll('dayBlock');

            const busyDay = {
                date: {
                    dayOfWeek,
                    day,
                    month,
                },

            };
            acc.push(busyDay);
        }
    }, []);

    const weekData:DateOfWorkout[] = [];
    page.querySelectorAll('.weekColumn').forEach((node) => {
        const [dayOfWeek, date] = node.textContent.split(' ');
        const [day, month] = date.split('.');

        weekData.push({
            dayOfWeek: parseInt(dayOfWeek),
            day: parseInt(day),
            month: parseInt(month),
            year: new Date().getFullYear(),
        });
    }) ;

    return week;
}



const sourceUrl = 'https://an7452.listok.online/wapi#filtered/%7B%22employee%22:%5B2732%5D%7D';

type FormatedData = {
    name?: string,
    time?: string,
    date?: DateOfWorkout,
};
type DateOfWorkout = {
    dayOfWeek: number,
    day: number,
    month: number,
    year: number,
}

// XML Struture
// weekContainer
//  weekHead
//    weekColumn - дата "Пн 24.11"
//  weekBody
//    weekColumn
//      dayBlock []
//        minimizeHover
//          timePeriod - время "11:00 - 11:55"
//          eventName - название "Pilates / Пилатес"
