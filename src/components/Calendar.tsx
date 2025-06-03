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
        void selectedDates;
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
            <div className={styles.calendarBox}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        slots={{ day: (props) => renderDay(props.day, [], props) }}
                        value={selectedDate}
                        defaultValue={dayjs()}
                        disablePast={false}
                        onChange={handleDateChange}
                        sx={{
                            width: "100%",
                            aspectRatio: "unset",
                            "& .MuiPickersDay-root": {
                                flex: 1,
                                height: "40px",
                                borderRadius: "20px",
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            },
                            "& .MuiDayCalendar-weekContainer": {
                                display: "flex",
                                justifyContent: "space-between",
                            },
                            "& .MuiPickersDay-root.Mui-selected": {
                                backgroundColor: "#3182ce;",
                                color: "#FFFFFF",
                                "&:hover": {
                                    backgroundColor: "#3182ce;",
                                },
                            },

                            "& .MuiDayCalendar-header": {
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                padding: "16px 0",
                            },

                            "& .MuiYearCalendar-button.Mui-selected": {
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
        </div>
    );
};

export default Calendar;
