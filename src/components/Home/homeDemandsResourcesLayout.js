import React from 'react';
import { useStyles } from '../App/styleSheet';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HomeDemandsFormRead from './homeDemandsFormRead';
import HomeResourcesFormRead from './homeResourcesFormRead';

export default function HomeDemandsResourcesLayout() {
  const classes = useStyles();

  return (
    <div className={classes.expansionPanel}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Home demands</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
            <HomeDemandsFormRead />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography className={classes.heading}>Home resources</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <HomeResourcesFormRead />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}