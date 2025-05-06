import React, { useState } from "react";
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

const Calendar: React.FC<CalendarProps> = ({ onDateChange, highlightedDates = [] }) => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const handleDateChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
            if (onDateChange) {
                onDateChange(date.toDate());
            }
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
                    position: "relative",
                    ...(isHighlighted && {
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 4,
                            width: 16,
                            height: 4,
                            backgroundColor: "#90CDF4",
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
                    value={selectedDate}
                    defaultValue={dayjs()}
                    disablePast={false}
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
                            flexDirection: "column",
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
                            width: "100%",
                            height: "100%",
                        },
                        "& .MuiTypography-root": {
                            width: "100%",
                            height: "100%",
                            textAlign: "center",
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
                            backgroundColor: "#3182ce;",
                            color: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#3182ce;",
                            },
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Calendar;
