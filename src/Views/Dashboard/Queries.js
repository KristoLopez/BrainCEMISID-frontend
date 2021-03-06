import React, { useEffect, Fragment } from 'react'
import {connect} from 'react-redux'
import { makeStyles, Button, IconButton, Grid, Card, Typography, Divider, TextField, DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/styles';
import CardList from '../../Components/CardList'
import EpisodeCard from '../../Components/EpisodeCard'
import {biology, cultural, feelings} from '../../Components/colors'
import { resizeImage, getBooleanArrayFromImageData, createImageFromBooleanArray, amplifyBooleanArrayImage, transformHexArrayToBooleanArray } from '../../Store/Actions/Project';
import { Recognize } from '../../Store/Actions/Stimulus';
import VisibilityIcon from '@material-ui/icons/Visibility';
import HearingIcon from '@material-ui/icons/Hearing';
import clsx from 'clsx'
import FavoriteIcon from '@material-ui/icons/Favorite';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import AdjustedCardList from '../../Components/AdjustedCardList';


const BiologySlider = withStyles({
  root: {
    color: '#54af98',
    height: 8,
    width: '80%',
    display: 'block',
    marginTop: '3em',
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const CulturalSlider = withStyles({
  root: {
    color: '#ef8e1e',
    height: 8,
    width: '80%',
    display: 'block',
    marginTop: '3em',
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const FeelingsSlider = withStyles({
  root: {
    color: '#d8b72f',
    height: 8,
    width: '80%',
    display: 'block',
    marginTop: '3em',
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const useStyles = makeStyles(theme=>({
  root: {
    padding: theme.spacing(4)
  },  
  canvas: {
    maxHeight: `${192}px`,
    height: `${192}px`,
    display: 'flex',
    width: `${192}px`,
    position: 'relative',
    borderRadius: theme.spacing(1),
    border: `2px #AAA solid`,
    alignSelf: 'flex-end',
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#DDD'
  },
  canvasWrapper: {
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    borderRadius: theme.spacing(1),
    
  },
  patternWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  patternText: {
    maxWidth: '50%',
    margin: theme.spacing(0,2),
    textAlign: 'center'
  },
  grid: {
    maxHeight: '85vh'
  },
  panelWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    maxHeight: '82vh',
    height: '100%',
    border: `2px ${theme.palette.primary.main} solid`,
    padding: theme.spacing(2)
  },
  card: {
    paddingTop: '100%'
  },
  button: {
    margin: theme.spacing(4,0)
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: theme.spacing(1)
  },
  labelIcon: {
    marginRight: theme.spacing(1)
  },
  bolder: {
    fontWeight: 500,
    margin: theme.spacing(1,0)
  },
  section: {
    margin:  theme.spacing(2,0)
  },
  biology: {
    color: biology,
  },
  cultural: {
    color: cultural,
  },
  feelings: {
    color: feelings
  },
  label: {
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center'
  },
  p80:{
    width: '80%',
    marginTop: theme.spacing(2)
  },
  innerGrid: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    margin: theme.spacing(2,0),
    alignItems: 'center',

  },
  previewImage: {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
  },
}))


const Queries = (props) => {

  const {bcf} = props;
  const [card, setCard] = React.useState(null)
  const [preview, setPreview] = React.useState(null)
  const [tolerance, setTolerance] = React.useState(0.1)
  const [colorLimit, setColorLimit] = React.useState(229.5)
  const [visualHearing, setVisualHearing] = React.useState(null)
  const [visualPattern, setVisualPattern] = React.useState(null)
  const [neuronSet, setNeuronSet] = React.useState([])
  const [miss, setMiss] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  useEffect(()=>{
    setOpen(false)
    setVisualHearing(null)
    setVisualPattern(null)
    if(card){
      resizeImage(card.image, 16, 16).then(response=>{
        let arr = getBooleanArrayFromImageData(response.imageData, card.tolerances)
        createImageFromBooleanArray(amplifyBooleanArrayImage(arr, 12, response.imageData.width, response.imageData.height),response.imageData.width*12, response.imageData.height*12).then(image=>{
          setPreview(image)
        })
      })
      setNeuronSet(card.class)
    }
  }, [card, tolerance])

  useEffect(()=>{
    if(props.recognizeStatus === 'success'){
      if(props.recognizeResult !== null){
        setMiss(false)
        console.log('HIT')
        const h_pattern = JSON.parse(props.recognizeResult.h_knowledge)._pattern
        const s_pattern = JSON.parse(props.recognizeResult.s_knowledge)._pattern
        const hBooleanArray = (amplifyBooleanArrayImage(transformHexArrayToBooleanArray(h_pattern), 12, 16, 16)) 
        const sBooleanArray = (amplifyBooleanArrayImage(transformHexArrayToBooleanArray(s_pattern), 12, 16, 16))
        let promises = []
        promises.push(createImageFromBooleanArray(hBooleanArray, 16*12, 16*12, {true: {r: 119, g: 221, b: 119}, false: {r: 239, g: 239, b: 239}})) 
        promises.push(createImageFromBooleanArray(sBooleanArray, 16*12, 16*12, {true: {r: 238, g: 154, b: 18}, false: {r: 239, g: 239, b: 239}}))
        Promise.all(promises).then(results=>{
          setVisualHearing(results[0])
          setVisualPattern(results[1])
          setOpen(true)
        })
      }else {
        console.log('MISS')
        setMiss(true)
        setOpen(true)
      }
    }
  }, [props.recognizeStatus])

  const create = (element) =>{
    setCard(element)
  }

  const handleConfirm = (e) =>{
    e.preventDefault();
    let data = {
      tolerances: card.tolerances
    }
    props.recognize(card, data)
  }

  const clean = (index) => (e) => {
    setCard(null)
  }

  const valuetext = (value) => {
    return `${value/100}`;
  }


  const neuronSetChanged = (e) => {
    setNeuronSet(e.target.value)
  }

  const handleClose = (e) => {
    setOpen(false)
  }

    const classes = useStyles();
    return (
        <div className={classes.root}>
          <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={8}>
          <Typography variant='h2' style={{fontSize: '2em', fontWeight: 400, margin: '0 0 1em 0'}}>Reconocimiento</Typography>
              <div className={classes.canvasWrapper}>
              <div className={classes.patternWrapper}>
                  <Typography className={classes.patternText}><VisibilityIcon/></Typography>
                  <div className={classes.canvas} id='canvas'>
                    {card && <EpisodeCard onStop={null} src={card.image} id={'selected-card'} onRemove={clean} zIndex={1}/>}
                  </div>
                </div>
              </div>
              {visualPattern && visualHearing && card && <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  Pensamiento:
                </DialogTitle>
                <DialogContent dividers>
                <div className={classes.section}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <div className={classes.wrapper}>
                      <VisibilityIcon className={classes.icon}/>
                      <img src={visualPattern}/>
                    </div>
                  </Grid>
                  <Grid item xs={4} className={classes.wrapper}>
                    <Typography className={classes.bolder}>Categoría</Typography>
                    <Typography>{props.recognizeResult && props.recognizeResult.h_knowledge ? JSON.parse(props.recognizeResult.h_knowledge)._class : ''}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.wrapper}>
                      <HearingIcon className={classes.icon}/>
                      <img src={visualHearing}/> 
                    </div>
                  </Grid>
                </Grid>
                </div>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>}
                {card && miss && <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  Pensamiento:
                </DialogTitle>
                <DialogContent dividers>
                <div className={classes.section}>
                <Typography>MISS: Patrón Visual no reconocido.</Typography>
                </div>
                </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={handleClose} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>}
              <Grid container spacing={2} className={classes.p80}>
                  <Grid item xs={12}>
                    <Divider/>
                  </Grid>
                  {card && <Fragment> <Grid item xs={12} className={classes.innerGrid}>
                    <Typography className={classes.bolder}>Previsualización del Patrón Neuronal</Typography>
                    <img src={preview} className={classes.previewImage}/>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider/>
                  </Grid>
                  </Fragment>}
                </Grid>
              <TextField
                className={classes.p80}
                onChange={neuronSetChanged}
                value={neuronSet}
                label='Conjunto Neuronal'
                variant='outlined'
              />
              <BiologySlider
                defaultValue={bcf.biology*100}
                value={bcf.biology*100}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-small-steps"
                disabled={true}
                marks={true}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
              <Typography className={clsx(classes.label, classes.biology)}><AccessibilityIcon className={classes.labelIcon}/>Biology: {Math.round(bcf.biology*100)/100}</Typography>
              <CulturalSlider
                defaultValue={bcf.culture*100}
                value={bcf.culture*100}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-small-steps"
                disabled={true}
                marks={true}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
              <Typography className={clsx(classes.label, classes.cultural)}><MenuBookIcon className={classes.labelIcon}/>Cultural: {Math.round(bcf.culture*100)/100}</Typography>
              <FeelingsSlider
                defaultValue={bcf.feelings*100}
                value={bcf.feelings*100}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider-small-steps"
                disabled={true}
                marks={true}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
              <Typography className={clsx(classes.label, classes.feelings)}><FavoriteIcon className={classes.labelIcon}/>Feelings: {Math.round(bcf.feelings*100)/100}</Typography>
              <Button onClick={handleConfirm} className={classes.button} variant='contained' color='primary'>Reconocer</Button>
            </Grid>
            <Grid item xs={4}>
              <Typography variant='h2' style={{fontSize: '2em', textAlign: 'center', fontWeight: 400, margin: '0 0 1em 0'}}>Imágenes Configuradas</Typography>
              <AdjustedCardList addRedirection={true} create={create}/>
            </Grid>
            
          </Grid>
        </div>
    )
}

const mapStateToProps = (state) =>{
  return ({
    cards: state.Project.cards,
    recognizeStatus: state.Stimulus.recognizeStatus,
    recognizeResult: state.Stimulus.recognizeResult,
    bcf: state.Project.internalState
  })
}

const mapDispatchToProps = (dispatch) =>{
  return({
    recognize: (card, data) => {
      console.log({card, data});
      dispatch(Recognize(card, data))
    },
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(Queries)
