import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../App/styleSheet';
import Button from '@material-ui/core/Button';
import HintsHomeResourcesBob from './Hints/hintsHomeResourcesBob';
import HintsHomeResourcesAlice from './Hints/hintsHomeResourcesAlice';
import HintsHomeResourcesDave from './Hints/hintsHomeResourcesDave';

class HomeResourcesFormWrite extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      authUser: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.firebase
      .users()
      .onSnapshot(snapshot => {
        let users = [];
        snapshot.forEach(doc =>
          users.push({ ...doc.data(), uid: doc.id }),
        );
      })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <div>
        <HomeResources users={this.state.users} />
      </div>
    );
  }
}

function MessagesBase(props) {
  const classes = useStyles();
  const [text, setText] = useState('');

  const onChangeText = e => {
    setText(e.target.value);
  };

  const onCreateMessage = (e, authUser) => {
    props.firebase.homeResources(authUser.uid).add({
      text: text,
      userId: authUser.uid,
      createdAt: props.firebase.fieldValue.serverTimestamp(),
    });

    setText(e.target.value);
    e.preventDefault();
  };
  return (
    <AuthUserContext.Consumer>

      {authUser => (
        <div>
          <form onSubmit={e => onCreateMessage(e, authUser)
          }
          >
            <TextField
              id="outlined-required"
              label="Add a home demand"
              type="text"
              multiline
              rowsMax={4}
              value={text}
              onChange={onChangeText}
              variant="outlined"
              helperText="Write down things in your home environment which you support you"
            />
            <div>
            <Button variant="contained" type="submit" className={classes.button}>Add</Button>
            </div>
            <br></br>
            <div>
            <HintsHomeResourcesBob />
            <HintsHomeResourcesAlice />
            <HintsHomeResourcesDave />
            </div>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
}

const HomeResources = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(HomeResourcesFormWrite);
