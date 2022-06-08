import React, { useState, useEffect } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Link,
  useRouteMatch,
  Switch,
} from 'react-router-dom'
import { firestore } from 'utils/firebase'
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { useDispatch } from 'react-redux'
import { actions } from 'slices/app.slice'
import 'react-pro-sidebar/dist/css/styles.css'
import NavBar from './NavBar'
import CustomerRegistration from './CustomerRegistration'
import CustomerList from './CustomerList'
import Calendar from './Calendar'
import PendingList from './PendingList'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const match = useRouteMatch()
  const [customers, setCustomers] = useState([])
  const [inputUpdated, setInputUpdated] = useState({})
  const [count, setCount] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    const docRef = firestore.collection('customers')

    docRef
      .get()
      .then((querySnapshot) =>
        querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
        }),
      )
      .then((res) => {
        const cus = res.map((d) => {
          let LastServiceDate = 'N/A'
          if (d.LastServiceDate && d.LastServiceDate.toDate) {
            LastServiceDate = d.LastServiceDate.toDate().toString()
          }
          return { ...d, LastServiceDate }
        })
        setCustomers(cus)
        dispatch(actions.setCustomers(cus))
        setCount(cus.length)
      })
      .catch((e) => {
        console.info('Error getting document:', e)
      })
  }, [inputUpdated])
  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <Router>
          <ProSidebar>
            <Menu iconShape="square">
              <MenuItem>
                <Link to={`${match.url}`}>View Customers </Link>
              </MenuItem>
              <MenuItem>
                <Link to={`${match.url}/customerRegistration`} />
                Customer Registration
              </MenuItem>
              <MenuItem>
                <Link to={`${match.url}/pending`} />
                Pending List
              </MenuItem>
              <MenuItem>
                <Link to={`${match.url}/calendar`} />
                Calendar
              </MenuItem>
            </Menu>
          </ProSidebar>
          <div className={styles.view}>
            <Switch>
              <Route exact path={`${match.path}/`}>
                <CustomerList
                  customersList={customers}
                  setInputUpdated={setInputUpdated}
                  count={count}
                />
              </Route>
              <Route path={`${match.path}/customerRegistration`}>
                <CustomerRegistration setInputUpdated={setInputUpdated} />
              </Route>
              <Route path={`${match.path}/calendar`}>
                <Calendar />
              </Route>
              <Route path={`${match.path}/pending`}>
                <PendingList customersList={customers} count={count} />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  )
}

Dashboard.propTypes = {}
Dashboard.defaultProps = {}

export default Dashboard
