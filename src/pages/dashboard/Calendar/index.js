import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import { firestore } from 'utils/firebase'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import styles from './calendar.module.scss'

const localizer = momentLocalizer(moment)

const DashCalendar = () => {
  const [events, setEvents] = useState([])
  useEffect(() => {
    firestore
      .collection('appointments')
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs.map((d) => d.data())
      })
      .then((result) => {
        const eventMap = result.map((e) => {
          return { ...e, start: e.start.toDate(), end: e.end.toDate() }
        })
        setEvents(eventMap)
      })
  }, [])
  return (
    <div className={styles.App}>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        style={{ height: '100vh' }}
      />
    </div>
  )
}

export default DashCalendar
