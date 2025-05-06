export const getDateString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    return date.toLocaleDateString("hu-HU", options);
};

export const convertToGlobalUTC = (dateToConvert: Date): string => {
    const date = new Date(dateToConvert);
    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth()).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        "T" +
        "00:00:00"
    );
};
