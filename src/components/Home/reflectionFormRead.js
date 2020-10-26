import React, { Component } from 'react';
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


class ReflectionsFormRead extends Component {
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
                <Reflections users={this.state.users} />
            </div>
        );
    }
}
class MessagesBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            description:'',
            positive: '',
            negative:'',
            different:'',
            changeDemandResource:'',
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
            .reflections(authUser)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                if (snapshot.size) {
                    let reflections = [];
                    snapshot.forEach(doc =>
                        reflections.push({ ...doc.data(), uid: doc.id }),
                    );

                    this.setState({
                        reflections: reflections.reverse(),
                        loading: false,
                    });
                } else {
                    this.setState({ reflections: null, loading: false });
                }
            });
    };

    render() {
        const { users } = this.props;
        const {reflections, loading } = this.state;

        return (
            <AuthUserContext.Consumer>

                {authUser => (
                    <div>
                        {loading && <div>Loading ...</div>}

                        {reflections && (
                            <MessageList
                                reflections={reflections.map(message => ({
                                    ...message,
                                    user: users
                                        ? users[message.userId]
                                        : { userId: message.userId },

                                }))}
                            />
                        )}

                        {!reflections && <div><Typography variant="h6" component="h2" align='center'>Here your reflections will be displayed! Finish a challenge to start your logbook.</Typography></div>}
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

const MessageList = ({
    reflections,
    onRemoveMessage,
}) => (
        <div>
            {reflections.map(message => (
                <MessageItem
                    key={message.uid}
                    message={message}
                />
            ))}
        </div>
    );

function MessageItem(props) {
    const classes = useStyles();
    const { message} = props;
        return (
            <AuthUserContext.Consumer>

                {authUser => (
                     <Card className={classes.card}>
                     <CardContent>
                     <Typography className={classes.title} color="textSecondary">
                            Description
                        </Typography>
                         <Typography variant="body2" component="p">
                         {message.description}
                         </Typography>
                         <hr />
                         <Typography className={classes.title} color="textSecondary">
                           What went well
                        </Typography>
                         <Typography variant="body2" component="p">
                         {message.positive}
                         </Typography>
                         <hr />
                         <Typography className={classes.title} color="textSecondary">
                            What didn't go well
                        </Typography>
                         <Typography variant="body2" component="p">
                         {message.negative}
                         </Typography>
                         <hr />
                         <Typography className={classes.title} color="textSecondary">
                            How this could be done differently in the future
                        </Typography>
                         <Typography variant="body2" component="p">
                         {message.different}
                         </Typography>
                         <hr />
                         <Typography className={classes.title} color="textSecondary">
                            How my demands and resources changed
                        </Typography>
                         <Typography variant="body2" component="p">
                         {message.changeDemandResource}
                         </Typography>
                     </CardContent>
                     </Card>
                )}
            </AuthUserContext.Consumer>
        );
    }
const Reflections = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
    withFirebase,
    withEmailVerification,
    withAuthorization(condition),
)(ReflectionsFormRead);
