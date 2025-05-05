import React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs from "dayjs";
import styles from "./Calendar.module.scss";

interface CalendarProps {
    onDateChange?: (date: Date) => void;
    highlightedDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
    onDateChange,
    highlightedDates = [
        new Date("2025-05-07T00:00:00Z"),
        new Date("2025-05-08T00:00:00Z"),
        new Date("2025-05-09T00:00:00Z"),
    ],
}) => {
    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (onDateChange && date) {
            onDateChange(date.toDate());
        }
    };

    const renderDay = (
        day: dayjs.Dayjs,
        selectedDates: Array<dayjs.Dayjs | null>,
        pickersDayProps: PickersDayProps,
    ) => {
        const isHighlighted = highlightedDates.some((highlightedDate) => day.isSame(dayjs(highlightedDate), "day"));

        return (
            <PickersDay
                {...pickersDayProps}
                sx={{
                    position: "relative", // <-- important
                    ...(isHighlighted && {
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 4, //left: '50%',
                            width: 16, // very small dot
                            height: 4,
                            backgroundColor: "#90CDF4", // or any color
                            borderRadius: 6,
                        },
                    }),
                }}
            />
        );
    };

    return (
        <div className={styles.calendarContainer}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    slots={{ day: (props) => renderDay(props.day, [], props) }}
                    defaultValue={dayjs()}
                    disablePast={true}
                    onChange={handleDateChange}
                    sx={{
                        width: "100%",
                        height: "100%",

                        "& .MuiPickersCalendarHeader-root": {
                            matginBottom: "30px",
                        },

                        "& .MuiDateCalendar-root": {
                            maxHeight: "none",
                            display: "flex",
                            width: "100%",
                            height: "100%",
                            flexDirection: "column", // Set flex direction to column for proper height handling
                        },

                        "& .MuiDayCalendar-monthContainer": {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                        },

                        "& .MuiPickersSlideTransition-root": {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                            alignContent: "space-between",
                        },

                        "& .MuiPickersFadeTransitionGroup-root": {
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            height: "100%",
                        },

                        "& .MuiDayCalendar-day": {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%", // Ensures the cell fills the width
                            height: "100%", // Ensures the cell fills the height
                        },
                        "& .MuiTypography-root": {
                            width: "100%", // Ensures the text fills the width
                            height: "100%", // Ensures the text fills the height
                            textAlign: "center", // Centers the day number text
                        },
                        "& .MuiDayCalendar-root": {
                            height: "100%",
                        },
                        "& .MuiDayCalendar-weekContainer": {
                            display: "flex",
                            flex: 1,
                            justifyContent: "space-between",
                        },
                        "& .MuiPickersDay-root": {
                            aspectRatio: "1/1",
                            flex: 1,
                            margin: 0,
                            maxWidth: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        },
                        "& .MuiPickersDay-root.Mui-selected": {
                            backgroundColor: "#3182ce;", // Set your desired color here
                            color: "#FFFFFF", // Set text color for better contrast
                            "&:hover": {
                                backgroundColor: "#3182ce;", // Optional: hover color for selected day
                            },
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Calendar;
