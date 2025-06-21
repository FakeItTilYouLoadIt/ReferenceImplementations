import { memo } from 'react'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit';
import BasicTrack from 'components/tracks/BasicTrack';
import OrthologLinks from 'components/tracks/OrthologLinks'
import ImageTrack from 'components/tracks/ImageTrack'
import { selectBasicTracks } from 'redux/slices/basicTrackSlice';
import { selectGenome } from 'redux/slices/genomeSlice';

/**
 * Used in conjunction with "CustomDragLayer" to render components while being dragged.
 */

export const DragPreview = memo(function DragPreview({ item, groupID, width, height, className, component, index, dragGroup, isDark }) {

  const basicTrackSelector = useSelector(selectBasicTracks)
  const genomeSelector = useSelector(selectGenome)

  if (component === "basic") {
    return (
      <div className={className}>
        <BasicTrack
          array={item.length < 4 ? genomeSelector[item].array : genomeSelector[item.substring(0, 3)].array}
          color={basicTrackSelector[item].color}
          id={nanoid() + "preview"}
          zoom={basicTrackSelector[item].zoom}
          pastZoom={basicTrackSelector[item].pastZoom}
          offset={basicTrackSelector[item].offset}
          height={height / 2}
          noScale={true}
          trackType={basicTrackSelector[item].trackType}
        // isDark={false}
        // normalize={false}

        />
      </div>
    )
  }
  else if (component === "OrthologLinks") {
    return <OrthologLinks index={index} dragGroup={dragGroup}></OrthologLinks>
  }
  else if (component === "bitmap") {

    let suffix = isDark ? "_track_dark" : "_track"
    let location = 'https://hci-sandbox.usask.ca/image-server/'
 
    let directoryName, fileName, designation, image
    let split_id = item.split("_")
    if (split_id[1].includes("at")) {
      designation = "at_coordinate/" + split_id[1]
      directoryName = "at_coordinate"
      fileName = split_id[1]
    }
    else if (split_id[0].includes("bn")) {
      designation = `${split_id[0].replace("-", "_")}/${split_id[1]}`
      directoryName = `${split_id[0].replaceAll("-", "_")}`
      fileName = split_id[1]
      
  
    }
    else if (split_id[1].includes("hb")) {
      directoryName = `ta_hb_coordinate`
      // debugger
      // directoryName = `${split_id[0].replace("-", "_")}`
      fileName = split_id[0] + split_id[2].split("coordinate")[1]
    }
    else if (split_id[0].includes("all") || split_id[0].includes("leaf") || split_id[0].includes("seed")) {
     
      directoryName = `topas/${split_id[0].replaceAll("-", "_")}`
      fileName = split_id[1]
  
    }
    else if (item.includes("N-METHYL")) {
  
      designation = "bn_methylation_100k/" + split_id[1]

      directoryName = "bn_methylation_100k"
      fileName =  split_id[1]
    }
    else if (item.includes("rna")) {
      designation = `bn_${split_id[0]}_100k/${split_id[1]}`
      directoryName = `bn_${split_id[0]}_100k`
      fileName = split_id[1]
    }
    let darkModifier = isDark ? "_dark" : ""
    switch (basicTrackSelector[item].trackType){
      case "heatmap":
        suffix = "_heatmap"
        break
      case "histogram":
        suffix = "_histogram"
        break
      default:
        suffix ="_track"
    }
    suffix += darkModifier
    // image = location + directoryName + fileName + suffix + ".webp"
    image = `${location}${directoryName}/${fileName}${suffix}.webp`
    return (
      <ImageTrack
        image={[image]}
        id={item}
        zoom={basicTrackSelector[item].zoom}

        offset={basicTrackSelector[item].offset}
        // cap={cap}
        color={basicTrackSelector[item].color}
      />
    )
  }
  else {
    return (<></>)
  }


})