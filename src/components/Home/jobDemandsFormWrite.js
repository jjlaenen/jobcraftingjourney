import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../App/styleSheet';
import Button from '@material-ui/core/Button';
import HintsJobDemandsBob from './Hints/hintsJobDemandsBob';
import HintsJobDemandsAlice from './Hints/hintsJobDemandsAlice';
import HintsJobDemandsDave from './Hints/hintsJobDemandsDave';

class JobDemandsFormWrite extends Component {
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
        <JobDemands users={this.state.users} />
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
    props.firebase.jobDemands(authUser.uid).add({
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
              label="Add a job demand"
              type="text"
              multiline
              rowsMax={4}
              value={text}
              onChange={onChangeText}
              variant="outlined"
              helperText="Write down things in your job which you feel are demanding"
            />
            <div>
            <Button variant="contained" type="submit" className={classes.button}>Add</Button>
            </div>
            <br></br>
            <div>
            <HintsJobDemandsBob />
            <HintsJobDemandsAlice />
            <HintsJobDemandsDave />
            </div>
          </form>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
}

const JobDemands = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(JobDemandsFormWrite);
