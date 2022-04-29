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
import NavBar from './NavBar'
import styles from './dashboard.module.scss'

const Dashboard = () => {
  const Clients = () => <div> Clients </div>
  const SignUp = () => <div>Sign Up</div>
  const match = useRouteMatch()
  return (
    <div className={styles.root}>
      <NavBar />
      <div className={styles.container}>
        <Router>
          <ProSidebar>
            <Menu iconShape="square">
              <MenuItem>
                <Link to={`${match.url}/clients`}>Dashboard </Link>
              </MenuItem>

              <MenuItem>
                Component 1
                <Link to={`${match.url}/signup`} />
              </MenuItem>
              <MenuItem>Component 2</MenuItem>
            </Menu>
          </ProSidebar>
          <div>
            <Switch>
              <Route exact path={`${match.path}/clients`}>
                <Clients />
              </Route>
              <Route exact path={`${match.path}/signup`}>
                <SignUp />
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
