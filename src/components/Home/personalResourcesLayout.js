import React from 'react';
import { useStyles } from '../App/styleSheet';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PersonalResourcesFormRead from './personalResourcesFormRead'

export default function Personal() {
  const classes = useStyles();

  return (
    <div className={classes.expansionPanel}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Personal resources</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <PersonalResourcesFormRead />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}