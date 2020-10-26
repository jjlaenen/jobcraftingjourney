import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization, withEmailVerification, } from '../Session';
import { withFirebase } from '../Firebase';
import TextField from '@material-ui/core/TextField';
import { useStyles } from '../App/styleSheet';
import Button from '@material-ui/core/Button';
import HintsChallengesAlice from './Hints/hintsChallengesAlice';
import HintsChallengesDave from './Hints/hintsChallengesDave';
import HintsChallengesBob from './Hints/hintsChallengesBob';

class ChallengesFormWrite extends Component {
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
    const [demandResource, setDemandResource] = useState('');
    const [goal, setGoal] = useState('');
    const [plan, setPlan] = useState('');
    const [date, setDate] = useState('');

    const onChangeDemandResource = e => {
        setDemandResource(e.target.value);
    };
    const onChangeGoal = e => {
        setGoal(e.target.value);
    };
    const onChangePlan = e => {
        setPlan(e.target.value);
    };
    const onChangeDate = e => {
        setDate(e.target.value);
    };


    const onCreateMessage = (e, authUser) => {
        props.firebase.challenges(authUser.uid).add({
            demandResource: demandResource,
            goal: goal,
            plan: plan,
            date: date,
            userId: authUser.uid,
            createdAt: props.firebase.fieldValue.serverTimestamp(),
        });
        setDemandResource(e.target.value);
        setGoal(e.target.value);
        setPlan(e.target.value);
        setDate(e.target.value);
        e.preventDefault();
        alert('Good luck with your challenge!');
    };

    return (
        <AuthUserContext.Consumer>
            {authUser => (
                <div>
                    <form className={classes.form} onSubmit={e => onCreateMessage(e, authUser)}>
                        <TextField
                            id="outlined-required"
                            label="Context"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={demandResource}
                            onChange={onChangeDemandResource}
                            variant="outlined"
                            helperText="Which demand or resource do you want to improve?"
                        />
                        <TextField
                            id="outlined-required"
                            label="Goal"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={goal}
                            onChange={onChangeGoal}
                            variant="outlined"
                            helperText="What is your goal in this demand or resource?"
                        />
                        <TextField
                            id="outlined-required"
                            label="Action plan"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={plan}
                            onChange={onChangePlan}
                            variant="outlined"
                            helperText="How do you want to achieve this goal?"
                        />
                        <TextField
                            id="outlined-required"
                            label="Deadline"
                            type="text"
                            multiline
                            rowsMax={4}
                            value={date}
                            onChange={onChangeDate}
                            variant="outlined"
                            helperText="When do you want to be finished?"
                        />
                        <div><Button variant="contained" type="submit" className={classes.button}>
                            Let's Go! </Button>
                            <HintsChallengesBob />
                            <HintsChallengesAlice />
                            <HintsChallengesDave />
                        </div>
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
)(ChallengesFormWrite);
