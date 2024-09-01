import PropTypes from 'prop-types'
import styled from 'styled-components'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useState } from 'react';
import { DialogPopUp } from './DialogPopUp'
import { IconButton } from '@mui/material'
import { Link } from 'react-router-dom'
import { deletePodcast } from '../api'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { useDispatch } from "react-redux"
import { openSnackbar } from "../redux/snackbarSlice"

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

const Card = styled.div`
  position: relative;
  text-decoration: none;
  background-color: ${({ theme }) => theme.card};
  max-width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  border-radius: 6px;  
  box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
  &:hover{
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  &:hover ${PlayIcon}{
    display: flex;
  }
  @media (max-width: 550px) {
    padding: 8px;
    gap: 6px;
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
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

const CardImage = styled.img`
  object-fit: cover;
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
  &:hover{
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
  }
`;

const CardInformation = styled.div`
  display: flex;
  align-items: justify-end;
  font-weight: 450;
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

const Delete = styled(IconButton)`
  color:white;
  padding: 6px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 80} !important;
  color: white !important;
  &:hover{
    background: ${({ theme }) => theme.primary};
  }
`;

const Edit = styled(IconButton)`
  color:white;
  padding: 6px !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 80} !important;
  color: white !important;
`;

const GoToPodcast = styled(Link)`
  font-size: 12px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  width: 30%;
  max-width: 70px;
  border-radius: 16px;
  padding: 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_secondary};
  &:hover{
    background-color: ${({ theme }) => theme.text_secondary + 50};
  }
`;

const EditContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin-top: 16px
`;

const IconContainer = styled.div`
  display: flex;
  gap: 6px;
`;

const PodcastProfileCard = ({ podcast, onDelete }) => {
  const token = localStorage.getItem("indiepodcasttoken")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)

  const dispatch = useDispatch()

  const handleDelete = async () => {
    setIsConfirmLoading(true)
    try {
      const res = await deletePodcast(podcast._id, token);
      if (res.status === 200) {
        onDelete(podcast._id)
        setConfirmOpen(false)
        dispatch(
          openSnackbar({
            open: true,
            message: "Podcast eliminado con éxito!",
            severity: "success",
          })
        )
      }
    } catch (err) {
      console.log(err)
      dispatch(
        openSnackbar({
          open: true,
          message: "Error eliminando el podcast",
          severity: "error",
        })
      )
    } finally {
      setIsConfirmLoading(false)
      setConfirmOpen(false)
    }
  }

  const openConfirmDialog = () => {
    setConfirmOpen(true)
  }

  const closeConfirmDialog = () => {
    setConfirmOpen(false)
  }

  return (
    <>
      <Card>
        <div>
          <Top>
            <CardImage src={podcast.thumbnail} />
          </Top>
          <CardInformation>
            <MainInfo>
              <Title>{podcast.name}</Title>
            </MainInfo>
          </CardInformation>
          <EditContainer>
            <GoToPodcast to={`/podcast/${podcast._id}`}>
              Ver
            </GoToPodcast>
            <IconContainer>
              <Delete onClick={openConfirmDialog}>
                <DeleteForeverRoundedIcon />
              </Delete>
              <Edit to={`/podcast/edit/${podcast._id}`}>
                <EditRoundedIcon />
              </Edit>
            </IconContainer>
          </EditContainer>
        </div>
      </Card>
      <DialogPopUp
        open={confirmOpen}
        title="¿Estás seguro de eliminar el podcast?"
        onConfirm={handleDelete}
        onCancel={closeConfirmDialog}
        isLoading={isConfirmLoading}
      />
    </>
  );
}

PodcastProfileCard.propTypes = {
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
  onDelete: PropTypes.func.isRequired
}

export default PodcastProfileCard;

