import PropTypes from 'prop-types'
import styled from "styled-components"
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, IconButton, Menu as MuiMenu, MenuItem } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import MenuIcon from "@mui/icons-material/Menu"
import { logout } from "../redux/userSlice"
import { openSignin } from '../redux/setSigninSlice'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useNavigate } from 'react-router-dom'
import { openSnackbar } from '../redux/snackbarSlice'
import { LogoutOutlined } from '@mui/icons-material'

const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 16px 40px;
  align-items: center;
  box-sizing: border-box;
  color: ${({ theme }) => theme.text_primary};
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.bgMedium};
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);
  @media (max-width: 768px) {
      padding: 16px;
    }
`;

const ButtonDiv = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  width: 100%;
  max-width: 70px;
  border-radius: 8px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.8rem;
  gap: 6px;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.primary};
  &:hover{
    background-color: ${({ theme }) => theme.bg};
  }
`;

const Welcome = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const IcoButton = styled(IconButton)`
  color: ${({ theme }) => theme.text_secondary} !important;
`;

const Elements = styled.div`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_secondary};
  border-radius: 4px;
  width: 100%;
  max-width: 70px;
  padding: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover{
    background-color: ${({ theme }) => theme.text_secondary + 10};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const RightDiv = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const SearchBar = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  &:hover{
    background-color: ${({ theme }) => theme.text_secondary + 10};
    color: ${({ theme }) => theme.text_primary};
  }
`;

const InteractiveButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StyledMenu = styled(MuiMenu)`
  & .MuiPaper-root {
    padding: 10px;
    font-size: 12px;
    background-color: ${({ theme }) => theme.bgMedium}; 
    color: ${({ theme }) => theme.text_secondary}; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    border-radius: 8px; 
  }
`;

const StyledMenuItem = styled(MenuItem)`
  padding: 10px;
  gap: 8px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};  
    border-radius: 4px; 
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: inherit;
`;

const Navbar = ({ menuOpen, setMenuOpen, darkMode, setDarkMode }) => {

  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    dispatch(logout())
    dispatch(
      openSnackbar({
        message: "Adios, vuelve pronto!",
        severity: "success",
      })
    )
    navigate('/')
    handleMenuClose()
  }

  return (
    <NavbarDiv>
      <IcoButton aria-label='Abrir menú' onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </IcoButton>
      <RightDiv>
        <InteractiveButtons>
          <Link to='/search' aria-label='Buscar'>
            <SearchBar>
              <SearchRoundedIcon />
            </SearchBar>
          </Link>
          {
            darkMode ?
              <>
                <Elements onClick={() => setDarkMode(false)} aria-label='Cambiar a modo claro'>
                  <LightModeRoundedIcon />
                </Elements>
              </>
              :
              <>
                <Elements onClick={() => setDarkMode(true)} aria-label='Cambiar a modo oscuro'>
                  <DarkModeRoundedIcon />
                </Elements>
              </>
          }
        </InteractiveButtons>
        {
          currentUser ? <>
            <Welcome>
              Hola, {currentUser.name}!
            </Welcome>
            <Link>
              <Avatar alt={`Avatar de ${currentUser.name}`} onClick={handleMenuOpen} src={currentUser.img}>
                {currentUser.name.charAt(0).toUpperCase()}
              </Avatar>
            </Link>
            <StyledMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              aria-label='Menu de usuario'
            >
              <StyledMenuItem onClick={handleMenuClose}>
                <StyledLink to='/profile'>
                  <PersonIcon style={{ fontSize: "16px" }} />
                  Ir a perfil
                </StyledLink>
              </StyledMenuItem>
              <StyledMenuItem onClick={handleLogout}>
                <LogoutOutlined style={{ fontSize: "16px" }} />
                Cerrar sesión
              </StyledMenuItem>
            </StyledMenu>
          </>
            :
            <ButtonDiv onClick={() => dispatch(openSignin())}>
              <PersonIcon style={{ fontSize: "18px" }} />
              Login
            </ButtonDiv>
        }
      </RightDiv>
    </NavbarDiv>
  )
}

export default Navbar

Navbar.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  setMenuOpen: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
}