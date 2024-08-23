import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from "react"
import { useSelector } from 'react-redux'
import styled from "styled-components"
import Avatar from '@mui/material/Avatar'
import { getUsers } from '../api/index'
import { PodcastCard } from '../components/PodcastCard.jsx'
import { Link } from 'react-router-dom'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';

const ProfileAvatar = styled.div`
  padding-left:3rem;
  @media (max-width: 768px) {
    padding-left:0rem;
    }
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
      align-items: center;
    }
`;

const ProfileName = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size:34px;
  font-weight:500;
`;

const Profile_email = styled.div`
  color:#2b6fc2;
  font-size:14px;
  font-weight:400;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${({ box, theme }) => box && `
  background-color: ${theme.bg};
    border-radius: 10px;
    padding: 20px 30px;
  `}
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// const Span = styled.span`
//     color: ${({ theme }) => theme.text_secondary};
//     font-size: 16px;
//     font-weight: 400;
//     cursor: pointer;
//     color: ${({ theme }) => theme.primary};
//     &:hover{
//       transition: 0.2s ease-in-out;
//     }
// `;

const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  @media (max-width: 550px){
    justify-content: center;
  }
`;

const ProfileMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserDetails = styled.div`
  display flex;
  gap: 20px;
  @media (max-width: 768px) {
      width: fit-content;
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: center;
  }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ButtonContainer = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  width: 100%;
  border-radius: 4px;
  max-width: 70px;
  padding: 10px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:  ${({ theme }) => theme.bg};
  gap: 6px;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.primary};
  &:hover{
    background-color: ${({ theme }) => theme.text_secondary + 50};
  }
`;

const Elements = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color:  ${({ theme }) => theme.text_secondary};
  width: 100%;
  }
`;

const UploadContainer = styled.div`
  display: flex;
  width: 50%;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  ${({ box, theme }) => box && `
  background-color: ${theme.bgMedium};
    border-radius: 10px;
    padding: 20px 30px;
  `}
`;

const SubTopic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddContentContainer = styled.div`
  display: flex;
  gap: 12px;
`;

const Profile = ({ setUploadOpen, setAddEpisodeOpen }) => {
  const [user, setUser] = useState()
  const { currentUser } = useSelector(state => state.user)
  const [name, setName] = useState("")

  const token = localStorage.getItem("indiepodcasttoken")

  const getUser = useCallback(async () => {
    try {
      const res = await getUsers(token)
      setName(res.data.name)
      setUser(res.data);
    } catch (error) {
      console.log(error)
    }
  }, [token])

  useEffect(() => {
    if (currentUser) {
      getUser();
    }
  }, [getUser, currentUser])

  return (
    <ProfileMain>
      <UserDetails>
        <ProfileAvatar>
          <Avatar sx={{ height: 125, width: 125, fontSize: '24px' }} src={user?.img}>{user?.name.charAt(0).toUpperCase()}</Avatar>
        </ProfileAvatar>
        <ProfileContainer>
          <ProfileName>{name}</ProfileName>
          <Profile_email>Email: {user?.email}</Profile_email>
        </ProfileContainer>
      </UserDetails>
      {currentUser && user?.podcasts.length > 0 &&
        <FilterContainer box={true}>
          <Topic>Tus podcasts
          </Topic>
          <Podcasts>
            {user?.podcasts.map((podcast) => (
              <PodcastCard podcast={podcast} key={podcast._id} user={user} />
            ))}
          </Podcasts>
        </FilterContainer>
      }
      <AddContentContainer>
        <UploadContainer box={true} >
          <SubTopic>Nuevo Podcast</SubTopic>
          <Container>
            <ButtonContainer>
              {currentUser && (
                <Link
                  onClick={() => setUploadOpen(true)}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Elements>
                    <UploadRoundedIcon />
                    Subir
                  </Elements>
                </Link>
              )}
            </ButtonContainer>
          </Container>
        </UploadContainer>
        <UploadContainer box={true} >
          <SubTopic>Nuevo Epidosio</SubTopic>
          <Container>
            <ButtonContainer>
              {currentUser && (
                <Link
                  onClick={() => setAddEpisodeOpen(true)}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Elements>
                    <UploadRoundedIcon />
                    Subir
                  </Elements>
                </Link>
              )}
            </ButtonContainer>
          </Container>
        </UploadContainer>
      </AddContentContainer>
    </ProfileMain>
  )
}

export default Profile

Profile.propTypes = {
  setUploadOpen: PropTypes.func.isRequired,
  setAddEpisodeOpen: PropTypes.func.isRequired,
}