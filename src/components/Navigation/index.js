import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import BookIcon from '@material-ui/icons/Book';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import { useStyles } from '../App/styleSheet';
import { AuthUserContext } from '../Session';


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuth authUser={authUser} />
        ) : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

function NavigationAuth() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.navigation}
    >
      <BottomNavigationAction label="Home" icon={<HomeWorkIcon />} component={Link}
        to={ROUTES.HOME} />
      <BottomNavigationAction label="logbook" icon={<BookIcon />} component={Link}
        to={ROUTES.LOGBOOK} />/>
      <BottomNavigationAction label="Account" icon={<AccountCircleIcon />} component={Link}
        to={ROUTES.ACCOUNT} />/>
    </BottomNavigation>
  );
}

function NavigationNonAuth() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.navigation}
    >
      <BottomNavigationAction label="Landing page" icon={<HomeWorkIcon />} component={Link}
        to={ROUTES.LANDING} />
      <BottomNavigationAction label="Sign in" icon={<AccountCircleIcon />} component={Link}
        to={ROUTES.SIGN_IN} />/>
    </BottomNavigation>
  );
}

export default Navigation;