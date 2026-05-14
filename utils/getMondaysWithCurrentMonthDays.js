export default function getMondaysWithCurrentMonthDays() {
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
