import React from 'react';
import { useStyles } from '../App/styleSheet';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ChallengeFormWrite from './challengeFormWrite';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export default function ChallengeFormWriteLayout() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className={classes.buttonsAlign}><br></br><Button variant="contained" color="primary" onClick={handleOpen} className={classes.button}>
        start new challenge
      </Button></div>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
          <IconButton edge="end" aria-label="close" onClick={handleClose} className={classes.closeButton}>
                    <CloseIcon />
                  </IconButton>
<ChallengeFormWrite/>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
