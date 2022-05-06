import { useState } from 'react'
import Input from 'components/Input'
import Button from 'components/Button'
import ErrorBox from 'components/ErrorBox'
import ConfirmEmail from 'pageComponents/ConfirmEmail'
import validate, { tests } from 'utils/validate'
import { useDispatch } from 'react-redux'
import { actions } from 'slices/app.slice'
import styles from './signup.module.scss'

const customTests = {
  ...tests,
  fullName: {
    test: tests.name.test,
    error: 'Please input full name',
  },
}

const Signup = () => {
  const dispatch = useDispatch()

  // ------------------------------------
  // State
  // ------------------------------------
  const [input, setInput] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState({})
  const [resErr, setResError] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // ------------------------------------
  // Handlers
  // ------------------------------------
  const handleOnChange = ({ target: { name, value } }) => {
    setInput((prev) => ({ ...prev, [name]: value }))
    setError((prev) => ({ ...prev, [name]: '' }))
    setResError('')
  }

  const handleSubmit = async () => {
    // validation
    const result = validate(input, customTests)
    setError(result.errors)
    if (result.isError) return

    // confirm password
    if (input.password !== input.confirmPassword) {
      setError({
        password: 'Password do not match',
        confirmPassword: 'Password do not match',
      })
      return
    }

    // signup action
    setLoading(true)

    try {
      await dispatch(actions.signup(input))
      setOpen(true)
      setLoading(false)
      setResError('')
    } catch (err) {
      setResError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      {resErr && <ErrorBox>{resErr}</ErrorBox>}
      <h2 className={styles.title}>Admin Registration</h2>
      <Input
        className={styles.regInput}
        label="Full Name"
        name="fullName"
        placeholder="John Doe"
        value={input.fullName}
        onChange={handleOnChange}
        error={error.fullName}
      />
      <Input
        className={styles.regInput}
        label="Email"
        name="email"
        placeholder="email@example.com"
        value={input.email}
        onChange={handleOnChange}
        error={error.email}
      />
      <Input
        className={styles.regInput}
        type="password"
        label="Password"
        name="password"
        placeholder="password1234"
        value={input.password}
        onChange={handleOnChange}
        error={error.password}
      />
      <Input
        className={styles.regInput}
        type="password"
        label="Confirm Password"
        name="confirmPassword"
        placeholder="password1234"
        value={input.confirmPassword}
        onChange={handleOnChange}
        error={error.confirmPassword}
      />
      <br />
      <Button
        label="Signup"
        className={`btn-purple-fill ${styles.submitButton}`}
        onClick={handleSubmit}
        isLoading={isLoading}
      />
      <ConfirmEmail
        email={input.email}
        isOpen={isOpen}
        toggle={() => setOpen((prev) => !prev)}
        onSubmit={() => {
          setOpen((prev) => !prev)
        }}
      />
    </div>
  )
}

Signup.propTypes = {}
Signup.defaultProps = {}

export default Signup
