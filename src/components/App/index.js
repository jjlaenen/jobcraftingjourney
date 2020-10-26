import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Header from '../Navigation/header';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import LogPage from '../Logbook';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import {useStyles} from './styleSheet';

function App () {
  const classes = useStyles();
  return(
  <Router>
    <div>
      <Header />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage}/>
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.LOGBOOK} component={LogPage} />
    </div>
    <div className={classes.bottomMargin}></div>
    <Navigation />
  </Router>
  )}

export default withAuthentication(App);