import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../App/styleSheet';
import Button from '@material-ui/core/Button';

class ReflectionsFormWrite extends Component {
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

function MessagesBase(props) {
    const classes = useStyles();
    const [description, setDescription] = useState('');
    const [positive, setPositive] = useState('');
    const [negative, setNegative] = useState('');
    const [different, setDifferent] = useState('');
    const [changeDemandResource, setChangeDemandResource] = useState('');

    const onDescription = e => {
        setDescription(e.target.value);
    };
    const onPositive = e => {
        setPositive(e.target.value);
    };
    const onNegative = e => {
        setNegative(e.target.value);
    };
    const onDifferent = e => {
        setDifferent(e.target.value);
    }
    const onChangeDemandResource = e => {
        setChangeDemandResource(e.target.value);
    };

    const onCreateMessage = (e, authUser) => {
        props.firebase.reflections(authUser.uid).add({
            description: description,
            positive: positive,
            negative: negative,
            different: different,
            changeDemandResource: changeDemandResource,
            userId: authUser.uid,
            createdAt: props.firebase.fieldValue.serverTimestamp(),
        });
        setDescription(e.target.value);
        setPositive(e.target.value);
        setNegative(e.target.value);
        setDifferent(e.target.value);
        setChangeDemandResource(e.target.value);
        e.preventDefault();
        alert('Reflection submitted! Check your reflections in the logbook.');
    };

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <form className={classes.form} onSubmit={e => onCreateMessage(e, authUser)}>
                        <TextField
                            id="outlined-required"
                            label="Description"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={description}
                            onChange={onDescription}
                            variant="outlined"
                            helperText="Describe what you did"
                        />
                        <TextField
                            id="outlined-required"
                            label="Positives"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={positive}
                            onChange={onPositive}
                            variant="outlined"
                            helperText="Describe what went well"
                        />
                        <TextField
                            id="outlined-required"
                            label="Negatives"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={negative}
                            onChange={onNegative}
                            variant="outlined"
                            helperText="Describe what didn't go well"
                        />
                        <TextField
                            id="outlined-required"
                            label="Improvements"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={different}
                            onChange={onDifferent}
                            variant="outlined"
                            helperText="Describe how you would do this differently"
                        />
                        <TextField
                            id="outlined-required"
                            label="Changes"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={changeDemandResource}
                            onChange={onChangeDemandResource}
                            variant="outlined"
                            helperText="Describe how your demands and resources changed"
                        />
                        <div><Button variant="contained" type="submit" className={classes.button}>
                            Add to logbook
      </Button></div>
                        
                    </form>
                </div>
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
)(ReflectionsFormWrite);
