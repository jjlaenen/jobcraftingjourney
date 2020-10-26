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
import alice from './alice-01.png';

export default function HintsJobDemandsAlice() {
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
          alt="Dave"
          className={classes.media}
          src={alice}
          sizes="100"
        />}
        label="Ask Alice for help"
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
              alt="Alice"
                className={classes.media}
                src={alice}
                sizes="100"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Alice the psychologist
            </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "I live alone in a large house. That means that there are a lot of chores to do. Additonally, the neighbour keeps yelling because my tree is too large. Therefore, I have added <strong>home maintenance</strong> and <strong>annoying neighbour</strong> to my home demands."
            </Typography>
              </CardContent>
          </div>
        </Fade>
      </Modal>
    </div>
  );

}