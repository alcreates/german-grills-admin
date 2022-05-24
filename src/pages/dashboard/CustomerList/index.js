import React, { useState } from 'react'
import { firestore } from 'utils/firebase'
import SearchInput, { createFilter } from 'react-search-input'
import Button from 'components/Button'
import Input from 'components/Input'
import Modal from 'components/Modal'
import styles from './customerlist.module.scss'

const CustomerList = ({ customersList, setInputUpdated, count }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setOpen] = useState(false)
  const [input, setInput] = useState({
    CustomerName: '',
    SteetAddress: '',
    City: '',
    State: '',
    Email: '',
    Phone: '',
    Zipcode: '',
    LastServiceDate: '',
    Payment: '',
    Notes: '',
  })

  const [successMessage, setSuccessMessage] = useState(false)
  const [error, setError] = useState({})
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
  const filteredCustomers = customersList.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS),
  )
  const handleEdit = (id) => {
    customersList.forEach((c) => {
      if (c.id === id) {
        setInput(c)
      }
    })
    setOpen(true)
  }
  const handleOnChange = ({ target: { name, value } }) => {
    setInput((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: '' }))
  }
  const handleSubmit = () => {
    const customerRef = firestore.collection('customers').doc(input.id)
    customerRef.update(input).then(() => {
      setInputUpdated(input)
      setSuccessMessage(true)
      setInput({
        CustomerName: '',
        SteetAddress: '',
        City: '',
        State: '',
        Email: '',
        Phone: '',
        Zipcode: '',
        LastServiceDate: '',
        Payment: '',
        Notes: '',
      })
    })
  }
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
                <h1 className={styles.title}>Customer List</h1>
              </td>
            </tr>
            <tr>
              <th>Customer Name</th>
              <th>Street</th>
              <th>City</th>
              <th>Phone</th>
              <th>Last Service Date</th>
              <th>Edit</th>
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
                  <td>
                    <Button
                      label="Edit"
                      className={`btn-purple-fill ${styles.editButton}`}
                      onClick={() => handleEdit(c.id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Modal
          isOpen={isOpen}
          size="md"
          toggle={() => setOpen((prev) => !prev)}
          centered
        >
          <div className={styles.rootModule}>
            <div className={styles.close}>
              <Button
                label="&#x2716;"
                onClick={() => setOpen((prev) => !prev)}
              />
            </div>
            <h2 className={styles.title}>Customer</h2>
            <div className={styles.row}>
              <Input
                label="Customer Name"
                className={styles.signUpInput}
                name="CustomerName"
                placeholder="Claudia Pinzon"
                value={input.CustomerName}
                onChange={handleOnChange}
                error={error.CustomerName}
              />
            </div>
            <div className={styles.row}>
              <Input
                className={styles.signUpInput}
                label="Street"
                name="StreetAddress"
                placeholder="21 lackwanna pl"
                value={input.StreetAddress}
                onChange={handleOnChange}
                error={error.StreetAddress}
              />
            </div>
            <div className={styles.row}>
              <Input
                className={styles.signUpInput}
                label="City"
                name="City"
                placeholder="Bloomfield"
                value={input.City}
                onChange={handleOnChange}
                error={error.City}
              />
              <Input
                className={styles.signUpInput}
                label="State"
                name="State"
                placeholder="NJ"
                value={input.State}
                onChange={handleOnChange}
                error={error.State}
              />
              <Input
                className={styles.signUpInput}
                label="Zipcode"
                name="Zipcode"
                placeholder="07960"
                value={input.Zipcode}
                onChange={handleOnChange}
                error={error.Zipcode}
              />
            </div>
            <div className={styles.row}>
              <Input
                className={styles.signUpInput}
                label="Email"
                name="Email"
                placeholder="email@example.com"
                value={input.Email}
                onChange={handleOnChange}
                error={error.Email}
              />
              <Input
                className={styles.signUpInput}
                label="Phone"
                name="Phone"
                placeholder="973-449-0532"
                value={input.Phone}
                onChange={handleOnChange}
                error={error.Phone}
              />
            </div>
            <div className={styles.row}>
              <Input
                className={styles.signUpInput}
                label="Notes"
                name="Notes"
                placeholder="What should we know?"
                value={input.Notes}
                onChange={handleOnChange}
                error={error.Notes}
              />
            </div>
            {successMessage && <p>Succesful Update!</p>}
            <br />
            <Button
              label="Update"
              className={`btn-purple-fill ${styles.submitButton}`}
              onClick={handleSubmit}
            />
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default CustomerList
