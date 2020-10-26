import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    hintPanel: {
        maxWidth: 345,
      },
      media: {
        height: 140,
        objectFit: 'contain',
      },
    hints: {
        display: 'inline-block',
        '& > *': {
          margin: theme.spacing(0.5),
        },
      },
    bottomMargin:{
        marginBottom:'100px;'
    },
    buttonsAlign:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:'5px,'
    },
    closeButton: {
        float: 'right',
    },
    form: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    navigation: {
        width: "100%",
        position: "fixed",
        bottom: 0,
    },
    button: {
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    card: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom:'20px',
    },
    pos: {
        marginBottom: 6,
    },
    list: {
        flexGrow: 1,
        maxWidth: 1500,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
    },
    typography: {
        width: '100%',
        maxWidth: 500,
        textAlign: 'center',
    },
    expansionPanel: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '10px',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin:'20px',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export { useStyles };