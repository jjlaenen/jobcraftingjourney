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
import HomeResourcesFormWrite from './homeResourcesFormWrite';

class HomeResourcesFormRead extends Component {
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
      .homeResources(authUser)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let homeResources = [];
          snapshot.forEach(doc =>
            homeResources.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            homeResources: homeResources.reverse(),
            loading: false,
          });
        } else {
          this.setState({ homeResources: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onRemoveMessage = (authUser, uid) => {
    this.props.firebase.homeResource(authUser, uid).delete();
  };

  render() {
    const { users } = this.props;
    const { homeResources, loading } = this.state;

    return (
      <AuthUserContext.Consumer>

        {authUser => (
          <div>
            {loading && <div>Loading ...</div>}

            {homeResources && (
              <MessageList
                homeResources={homeResources.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },

                }))}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!homeResources && <div>There are no home resources ...</div>}
            <HomeResourcesFormWrite />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const MessageList = ({
  homeResources,
  onRemoveMessage,
}) => (
    <ul>
      {homeResources.map(message => (
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

const HomeResources = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(HomeResourcesFormRead);
