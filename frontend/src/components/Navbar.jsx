import PropTypes from 'prop-types'
import styled from "styled-components"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import MenuIcon from "@mui/icons-material/Menu"
import { IconButton } from "@mui/material"
import { openSignin } from '../redux/setSigninSlice'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'


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
  font-size: 18px;
  font-weight: 600;
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
  // border: 1px solid ${({ theme }) => theme.text_secondary};
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

const Navbar = ({ menuOpen, setMenuOpen, setUploadOpen, darkMode, setDarkMode }) => {

  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <NavbarDiv>
      <IcoButton aria-label='Abrir menú' onClick={() => setMenuOpen(!menuOpen)}>
        <MenuIcon />
      </IcoButton>
      {
        currentUser ?
          <Welcome>
            Hola, {currentUser.name}!
          </Welcome>
          :
          <>&nbsp;</>
      }
      <RightDiv>
        <Link to='/search' aria-label='Buscar'>
          <SearchBar>
            <SearchRoundedIcon  />
          </SearchBar>
        </Link>
        <Elements onClick={() => {
          if (currentUser) {
            setUploadOpen(true)
          } else {
            dispatch(
              openSignin()
            )
          }
        }}>
          <UploadRoundedIcon />
        </Elements>
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
        {
          currentUser ? <>
            <Link to='/profile' style={{ textDecoration: 'none' }}>
              <Avatar alt={`Avatar de ${currentUser.name}`} src={currentUser.img}>{currentUser.name.charAt(0).toUpperCase()}</Avatar>
            </Link>
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
  setUploadOpen: PropTypes.func.isRequired,
}