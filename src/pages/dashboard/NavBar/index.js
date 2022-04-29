import React from 'react'
import { actions } from 'slices/app.slice'
import { useDispatch, useSelector } from 'react-redux'
import Button from 'components/Button'
import styles from './navbar.module.scss'

const NavBar = () => {
  const dispatch = useDispatch()
  const { me } = useSelector((state) => state.app)
  return (
    <div className={styles.container}>
      <p className={styles.greeting}>{`Hi👋, ${me?.fullName || 'User'}`}</p>
      <Button
        className={`btn-purple-outline ${styles.logOut}`}
        label="Logout"
        onClick={() => dispatch(actions.logout())}
      />
    </div>
  )
}

export default NavBar
