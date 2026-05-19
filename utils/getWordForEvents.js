export default function getWordForEvents(count) {
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return "событий";
    } else {
        const lastDigit = count % 10;
        if (lastDigit === 1) {
            return "событие";
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return "события";
        } else {
            return "событий";
        }
    }
}
