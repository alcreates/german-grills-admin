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
import 'react-pro-sidebar/dist/css/styles.css'
import NavBar from './NavBar'
import CustomerRegistration from './CustomerRegistration'
import CustomerList from './CustomerList'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const match = useRouteMatch()
  const [customers, setCustomers] = useState([])
  const [inputUpdated, setInputUpdated] = useState({})
  const [count, setCount] = useState([])
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
        console.log(res.length)
        setCustomers(res)
        setCount(res.length)
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
