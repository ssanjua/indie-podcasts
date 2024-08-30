import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { openPlayer } from '../redux/audioplayerSlice'
import { addView } from '../api'
import { IconButton } from '@mui/material'
import { openSnackbar } from '../redux/snackbarSlice'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import { DialogPopUp } from './DialogPopUp'
import { deleteEpisode } from '../api'

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding: 20px 30px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.card};
  &:hover{
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.1);
  }
  @media (max-width: 768px){
    flex-direction: column; 
    align-items: flex-start;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};  
  object-fit: cover;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  display: flex;
  align-items: center; gap: 10px;
  justify-content: start;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const Delete = styled(IconButton)`
  color:white;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 80} !important;
  color: white !important;
    &:hover {
    background-color: ${({ theme }) => theme.primary + 95};
  }
`;

const Edit = styled(IconButton)`
color:white;
display: flex;
align-items: center;
background: ${({ theme }) => theme.text_secondary + 80} !important;
color: white !important;
  &:hover {
  background-color: ${({ theme }) => theme.primary + 95};
}
`;

const EditDeleteContainer = styled.div`
  gap: 6px;
  display: flex;
`;

const PlayButton = styled.button`
  background-color: ${({ theme }) => theme.bg};

  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.text_secondary} !important;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.bgMedium} !important;
  }
`;

const ButtonsContainer = styled.div`

`;

const Episodecard = ({ episode, podid, type, currentUser, index }) => {
  const dispatch = useDispatch()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const token = localStorage.getItem("indiepodcasttoken")

  const addviewtToPodcast = async () => {
    await addView(podid._id).catch((err) => {
      dispatch(
        openSnackbar({
          message: err.message,
          type: "error",
        })
      )
    })
  }

  const openConfirmDialog = () => {
    setConfirmOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmOpen(false)
  }

  const handleDeleteEpisode = async () => {
    try {
      const res = await deleteEpisode(episode._id, token)
      if (res.status === 200) {
        setConfirmOpen(false)
        dispatch(
          openSnackbar({
            message: 'Episodio eliminado correctamente.',
            severity: 'success',
          })
        )
      }
    } catch (err) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: 'error',
        })
      )
    }
  }

  return (
    <>
      <Card>
        <ImageContainer>
          <Image src={podid?.thumbnail} />
        </ImageContainer>
        <Details>
          <Title>{episode.name}
            {currentUser?._id === podid?.creator._id ? (
              <EditDeleteContainer>
                <Delete onClick={openConfirmDialog}>
                  <DeleteForeverRoundedIcon style={{ width: '22px', height: '22px' }} />
                </Delete>
                <Edit>
                  <EditRoundedIcon style={{ width: '22px', height: '22px' }} />
                </Edit>
              </EditDeleteContainer>
            ) : null} </Title>
          <Description>{episode.desc}</Description>
        </Details>
        <ButtonsContainer>
          <PlayButton onClick={async () => {
            await addviewtToPodcast();
            if (type === "audio") {
              //open audio player
              dispatch(
                openPlayer({
                  type: "audio",
                  episode: episode,
                  podid: podid,
                  index: index,
                  currenttime: 0
                })
              )
            } else {
              //open video player
              dispatch(
                dispatch(
                  openPlayer({
                    type: "video",
                    episode: episode,
                    podid: podid,
                    index: index,
                    currenttime: 0
                  })
                )
              )
            }
          }}>
            <PlayArrowRoundedIcon />
          </PlayButton>
        </ButtonsContainer>
      </Card>
      <DialogPopUp
        open={confirmOpen}
        title="¿Estás seguro de eliminar el episodio?"
        onConfirm={handleDeleteEpisode}
        onCancel={closeConfirmDialog}
      />
    </>
  )
}

export default Episodecard

Episodecard.propTypes = {
  episode: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
  podid: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    creator: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  type: PropTypes.string.isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  index: PropTypes.number.isRequired,
}
