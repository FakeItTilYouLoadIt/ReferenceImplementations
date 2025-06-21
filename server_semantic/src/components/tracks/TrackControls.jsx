
import React, { useEffect, useRef, useState } from 'react';
import { FormControl, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material'
import { IconButton, Button, Box, MenuItem, Checkbox, ListItemText, Chip } from "@mui/material"
import { deepOrange } from '@mui/material/colors';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Slider, { SliderTooltip } from 'rc-slider';
import Select from 'react-select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';



function TrackControls(props) {


  const trackType = props.trackType;
  const repeatOptions = props.repeatOptions;
  const handleRepeatSelection = props.handleRepeatSelection;

  const [selectedRepeats, setSelectedRepeats] = useState([])
  // const [repeatOptions, setRepeatOptions] = useState(props.repeatOptions)
  const [openDialog, setOpenDialog] = useState(false)



  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };



  // useEffect(() => {
  //   setRepeatOptions(props.repeatOptions)
  // }, [props.repeatOptions])

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpenDialog(false);
    }
  };
  // const customStyles = {
  //   // menu: (provided, state) => ({
  //   //     ...provided,
  //   //   })
  //   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...styles,
  //       backgroundColor: 'white',
  //       color: data.color,

  //       //   zIndex: 9999

  //       //   width: 200
  //     };
  //   }
  // };

  const extraStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: 0
    }),
    input: (provided, state) => ({
      ...provided,
      margin: 0,
      padding: 0
    }),
    menu: (provided, state) => ({
      ...provided,
      marginTop: 0,
      paddingTop: 0
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: 'white',
        color: data.color,

        //   zIndex: 9999

        //   width: 200
      };
    }

  };



  // const buttonHeight = props.height/3
  const renderTrack = props.renderTrack;
  let subGenomes = "N/A";

  if (renderTrack == "stackedTrack") {

    subGenomes = props.subGenomes;
    const [selectedSG, setSelectedSG] = props.activeSubGenome;
  }


  const [showDiv, setShowDiv] = useState(false);

  // const handleButtonClick = () => {
  //     console.log("SKRR")
  //   setShowDiv(true);
  // };

  // const handleDivClose = () => {
  //   setShowDiv(false);
  // };

  const handleSelectChange = (event) => {
    props.updateActiveSubgenome(event.target.value);
  };

  // let localSGValues= {};


  // const { Handle } = Slider;

  // const handle = props => {
  //     const { value, dragging, index, ...restProps } = props;
  //     return (
  //       <SliderTooltip
  //         prefixCls="rc-slider-tooltip"
  //         overlay={`${value} %`}
  //         visible={dragging}
  //         placement="top"
  //         key={index}
  //       >
  //         <Handle value={value} {...restProps} />
  //       </SliderTooltip>
  //     );
  //   };

  // const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  // const changeSG = (className, value)=>{



  //     let SG= className;

  //     let valuesAll = localSGValues;
  //     // this.setState(prevState => ({
  //     //     localSGValues:{
  //     //         ...prevState.localSGValues,
  //     //         [SG]: value
  //     //     }
  //     //     }));
  //     valuesAll[SG] = value;
  //     let totalSGVal = sumValues(valuesAll);


  //     if (totalSGVal>100){
  //         let newvalue = value  - (totalSGVal - 100);

  //         localSGValues[SG] = newvalue;
  //         // this.setState(prevState => ({
  //         //     localSGValues:{
  //         //         ...prevState.localSGValues,
  //         //         [SG]: newvalue
  //         //     }
  //         //     }));

  //     }else{
  //         localSGValues[SG] = value;
  //         // this.setState(prevState => ({
  //         //     localSGValues:{
  //         //         ...prevState.localSGValues,
  //         //         [SG]: value
  //         //     }
  //         //     }));
  //     }


  // }

  // const handleThresholdChange = ()=>{
  //     handleDivClose();
  //     let SubGenomeThreshold = localSGValues;

  //     props.updateSGThreshold(SubGenomeThreshold)
  // }

  // let elements = [];

  // for (let i = 0; i < subGenomes.length; i++) {
  //     elements.push(<div key={i} className='inner-span-text' id={"SEEE"+i}>
  //     <b className="percent-subgenome-text" >{subGenomes[i]}</b>
  //     <Slider className={subGenomes[i]} key={i} id={subGenomes[i]+"sortingPercent"}  min={0} max={100} defaultValue={0} value={localSGValues[subGenomes[i]]}  handle={handle} 
  //     onChange={(value) => {
  //         changeSG(subGenomes[i], value);
  //       }}/>
  //     </div>)
  //     }


  const customStyles = {
    // menu: (provided, state) => ({
    //     ...provided,
    //   })
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: props.isDark ? "#121212" : 'white',
          color: data.color,
        };
      }
  };


  const color = props.isDark ? deepOrange[500] : deepOrange[100]
  const highlight = props.isDark ? deepOrange[200] : deepOrange[500]
  if (trackType == "repeats") {
    console.log(repeatOptions.map((repeat) => {
      return (<MenuItem
        key={repeat.label}
        value={repeat.label}
      >
        {repeat.label}
      </MenuItem>)
    }))
  }


  return (
    <Stack marginTop={-props.gap + "px"} marginBottom={"0px"} alignItems={"flex-end"} style={{ float: "right" }}>


      {trackType === "repeats"
        ? <IconButton className='trackButtons' id={"repeatSelections_" + props.id} onClick={handleClickOpen} sx={{
          backgroundColor: color,
          borderRadius: 1,
          // height: buttonHeight,
          '&:hover': {
            backgroundColor: highlight
          },
          zIndex: 2
        }}
        >
          <MultilineChartIcon fontSize="small" className="handle_image" />
        </IconButton> : <IconButton className='trackButtons' id={"toggleTrackType_" + props.id} sx={{
          backgroundColor: color,
          borderRadius: 1,
          // height: buttonHeight,
          '&:hover': {
            backgroundColor: highlight
          },
          zIndex: 2
        }}
        >
          <MultilineChartIcon fontSize="small" className="handle_image" />
        </IconButton>
      }
      <IconButton className='trackButtons' id={"deleteTrack_" + props.id} sx={{
        backgroundColor: color,
        borderRadius: 1,
        // height: buttonHeight,
        '&:hover': {
          backgroundColor: highlight
        },
        zIndex: 2
      }}
      >
        <RemoveCircleOutlineIcon fontSize="small" className="handle_image" />
      </IconButton>


      {renderTrack === "stackedTrack"
        ? <select id="selectOption" onChange={handleSelectChange}>
          <option value="">-</option>
          {subGenomes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>


        : <IconButton className='trackButtons' id={"pickColor_" + props.id} sx={{
          backgroundColor: color,

          borderRadius: 1,
          // height: buttonHeight,
          '&:hover': {
            backgroundColor: highlight
          },
          zIndex: 2
        }}>
          <ColorLensIcon fontSize="small" className="handle_image" />
        </IconButton>
      }
      {trackType == "repeats" ?
        <Dialog disableEscapeKeyDown open={openDialog} onClose={handleClose}>
          <DialogTitle>Select Repeats</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <FormControl sx={{ m: 1, minWidth: 240, minHeight: 300 }} id={'repeat'}>
                <span>
                  <Select
                  onChange={handleRepeatSelection}
                    options={repeatOptions}
                    isMulti
                    styles={customStyles}
                    />

                </span>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog> : <></>}
    </Stack>

  )
}

export default TrackControls
