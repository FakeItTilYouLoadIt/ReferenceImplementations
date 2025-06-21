import * as React from 'react';
import { Container } from "@mui/material";

export default function Documentation() {
  return (
    <Container maxWidth='xl'>
      <h2>Documentation</h2>
<h3>Intended Uses</h3>


<p>The Grand Unified Track Browser (GUTB) is a visualisation tool intended to be used to visualise wide one-dimensional data. The primary use so far has been to visualise 'omics data (gene density, methylation, etc). A working version of the GUTB can be found at https://genomevis.usask.ca/guob/ .</p>

<p>The various track components can be used to visualise other sets of data as well.</p>

      <p>The GUTB has been built with React/Redux, and incorporates the <a href="https://github.com/kiranbandi/GroupwareToolkitClient" style={{color: "green",}}>Groupware Toolkit</a> for real-time collaboration.</p>

<h3>Features</h3>
<h4>Multiple Track Types</h4>
<p>The GUTB supports several track types, rendering datasets procedurally as a line graph, histogram, bar-chart, scatter plot, or heatmap.</p>
<p>If self-hosting, there is another track type configured to use pre-rendered images, for faster load times.</p>
      <img src="track_types.gif" style={{width: "inherit",}}/>

<h4>Linkages</h4>
      <p>The GUTB supports synteny linkages like those found in <a href="https://synvisio.github.io/#/" style={{color: "green",}}>Synviso</a>, to visualise relations between data points.</p>
      <img src="synvisio_links.gif" style={{width: "inherit",}}/>

<h4>Interactive</h4>
<p>The GUTB is fully interactive, supporting modern interaction techniques, such as zooming, panning and dragging to re-arrange tracks.</p>
      <img src="draggable.gif" style={{width: "inherit",}}/>

<h4>Annotation</h4>
<p>The GUTB supports annotating track positions, so the user is able to make note of important data points or regions and can easily compare them against other areas.</p>
      <img src="annotations.gif" style={{width: "inherit",}}/>


<h4>Search</h4>
<p>Find important areas instantly with the search feature.</p>

<h4>Split View</h4>
<p>Compare different areas of the same dataset.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. At, necessitatibus perferendis saepe sapiente quos delectus alias ducimus voluptate repudiandae soluta!`Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque cupiditate tempora reprehenderit, modi repudiandae sunt placeat assumenda dolore voluptatum iusto!</p>
    </Container>
  );
}
