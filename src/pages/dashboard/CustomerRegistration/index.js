import React, { useState } from 'react'
import Input from 'components/Input'
import Button from 'components/Button'
import { firestore } from 'utils/firebase'
import styles from './customerRegistration.module.scss'

const CustomerRegistration = () => {
  const [input, setInput] = useState({
    firstName: '',
    lastName: '',
    streetName: '',
    cityName: '',
    stateName: '',
    email: '',
    phone: '',
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
        console.log('document created')
        setInput({
          firstName: '',
          lastName: '',
          streetName: '',
          cityName: '',
          stateName: '',
          email: '',
          phone: '',
        })
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
          label="First Name"
          className={styles.signUpInput}
          name="firstName"
          placeholder="John"
          value={input.firstName}
          onChange={handleOnChange}
          error={error.firstName}
        />

        <Input
          className={styles.signUpInput}
          label="Last Name"
          name="lastName"
          placeholder="Smith"
          value={input.lastName}
          onChange={handleOnChange}
          error={error.lastName}
        />
      </div>
      <div className={styles.row}>
        <Input
          className={styles.signUpInput}
          label="Street"
          name="streetName"
          placeholder="21 lackwanna pl"
          value={input.streetName}
          onChange={handleOnChange}
          error={error.streetName}
        />
      </div>
      <div className={styles.row}>
        <Input
          className={styles.signUpInput}
          label="city"
          name="cityName"
          placeholder="Bloomfield"
          value={input.cityName}
          onChange={handleOnChange}
          error={error.cityName}
        />
        <Input
          className={styles.signUpInput}
          label="state"
          name="stateName"
          placeholder="NJ"
          value={input.stateName}
          onChange={handleOnChange}
          error={error.stateName}
        />
      </div>
      <div className={styles.row}>
        <Input
          className={styles.signUpInput}
          label="Email"
          name="email"
          placeholder="email@example.com"
          value={input.email}
          onChange={handleOnChange}
          error={error.email}
        />
        <Input
          className={styles.signUpInput}
          label="Phone"
          name="phone"
          placeholder="973-449-0532"
          value={input.phone}
          onChange={handleOnChange}
          error={error.phone}
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
