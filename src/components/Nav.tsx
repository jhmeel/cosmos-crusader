import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Typography} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/Games';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InventoryIcon from '@mui/icons-material/Inventory';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styled from 'styled-components';

const StyledAppBar = styled(AppBar)`
  background: rgba(19, 26, 42, 0.8);
  backdrop-filter: blur(10px);
`;

const NavButton = styled(IconButton)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a0a0a0;
  &.active {
    color: #00ff9d;
  }
`;

const NavLabel = styled(Typography)`
  font-size: 0.7rem;
  margin-top: 4px;
`;

const Navigation: React.FC = () => {
  return (
    <StyledAppBar position="fixed" color="default" sx={{ top: 'auto', bottom: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-around' }}>
        <NavButton component={Link} to="/game" className={window.location.pathname === '/game' ? 'active' : ''}>
          <GamesIcon />
          <NavLabel>Game</NavLabel>
        </NavButton>
        <NavButton component={Link} to="/marketplace" className={window.location.pathname === '/marketplace' ? 'active' : ''}>
          <StorefrontIcon />
          <NavLabel>Market</NavLabel>
        </NavButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navigation;