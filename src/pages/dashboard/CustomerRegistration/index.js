import React, { useState } from 'react'
import Input from 'components/Input'
import Button from 'components/Button'
import { firestore } from 'utils/firebase'
import styles from './customerRegistration.module.scss'

const CustomerRegistration = ({ setInputUpdated }) => {
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
  const [error, setError] = useState({})

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleOnChange = ({ target: { name, value } }) => {
    setInput((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: '' }))
  }
  const handleSubmit = async () => {
    console.log('submit')
    firestore
      .collection('customers')
      .add(input)
      .then(() => {
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
        setInputUpdated(input)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Customer Registration</h2>
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

      <br />
      <Button
        label="Signup"
        className={`btn-purple-fill ${styles.submitButton}`}
        onClick={handleSubmit}
      />
    </div>
  )
}

export default CustomerRegistration
