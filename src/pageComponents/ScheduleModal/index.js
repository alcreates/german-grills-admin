import React, { useState } from 'react'
import firebase, { firestore } from 'utils/firebase'
import Modal from 'components/Modal'
import DatePicker from 'react-datepicker'
import Button from 'components/Button'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './schedulemodal.module.scss'

const ScheduleModal = ({ isOpen, toggle, customer, size, handleRemove }) => {
  const [startDate, setStartDate] = useState(new Date())
  const getDayParams = () => {
    const startTime = new Date(startDate)
    const endTime = new Date(startDate)
    startTime.setHours(0, 0, 0, 0)
    endTime.setHours(23, 59, 59, 999)
    const start = firebase.firestore.Timestamp.fromDate(startTime)
    const end = firebase.firestore.Timestamp.fromDate(endTime)
    return {
      start,
      end,
    }
  }
  const handleAppointmentTime = () => {
    return new Promise((resolve, reject) => {
      const { start, end } = getDayParams()
      const appointments = firestore.collection('appointments')
      appointments.where('start', '>=', start)
      appointments.where('end', '<=', end)
      appointments
        .orderBy('start')
        .limit(1)
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs.map((d) => d.data())
        })
        .then((r) => {
          console.info(r, 'result of handle appointment')
          if (r.length) {
            return resolve(r[0].end.toDate())
          }
          const newDate = new Date(startDate)
          newDate.setHours(8, 0, 0, 0)
          return resolve(newDate)
        })
        .catch((e) => {
          return reject(e)
        })
    })
  }

  const handleSubmit = () => {
    handleAppointmentTime().then((sDate) => {
      const endDate = new Date(sDate)
      endDate.setMinutes(endDate.getMinutes() + 30)
      firestore
        .collection('appointments')
        .add({
          CustomerId: customer.id,
          start: sDate,
          end: endDate,
          title: customer.StreetAddress,
          Zipcode: customer.Zipcode || customer.ZipCode,
        })
        .then(() => {
          handleRemove(customer.id)
        })
        .catch((e) => {
          console.log(e)
        })

      firestore
        .collection('customers')
        .doc(customer.id)
        .update({
          LastServiceDate: firebase.firestore.Timestamp.fromDate(sDate),
        })
        .then(() => {
          console.info('Last Service Date Updated')
        })
        .catch((e) => {
          console.error(e)
        })
    })
  }
  return (
    <Modal isOpen={isOpen} toggle={toggle} size={size}>
      <div className={styles.root}>
        <h3>{customer.StreetAddress}</h3>
        <div className={styles.datePickerWrapper}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className={styles.submitWrapper}>
          <Button
            label="Submit"
            className={`btn-pink-fill ${styles.submit}`}
            onClick={() => handleSubmit()}
          />
        </div>
      </div>
    </Modal>
  )
}

export default ScheduleModal
