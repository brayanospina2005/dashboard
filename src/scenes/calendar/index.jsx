import React, { useState, useEffect } from "react";
import { Calendar as FullCalendar, formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const CalendarPage = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);

    const handleDateClick = (info) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = info.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${info.dateStr}-${title}`,
                title,
                start: info.startStr,
                end: info.endStr,
                allDay: info.allDay,
            });
        }
    };

    const handleEventClick = (info) => {
        if (window.confirm(`Are you sure you want to delete the event '${info.event.title}'`)) {
            info.event.remove();
        }
    };

    useEffect(() => {
        let calendarEl = document.getElementById('calendar');
        let calendar = new FullCalendar(calendarEl, {
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            },
            editable: true,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            select: handleDateClick,
            eventClick: handleEventClick,
            eventsSet: (events) => setCurrentEvents(events),
            initialEvents: [
                { id: "12315", title: "All-day event", date: "2022-09-14" },
                { id: "5123", title: "Timed event", date: "2022-09-28" },
            ],
        });
        calendar.render();
    }, []);

    return (
        <Box m="20px" height="calc(100vh - 40px)" overflow="hidden">
            <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

            <Box display="flex" justifyContent="space-between" height="100%" overflow="hidden" flexDirection={{ xs: 'column', md: 'row' }}>
                {/* CALENDAR SIDEBAR */}
                <Box
                    flex="1 1 20%"
                    backgroundColor={colors.primary[400]}
                    p="15px"
                    borderRadius="4px"
                    mb={{ xs: '20px', md: '0' }}
                    overflow="auto"
                >
                    <Typography variant="h5">Events</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                    margin: "10px 0",
                                    borderRadius: "2px",
                                }}
                            >
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(event.start, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* CALENDAR */}
                <Box flex="1 1 75%" ml={{ xs: '0', md: '15px' }} sx={{
                    maxWidth: '100%',
                    height: '100%',
                    overflow: 'auto',
                    '& #calendar': {
                        height: '100%',
                    },
                }}>
                    <div id="calendar" style={{ minHeight: '400px', height: '90%' }}></div>
                </Box>
            </Box>
        </Box>
    );
};

export default CalendarPage;
