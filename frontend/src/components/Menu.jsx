import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { logout } from "../redux/userSlice"
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import BackupRoundedIcon from '@mui/icons-material/BackupRounded'
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import LogoIcon from '/podcastindex.svg'
import { openSignin } from '../redux/setSigninSlice'
import AnnouncementRoundedIcon from '@mui/icons-material/AnnouncementRounded';


const MenuContainer = styled.div`
  flex: 0.5;
  flex-direction: column;
  height: 100vh;
  padding: 8px;
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 1000;
    width: 100%;
    max-width: 250px;
    left: ${({ setMenuOpen }) => (setMenuOpen ? "0" : "-100%")};
    transition: 0.3s ease-in-out;
  }
`;

const Elements = styled.div`
  padding: 4px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color:  ${({ theme }) => theme.text_secondary};
  width: 100%;
  &:hover{
    background-color: ${({ theme }) => theme.text_secondary + 50};
  }
`;

const NavText = styled.div`
  padding: 12px 0px;
`;

const HR = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.text_secondary + 50};
  margin: 10px 0px;
`;

const Flex = styled.div`
  justify-content: space-between;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  width: 86%;
`;

const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: bold;
  font-size: 20px;
  margin: 16px 0px;
`;

const Image = styled.img`
  height: 40px;
`;


const Menu = ({ setMenuOpen, setUploadOpen }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const logoutUser = () => {
    dispatch(logout());
    navigate(`/`);
  };

  return (
    <MenuContainer setMenuOpen={setMenuOpen}>
      <Flex>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Image src={LogoIcon} />
            indiePodcasts
          </Logo>
        </Link>
        <Close>
          <CloseRounded onClick={() => setMenuOpen(false)} style={{ cursor: "pointer" }} />
        </Close>
      </Flex>
      <Link to='/search' style={{ textDecoration: "none", color: "inherit", width: '100%' }}>
        <Elements>
          <SearchRoundedIcon />
          <NavText>Buscar</NavText>
        </Elements>
      </Link>
      <Link to='/' style={{ textDecoration: "none", color: "inherit", width: '100%' }}>
        <Elements>
          <HomeRoundedIcon />
          <NavText>Explorar</NavText>
        </Elements>
      </Link>
      {
        currentUser ?
          <Link to='/favourites' style={{ textDecoration: "none", color: "inherit", width: '100%' }}>
            <Elements>
              <FavoriteRoundedIcon />
              <NavText>Te gustan</NavText>
            </Elements>
          </Link >
          :
          <Link onClick={() =>
            dispatch(
              openSignin()
            )
          } style={{ textDecoration: "none", color: "inherit", width: '100%' }}>
            <Elements>
              <FavoriteRoundedIcon />
              <NavText>Te gustan</NavText>
            </Elements>
          </Link >
      }
      <Link to='/' style={{ textDecoration: "none", color: "inherit", width: '100%' }}>
        <Elements>
          <AnnouncementRoundedIcon />
          <NavText>Novedades</NavText>
        </Elements>
      </Link>
      <HR />
      {currentUser && (
        <Link
          onClick={() => setUploadOpen(true)}
          style={{ textDecoration: "none", color: "inherit", width: '100%' }}
        >
          <Elements>
            <BackupRoundedIcon />
            <NavText>Subir</NavText>
          </Elements>
        </Link>
      )}
      {
        currentUser ?
          <Elements onClick={() => logoutUser()}>
            <ExitToAppRoundedIcon />
            <NavText>Log out</NavText>
          </Elements>

          :
          <Elements onClick={() => dispatch(openSignin())}>
            <ExitToAppRoundedIcon />
            <NavText>Login</NavText>
          </Elements>
      }
    </MenuContainer >
  )
}

export default Menu

Menu.propTypes = {
  setMenuOpen: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
  setUploadOpen: PropTypes.func.isRequired,
}