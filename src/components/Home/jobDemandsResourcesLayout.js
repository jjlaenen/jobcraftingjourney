import React from 'react';
import { useStyles } from '../App/styleSheet';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import JobDemandsFormRead from './jobDemandsFormRead';
import JobResourcesFormRead from './jobResourcesFormRead';

export default function JobDemandsResourcesLayout() {
  const classes = useStyles();

  return (
    <div className={classes.expansionPanel}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Job demands</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <JobDemandsFormRead />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Job resources</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <JobResourcesFormRead />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}