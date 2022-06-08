import React, { useState, useEffect } from 'react'
import { firestore } from 'utils/firebase'
import SearchInput, { createFilter } from 'react-search-input'
import { useSelector } from 'react-redux'
import ScheduleModal from 'pageComponents/ScheduleModal'
import Button from 'components/Button'
import styles from './pending.module.scss'

const PendingList = ({ count }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [customersList, setCustomers] = useState([])
  const { customers } = useSelector((state) => state.app)
  const [pendingUpdate, setPendingUpdate] = useState('')
  const [isScheduleOpen, setScheduleOpen] = useState(false)
  const [customer, setCustomer] = useState({})
  const KEYS_TO_FILTERS = [
    'CustomerName',
    'Email',
    'StreetAddress',
    'City',
    'Phone',
  ]
  const searchTermUpdate = (term) => {
    setSearchTerm(term)
  }
  const getPendingCustomerList = (cUIds) => {
    const uidMap = {}
    cUIds.forEach((id) => {
      uidMap[id] = true
    })
    const result = customers.filter((cus) => {
      return uidMap[cus.id]
    })
    return result
  }
  useEffect(() => {
    firestore
      .collection('pendingList')
      .where('pending', '==', true)
      .get()
      .then((querySnapshot) => querySnapshot.docs.map((doc) => doc.id))
      .then((result) => {
        if (customers) setCustomers(getPendingCustomerList(result))
      })
  }, [customers, pendingUpdate])
  const handleRemove = (id) => {
    firestore
      .collection('pendingList')
      .doc(id)
      .set({
        pending: false,
      })
      .then(() => {
        setPendingUpdate(id)
      })
  }
  const handleSchedule = (cus) => {
    setCustomer(cus)
    setScheduleOpen(true)
  }
  const filteredCustomers = customersList.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS),
  )
  return (
    <div className={styles.wrapper}>
      <div className={styles.count}>
        Count :{filteredCustomers ? filteredCustomers.length : count}
      </div>
      <div className={styles.root}>
        <div className={styles.searchWrapper}>
          <SearchInput
            className={styles.searchInput}
            onChange={searchTermUpdate}
          />
        </div>
        <table>
          <thead>
            <tr>
              <td>
                <h1 className={styles.title}>Pending List</h1>
              </td>
            </tr>
            <tr>
              <th>Customer Name</th>
              <th>Street</th>
              <th>City</th>
              <th>Phone</th>
              <th>Last Service Date</th>
              <th className={styles.schedule}>Schedule</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers &&
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>{c.CustomerName}</td>
                  <td>{c.StreetAddress}</td>
                  <td>{c.City}</td>
                  <td>{c.Phone}</td>
                  <td>{c.LastServiceDate || 'N/A'}</td>
                  <td className={styles.schedule}>
                    <Button
                      label="Schedule"
                      className={`btn-purple-fill  ${styles.editButton}`}
                      onClick={() => handleSchedule(c)}
                    />
                  </td>
                  <td className={styles.schedule}>
                    <Button
                      label="Remove"
                      onClick={() => handleRemove(c.id)}
                      className={`btn-pink-fill  ${styles.editButton}`}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ScheduleModal
          isOpen={isScheduleOpen}
          toggle={() => setScheduleOpen((prev) => !prev)}
          size="md"
          customer={customer}
          handleRemove={handleRemove}
        />
      </div>
    </div>
  )
}

export default PendingList
