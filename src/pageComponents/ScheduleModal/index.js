import React, { useState } from 'react'
import firebase, { firestore } from 'utils/firebase'
import Modal from 'components/Modal'
import DatePicker from 'react-datepicker'
import Button from 'components/Button'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './schedulemodal.module.scss'

const ScheduleModal = ({
  isOpen,
  toggle,
  customer,
  size,
  handleRemove,
  setInputUpdated,
}) => {
  const [startDate, setStartDate] = useState(new Date())
  const getDayParams = () => {
    const startTime = new Date(startDate)
    startTime.setHours(0, 0, 0, 0)

    const endTime = new Date(startDate)
    endTime.setDate(startTime.getDate() + 1)
    endTime.setHours(0, 0, 0, 0)

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
      appointments
        .where('end', '>', start)
        .where('end', '<', end)
        .orderBy('end')
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs.map((d) => d.data())
        })
        .then((r) => {
          if (r.length) {
            return resolve(r[r.length - 1].end.toDate())
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

  const handleSubmit = async () => {
    const startApp = await handleAppointmentTime()
    const endApp = new Date(startApp)
    endApp.setMinutes(endApp.getMinutes() + 30)
    const payload = {
      CustomerId: customer.id,
      start: startApp,
      end: endApp,
      title: customer.StreetAddress || customer.ServiceAddress,
      Zipcode: customer.Zipcode || customer.ZipCode,
    }
    console.info(customer, 'customer')
    console.info(payload, 'payload')
    await firestore.collection('appointments').add(payload)

    handleRemove(customer.id)

    firestore
      .collection('customers')
      .doc(customer.id)
      .update({
        LastServiceDate: firebase.firestore.Timestamp.fromDate(startApp),
      })
      .then(() => {
        toggle()
        setInputUpdated({
          ...customer,
          LastServiceDate: endApp.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        })
      })
      .catch((e) => {
        console.error(e)
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
