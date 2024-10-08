import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from "react"
import { useSelector } from 'react-redux'
import styled from "styled-components"
import Avatar from '@mui/material/Avatar'
import { getUsers } from '../api/index'
import { Link } from 'react-router-dom'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded'
import PodcastProfileCard from '../components/PodcastProfileCard.jsx'
import { CircularProgress } from '@mui/material'

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
      justify-content: center;
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
  ${({ box }) => box && `
    border-radius: 10px;
    padding: 10px 20px;
  `}
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  margin-left: 10px;
  justify-content: space-between;
  align-items: center;
  @maedia (max-width: 768px){
    font-size: 18px;
  }
`;

const Podcasts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
  padding: 18px 6px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 550px) {
    grid-template-columns: (2, 1fr);
    padding: 18px 0px;
    gap: 6px;
  }
`;

const ProfileMain = styled.div`
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const UserDetails = styled.div`
  display flex;
  padding: 20px 30px;
  gap: 20px;
  @media (max-width: 768px) {
    width: fit-content;
    display: flex;
    flex-direction: column;
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
  border-radius: 16px;
  max-width: 70px;
  padding: 10px 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:  ${({ theme }) => theme.bg};
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
  color: ${({ theme }) => theme.text_primary};
  }
`;

const UploadContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  justify-content: center;
  ${({ box, theme }) => box && `
  // background-color: ${theme.bgMedium};
    border-radius: 10px;
  `}
`;

const AddContentContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 1rem;
  padding-left:3rem;
  @media (max-width: 768px) {
    padding-left:0rem;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  @media (max-width: 768px) {
    width: fit-content;
    display: flex;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
`;

const Profile = ({ setUploadOpen, setAddEpisodeOpen }) => {
  const [user, setUser] = useState()
  const { currentUser } = useSelector(state => state.user)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState()

  const token = localStorage.getItem("indiepodcasttoken")

  const getUser = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers(token)
      setName(res.data.name)
      setUser(res.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [token])

  const handleDeletePodcast = (podcastId) => {
    setUser(prevUser => ({
      ...prevUser,
      podcasts: prevUser.podcasts.filter(podcast => podcast._id !== podcastId)
    }));
  }

  useEffect(() => {
    if (currentUser) {
      getUser();
    }
  }, [getUser, currentUser])

  return (
    <ProfileMain>
      {loading ?
        <Loader>
          <CircularProgress />
        </Loader>
        :
        <>
          <UserDetails>
            <UserContainer>
              <ProfileAvatar>
                <Avatar sx={{ height: 125, width: 125, fontSize: '24px' }} src={user?.img}>{user?.name.charAt(0).toUpperCase()}</Avatar>
              </ProfileAvatar>
              <ProfileContainer>
                <ProfileName>{name}</ProfileName>
                <Profile_email>Email: {user?.email}</Profile_email>
              </ProfileContainer>
            </UserContainer>
            <AddContentContainer>
              <UploadContainer box={true} >
                <Container>
                  <ButtonContainer>
                    {currentUser && (
                      <Link
                        onClick={() => setUploadOpen(true)}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Elements>
                          <UploadRoundedIcon />
                          Nuevo Podcast
                        </Elements>
                      </Link>
                    )}
                  </ButtonContainer>
                </Container>
              </UploadContainer>
              <UploadContainer box={true} >
                <Container>
                  <ButtonContainer>
                    {currentUser && (
                      <Link
                        onClick={() => setAddEpisodeOpen(true)}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Elements>
                          <UploadRoundedIcon />
                          Nuevo Episodio
                        </Elements>
                      </Link>
                    )}
                  </ButtonContainer>
                </Container>
              </UploadContainer>
            </AddContentContainer>
          </UserDetails>
          {currentUser && user?.podcasts.length > 0 &&
            <FilterContainer box={true}>
              <Topic>Tus podcasts</Topic>
              <Podcasts>
                {user?.podcasts.map((podcast) => (
                  <PodcastProfileCard
                    podcast={podcast}
                    key={podcast._id}
                    onDelete={handleDeletePodcast}
                  />
                ))}
              </Podcasts>
            </FilterContainer>
          }
        </>
      }
    </ProfileMain>
  )
}

export default Profile

Profile.propTypes = {
  setUploadOpen: PropTypes.func.isRequired,
  setAddEpisodeOpen: PropTypes.func.isRequired,
}