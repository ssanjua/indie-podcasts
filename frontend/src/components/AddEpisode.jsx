import PropTypes from 'prop-types'
import { CloseRounded, CloudDoneRounded } from '@mui/icons-material'
import { CircularProgress, LinearProgress, Modal } from "@mui/material"
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getUsers } from '../api/index'
import styled from 'styled-components'
import { EpisodeSelectionCard } from './EpisodeSelectionCard.jsx'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import app from "../firebase"
import { useDispatch } from "react-redux"
import { openSnackbar } from "../redux/snackbarSlice"
import { addEpisodes } from '../api'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded'


const AddEpisode = ({ setAddEpisodeOpen }) => {
  const [userPodcasts, setUserPodcasts] = useState([]);
  const { currentUser } = useSelector(state => state.user)
  const [showEpisode, setShowEpisode] = useState(false)
  const [selectedPodcast, setSelectedPodcast] = useState(null)
  const [episode, setEpisode] = useState({
    name: "",
    desc: "",
    file: "",
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const token = localStorage.getItem("indiepodcasttoken")

  const goToAddEpisodes = () => {
    if (selectedPodcast) {
      setShowEpisode(true)
    }
  }

  const goToPodcast = () => {
    setShowEpisode(false)
  }

  const fetchUserPodcasts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers(token)
      setUserPodcasts(res.data.podcasts)
    } catch (error) {
      console.error('Error fetching user podcasts:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (currentUser) {
      fetchUserPodcasts();
    }
  }, [fetchUserPodcasts, currentUser])

  const uploadFile = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setEpisode((prevEpisode) => ({
          ...prevEpisode,
          file: {
            ...prevEpisode.file,
            uploadProgress: Math.round(progress),
          },
        }))
      },
      (error) => {
        console.error("Upload failed:", error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setEpisode((prevEpisode) => ({
            ...prevEpisode,
            file: {
              ...prevEpisode.file,
              url: downloadURL,
            },
          }))
        }).catch((error) => {
          console.error("Failed to get download URL:", error)
        })
      }
    )
  }

  const addEpisode = async () => {
    setLoading(true)
    const episodeData = [{ ...episode, podId: selectedPodcast._id }]
    console.log("enviando al backend:", episodeData)

    await addEpisodes(episodeData, token).then((res) => {
      console.log("Response from backend:", res)
      setAddEpisodeOpen(false)
      setLoading(false)
      dispatch(
        openSnackbar({
          open: true,
          message: "Episodio agregado con éxito!",
          severity: "success",
        })
      )
    }).catch((err) => {
      setLoading(false)
      console.log("Error from backend:", err)
      dispatch(
        openSnackbar({
          open: true,
          message: "Error agregando el episodio",
          severity: "error",
        })
      )
    })
  }

  return (
    <Modal open={true} onClose={() => setAddEpisodeOpen(false)}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: "absolute",
              top: "24px",
              right: "30px",
              cursor: "pointer",
            }}
            onClick={() => setAddEpisodeOpen(false)}
          />
          <Title>Añadir Episodio</Title>
          {!showEpisode ? (
            <>
              <SelectionContainer>
                {loading ? (
                  <LoadingContainer>
                    <CircularProgress color="inherit" />
                  </LoadingContainer>
                ) : (
                  userPodcasts.length > 0 ? (
                    userPodcasts.map((podcast) => (
                      <EpisodeSelectionCard
                        podcast={podcast}
                        key={podcast._id}
                        user={currentUser}
                        onClick={() => setSelectedPodcast(podcast)}
                        selected={selectedPodcast?._id === podcast._id}
                      />
                    ))
                  ) : (
                    <Label>No tienes podcasts creados.</Label>
                  )
                )}
              </SelectionContainer>
              <ButtonContainer>
                <ButtonDiv
                  button={true}
                  style={{ marginTop: "22px", marginBottom: "18px" }}
                  onClick={() => {
                    goToAddEpisodes()
                  }}
                  disabled={!selectedPodcast}
                >
                  Siguiente
                </ButtonDiv>
              </ButtonContainer>
            </>
          ) : (
            <>
              <Label>Detalles:</Label>
                      <FileUpload htmlFor="fileField">
                {episode.file.url ? (
                  <Uploading>
                    <div style={{ color: 'green', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                      <CloudDoneRounded sx={{ color: 'inherit' }} />
                      Archivo subido!
                    </div>
                  </Uploading>
                ) : (
                  <Uploading>
                    <UploadRoundedIcon />
                    Subí tu episodio
                    {episode.file.uploadProgress !== undefined && (
                      <>
                        <LinearProgress
                          sx={{ borderRadius: "10px", height: 3, width: "100%" }}
                          variant="determinate"
                          value={episode.file.uploadProgress}
                          color={"success"}
                        />
                        {episode.file.uploadProgress}% subido
                      </>
                    )}
                  </Uploading>
                )}
              </FileUpload>
              <File type="file" accept="audio/*|video/*" id="fileField"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setEpisode({ ...episode, file });
                  uploadFile(file);
                }}
              />
              <OutlinedBox>
                <TextInput
                  placeholder="Nombre*"
                  type="text"
                  value={episode.name}
                  onChange={(e) => setEpisode({ ...episode, name: e.target.value })}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Descripción*"
                  name="desc"
                  rows={5}
                  value={episode.desc}
                  onChange={(e) => setEpisode({ ...episode, desc: e.target.value })}
                />
              </OutlinedBox>
              <Elements>
                <ButtonDiv
                  button={true}
                  activeButton={false}
                  style={{ marginTop: "6px", width: "100%", margin: 0 }}
                  onClick={() => {
                    goToPodcast();
                  }}
                >
                  Atrás
                </ButtonDiv>
                <ButtonDiv
                  button={true}
                  activeButton={true}
                  style={{ marginTop: "22px", width: "100%", margin: 0 }}
                  onClick={addEpisode}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Añadir"
                  )}
                </ButtonDiv>
              </Elements>
            </>
          )}
        </Wrapper>
      </Container>
    </Modal>
  )
}

export default AddEpisode;

AddEpisode.propTypes = {
  setAddEpisodeOpen: PropTypes.func.isRequired,
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  margin: 50px 20px;
  height: min-content;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + 80};
  margin: 12px 20px 0px 20px;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton }) =>
    googleButton &&
    `
  user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
  user-select: none; 
  border: none;
  font-weight: 600;
  font-size: 16px;
  background: ${theme.button};
  color:'${theme.bg}';`}
  ${({ activeButton, theme }) =>
    activeButton &&
    `
  user-select: none; 
  border: none;
  background: ${theme.primary};
  color: white;`}
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const ButtonDiv = styled.div`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_inverted};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: ${({ theme }) => theme.primary};
  width: 50%;
  border-radius: 4px;
  padding: 12px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  gap: 6px;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_secondary};
  &:hover{
    background-color: ${({ theme }) => theme.primary + 95};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content:center;
  align-items: center;
  margin-top: 16px;
`

const Elements = styled.div`  
  text-align: center;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin: 16px;
`;

const FileUpload = styled.label`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 20px 3px 20px;
  border: 1px dashed ${({ theme }) => theme.text_secondary};
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  &:hover {
    background-color: ${({ theme }) => theme.text_secondary + 20};
  }
`;

const Uploading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
`;

const File = styled.input`
  display: none;
`;

const SelectionContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; 
  width: 100%; 
`