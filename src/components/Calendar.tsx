import React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import styles from "./Calendar.module.scss";

const Calendar: React.FC = () => {
    return (
        <div className={styles.calendarContainer}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                    defaultValue={dayjs()}
                    disablePast={true}
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
                    }}
                />
            </LocalizationProvider>
        </div>
    );
};

export default Calendar;
