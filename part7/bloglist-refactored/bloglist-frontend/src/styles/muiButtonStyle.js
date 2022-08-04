// import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom'


const MenuButton = styled(Button)(() => ({
  fontSize: '1rem',
  color: '#fff',
  padding: 5,
  '& a': {
    textDecoration: 'underline',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 5
  }
}));

export default function StyledCustomization(props) {
  return (
    <MenuButton>
      <Link to={props.path}>{props.label}</Link>
    </MenuButton>
  )
}