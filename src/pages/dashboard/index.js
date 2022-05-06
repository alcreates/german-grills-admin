import React from 'react'
import {
  Route,
  BrowserRouter as Router,
  Link,
  useRouteMatch,
  Switch,
} from 'react-router-dom'
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar'
import 'react-pro-sidebar/dist/css/styles.css'
import Signup from 'pages/auth/Signup'
import NavBar from './NavBar'
import CustomerRegistration from './CustomerRegistration'
import CustomerList from './CustomerList'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const match = useRouteMatch()
  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <Router>
          <ProSidebar>
            <Menu iconShape="square">
              <MenuItem>
                <Link to={`${match.url}/clients`}>View Customers </Link>
              </MenuItem>

              <MenuItem>
                Admin Registration
                <Link to={`${match.url}/signup`} />
              </MenuItem>
              <MenuItem>
                <Link to={`${match.url}/customerRegistration`} />
                Customer Registration
              </MenuItem>
            </Menu>
          </ProSidebar>
          <div className={styles.view}>
            <Switch>
              <Route exact path={`${match.path}/clients`}>
                <CustomerList />
              </Route>
              <Route exact path={`${match.path}/signup`}>
                <Signup />
              </Route>
              <Route exact path={`${match.path}/customerRegistration`}>
                <CustomerRegistration />
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
