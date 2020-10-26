import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { useStyles } from '../../App/styleSheet';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import bob from './bob-01.png';

export default function HintsJobDemandsBob() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.hints}>
      <Chip
        avatar={<Avatar
          alt="Bob"
            className={classes.media}
            src={bob}
            sizes="100"
          />}
        label="Ask Bob for help"
        onClick={handleOpen}
        variant="outlined"
      />
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
              <Avatar
              alt="Contemplative Reptile"
                className={classes.media}
                src={bob}
                sizes="100"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Bob the construction worker
            </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "I am a construction worker. This requires me to lift a lot of heavy materials. I also have to wake up early, since I have to travel far. Therefore, I have added <strong>physical workload</strong>, and <strong>a lot of traveling</strong> to my job demands."
            </Typography>
              </CardContent>
          </div>
        </Fade>
      </Modal>
    </div>
  );

}