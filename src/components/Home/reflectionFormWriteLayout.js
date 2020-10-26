import React from 'react';
import { useStyles } from '../App/styleSheet';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ReflectionFormWrite from './reflectionFormWrite';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

export default function ReflectionFormWriteLayout() {
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
      <Button variant="contained" onClick={handleOpen} className={classes.button}>
        finish challenge and write reflection
      </Button>
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
<ReflectionFormWrite handleClose={handleClose}/>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
