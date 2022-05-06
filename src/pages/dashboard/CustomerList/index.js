import React, { useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import SearchInput, { createFilter } from 'react-search-input'
import styles from './customerlist.module.scss'

const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const KEYS_TO_FILTERS = ['firstName', 'lastName', 'email', 'streetName']
  useEffect(() => {
    const docRef = firestore.collection('customers')

    docRef
      .get()
      .then((querySnapshot) => {
        const customersList = []
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          customersList.push({ ...doc.data(), id: doc.id })
        })
        return customersList
      })
      .then((res) => {
        setCustomers(res)
      })
      .catch((error) => {
        console.info('Error getting document:', error)
      })
  }, [])
  const searchTermUpdate = (term) => {
    setSearchTerm(term)
  }
  const filteredCustomers = customers.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS),
  )
  return (
    <div className={styles.wrapper}>
      <SearchInput className={styles.searchInput} onChange={searchTermUpdate} />
      <div className={styles.root}>
        <table>
          <thead>
            <tr>
              <td>
                <h1 className={styles.title}>Customer List</h1>
              </td>
            </tr>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Street</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers &&
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>{c.firstName}</td>
                  <td>{c.lastName}</td>
                  <td>{c.streetName}</td>
                  <td>{c.email}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CustomerList
