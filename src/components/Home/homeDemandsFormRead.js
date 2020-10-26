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
import HomeDemandsFormWrite from './homeDemandsFormWrite';

class HomeDemandsFormRead extends Component {
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
        <HomeDemands users={this.state.users} />
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
      .homeDemands(authUser)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let homeDemands = [];
          snapshot.forEach(doc =>
            homeDemands.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            homeDemands: homeDemands.reverse(),
            loading: false,
          });
        } else {
          this.setState({ homeDemands: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onRemoveMessage = (authUser, uid) => {
    this.props.firebase.homeDemand(authUser, uid).delete();
  };

  render() {
    const { users } = this.props;
    const { homeDemands, loading } = this.state;

    return (
      <AuthUserContext.Consumer>

        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {homeDemands && (
              <MessageList
                homeDemands={homeDemands.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },

                }))}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!homeDemands && <div>There are no home demands ...</div>}
            <HomeDemandsFormWrite />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({
  homeDemands,
  onRemoveMessage,
}) => (
    <ul>
      {homeDemands.map(message => (
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

const HomeDemands = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(HomeDemandsFormRead);
