import React, { Component } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from '../App/styleSheet';
import PersonalResourcesFormWrite from './personalResourcesFormWrite';

class PersonalResourcesFormRead extends Component {
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
        <PersonalResources users={this.state.users} />
      </div>
    );
  }
}

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      messages: [],
    };
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
      this.onListenForMessages(authUser.uid);
    });
  }
  onListenForMessages = (authUser) => {
    this.setState({ loading: true });
    this.unsubscribe = this.props.firebase
      .personalResources(authUser)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let personalResources = [];
          snapshot.forEach(doc =>
            personalResources.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            personalResources: personalResources.reverse(),
            loading: false,
          });
        } else {
          this.setState({ personalResources: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onRemoveMessage = (authUser, uid) => {
    this.props.firebase.personalResource(authUser, uid).delete();
  };

  render() {
    const { users } = this.props;
    const { personalResources, loading } = this.state;

    return (
      <AuthUserContext.Consumer>

        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {personalResources && (
              <MessageList
                personalResources={personalResources.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },

                }))}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!personalResources && <div>There are no personal resources ...</div>}
            <PersonalResourcesFormWrite />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({
  personalResources,
  onRemoveMessage,
}) => (
    <ul>
      {personalResources.map(message => (
        <MessageItem
          key={message.uid}
          message={message}
          onRemoveMessage={onRemoveMessage}
        />
      ))}
    </ul>
  );

function MessageItem(props) {
  const { message, onRemoveMessage } = props;
  const classes = useStyles();
  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div className={classes.list}>
          <div className={classes.demo}>
            <List dense>
              <ListItem>
              <ListItemIcon>
                  <IconButton edge="end" aria-label="delete" onClick={() => onRemoveMessage(authUser.uid, message.uid)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={message.text}
                />
              </ListItem>
            </List>
          </div>
        </div>
      )}
    </AuthUserContext.Consumer>
  );
}

const PersonalResources = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(PersonalResourcesFormRead);
