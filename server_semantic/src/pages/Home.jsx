import * as React from 'react';
import { Container } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth='xl'>
      <h1>Grand Unified Track Browser</h1>
      <h2>What is it?</h2>
      <p>The Grand Unified Track Browser (or GUTB), is used to explore "wide data". "Wide data" are datasets with many items, but with a relatively small domain for each item. That is, the x-axis of a visualisation is sigficantly greater than the y-axis.</p>
      <p>Examples of this type of data are genomic information, time series data, and unbinned temperature data.</p>
      <p>Many visual analytics tasks with wide data involve comparisons between two datasets, such as searching for a correlation, the same or different value, trends, or even absolute values on some attribute. Additionally, any of these comparisons may need to be performed within a subset of the data, meaning that datasets may need to be compared at different (potentially multiple) locations and scales.</p>
      <p>Some example tasks from realistic scenarios:</p>
      <ul>
        <li>Whether environmental factors such as temperature and humidity appear to have a leading effect on crime incidence</li>
        <li>Whether the density of repeats in a genome correlates with any other genomic information within that genome, or with repeats in other genomes, at any part of a chromosome</li>
        <li>Whether users show similar patterns of behavior in their activities with a system</li>
      </ul>
      <p>Any of these comparisons could be done algorithmically, but because user's don't know in advance which comparisons need to be done, it is useful to be able to carry out many lightwiehgt analyses visually and quickly as part of exploration.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus nulla excepturi facilis eligendi velit perspiciatis libero. Quam voluptatem hic assumenda provident explicabo nam aspernatur nulla accusantium placeat nemo natus rerum laborum voluptas veritatis tenetur, expedita blanditiis reprehenderit quod, adipisci reiciendis. Nesciunt esse architecto necessitatibus fugiat enim recusandae labore rem adipisci, illo aut eius, autem porro voluptate assumenda facilis hic odit.</p>
    </Container>
  );
}
