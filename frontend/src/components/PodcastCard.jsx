import { useEffect } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@mui/material/Avatar'
import styled from 'styled-components'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useState } from 'react'
import { IconButton } from '@mui/material'
import { favoritePodcast } from '../api'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { openSignin } from '../redux/setSigninSlice'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import OndemandVideoRoundedIcon from '@mui/icons-material/OndemandVideoRounded';


const PlayIcon = styled.div`
  padding: 10px;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: #fecd23 !important;
  color: white !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  position: absolute !important;
  top: 45%;
  right: 10%;
  display: none;
  transition: all 0.4s ease-in-out;
`;

const Card = styled(Link)`
  position: relative;
  text-decoration: none;
  background-color: ${({ theme }) => theme.card};
  max-width: 220px;
  height: 280px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  border-radius: 6px;  
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  &:hover{
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  &:hover ${PlayIcon}{
    display: flex;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  position: relative;
`;

const Title = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_primary};
`;

const Description = styled.div`
  overflow: hidden;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`

const CardImage = styled.img`
  object-fit: cover;
  width: 220px;
  height: 140px;
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  &:hover{
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }
`;

const CardInformation = styled.div`
  display:flex;
  align-items: flex-end;
  font-weight:450;
  padding: 14px 0px 0px 0px;
  width: 100%;
`;

const MainInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction:column;
  justify-content: flex-start;
  gap: 4px;
`;

const CreatorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 6px;
`;

const CreatorName = styled.div`
  font-size:12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text_secondary};
`;

// const TimePosted = styled.div`
//   color: ${({ theme }) => theme.text_secondary};
// `;

const Views = styled.div`
  font-size:10px;
  color: ${({ theme }) => theme.text_secondary};
  width: max-content;
`;

const Favorite = styled(IconButton)`
  color:white;
  top: 8px;
  right: 6px;
  padding: 6px !important;
  border-radius: 50%;
  z-index: 100;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 80} !important;
  color: white !important;
  position: absolute !important;
  backdrop-filter: blur(4px);
  // box-shadow: 0 0 16px 6px #222423 !important;
`;

export const PodcastCard = ({ podcast, user }) => {
  const [favourite, setFavourite] = useState(false)
  const dispatch = useDispatch()
  const token = localStorage.getItem("indiepodcasttoken")

  const favouritePodcast = async () => {
    try {
      const res = await favoritePodcast(podcast._id, token);
      if (res.status === 200) {
        setFavourite(!favourite);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (user?.favorits?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true);
    }
  }, [user, podcast._id])

  const { currentUser } = useSelector(state => state.user)

  return (
    <Card to={`/podcast/${podcast._id}`}>
      <div>
        <Top>
          <Link onClick={() => {
            if (!currentUser) {
              dispatch(
                openSignin()
              )
            } else {
              favouritePodcast()
            }
          }}>
            <Favorite >
              {favourite ?
                <FavoriteIcon style={{ color: "#E30022", width: '16px', height: '16px' }}></FavoriteIcon>
                :
                <FavoriteIcon style={{ width: '16px', height: '16px' }}></FavoriteIcon>
              }
            </Favorite>
          </Link>
          <CardImage src={podcast.thumbnail} />
        </Top>
        <CardInformation>
          <MainInfo>
            <Title>{podcast.name}</Title>
            <Description>{podcast.desc}</Description>
            <CreatorInfo>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar
                  src={podcast.creator.img} style={{ width: '26px', height: '26px' }}>{podcast.creator.name?.charAt(0).toUpperCase()}</Avatar>
                <CreatorName>
                  {podcast.creator.name}
                </CreatorName>

              </div>
              <Views>• {podcast.views} vistas</Views>
            </CreatorInfo>
          </MainInfo>
        </CardInformation>
      </div>
      <PlayIcon>
        {podcast?.type === 'video' ?
          <OndemandVideoRoundedIcon style={{ width: '28px', height: '28px' }} />
          :
          <HeadphonesIcon style={{ width: '28px', height: '28px' }} />
        }
      </PlayIcon>
    </Card>
  );
}

PodcastCard.propTypes = {
  podcast: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    creator: PropTypes.shape({
      img: PropTypes.string,
      name: PropTypes.string.isRequired,
    }).isRequired,
    views: PropTypes.number,
    type: PropTypes.string
  }).isRequired,
  user: PropTypes.shape({
    favorits: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired
    }))
  }).isRequired,
  setSignInOpen: PropTypes.func.isRequired
}
