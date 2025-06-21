import * as React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { Container } from "@mui/material";


export default function ContainerWrapper({toggleTheme, isDark}) {

  return (
    <div>
      <NavBar toggleTheme={toggleTheme} isDark={isDark}/>
      <Container maxWidth='false'>
        <Outlet /> 
        <Footer isDark={isDark}/>
      </Container>

     
    </div>
  );
}
