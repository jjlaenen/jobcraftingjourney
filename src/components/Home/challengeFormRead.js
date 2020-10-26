import React, { Component, useState, useEffect } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { useStyles } from '../App/styleSheet';
import ReflectionFormWriteLayout from './reflectionFormWriteLayout';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class ChallengesFormRead extends Component {
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
                <Challenges users={this.state.users} />
            </div>
        );
    }
}
class MessagesBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            demandResource: '',
            goal: '',
            plan: '',
            date: '',
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
            .challenges(authUser)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                if (snapshot.size) {
                    let challenges = [];
                    snapshot.forEach(doc =>
                        challenges.push({ ...doc.data(), uid: doc.id }),
                    );

                    this.setState({
                        challenges: challenges.reverse(),
                        loading: false,
                    });
                } else {
                    this.setState({ challenges: null, loading: false });
                }
            });
    };

    onRemoveMessage = (authUser, uid) => {
        this.props.firebase.challenge(authUser, uid).delete();
    };

    render() {
        const { users } = this.props;
        const { challenges, loading } = this.state;

        return (
            <AuthUserContext.Consumer>

                {authUser => (
                    <div>
                        {loading && <div>Loading ...</div>}

                        {challenges && (
                            <MessageList
                                challenges={challenges.map(message => ({
                                    ...message,
                                    user: users
                                        ? users[message.userId]
                                        : { userId: message.userId },

                                }))}
                                onRemoveMessage={this.onRemoveMessage}
                            />
                        )}
                        {!challenges && <div><Typography variant="h6" component="h2" align='center'>There are no current challenges. Do you want to start a new one?</Typography></div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const MessageList = ({
    challenges,
    onRemoveMessage,
}) => (
        <div>
            {challenges.map(message => (
                <MessageItem
                    key={message.uid}
                    message={message}
                    onRemoveMessage={onRemoveMessage}
                />
            ))}
        </div>
    );

function MessageItem(props) {
    const classes = useStyles();
    const { message, onRemoveMessage } = props;
    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <Card className={classes.card}>
                    <CardContent>
                        <Typography className={classes.title} color="textSecondary">
                            {message.demandResource}
                        </Typography>
                        <Typography variant="h6" component="h2">
                            {message.goal}
                        </Typography>
                        <hr />
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {message.plan}
                        </Typography>
                        <hr />
                        <Typography variant="body2" component="p">
                            deadline: {message.date}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.buttonsAlign}>
                        <ReflectionFormWriteLayout />
                    </CardActions>
                    <CardActions className={classes.buttonsAlign}>
                    <IconButton edge="end" aria-label="delete"onClick={() => onRemoveMessage(authUser.uid, message.uid)}>
                            <DeleteIcon />
                        </IconButton>
                        </CardActions>
                </Card>
            )}
        </AuthUserContext.Consumer>
    );
}
const Challenges = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(ChallengesFormRead);
