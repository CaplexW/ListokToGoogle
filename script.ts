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
    const week:DateOfWorkout[] = [];
    page.querySelectorAll('.weekColumn').forEach((node) => {
        const [dayOfWeek, date] = node.textContent.split(' ');
        const [day, month] = date.split('.');

        week.push({
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
