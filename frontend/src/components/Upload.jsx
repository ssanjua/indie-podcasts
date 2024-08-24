import PropTypes from 'prop-types'
import { CloseRounded, CloudDoneRounded } from '@mui/icons-material'
import { CircularProgress, LinearProgress, Modal } from "@mui/material"
import React, { useEffect } from 'react'
import styled from 'styled-components'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import app from "../firebase"
import ImageSelector from "./ImageSelector"
import { useDispatch } from "react-redux"
import { openSnackbar } from "../redux/snackbarSlice"
import { createPodcast } from '../api'
import { Category } from '../utils/data'
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';


const Upload = ({ setUploadOpen }) => {
  const [podcast, setPodcast] = React.useState({
    name: "",
    desc: "",
    thumbnail: "",
    tags: [],
    category: "",
    type: "",
    episodes: [
      {
        name: "",
        desc: "",
        type: "",
        file: "",
      }
    ],
  })

  const [showEpisode, setShowEpisode] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [backDisabled, setBackDisabled] = React.useState(false)
  // eslint-disable-next-line no-unused-vars
  const [createDisabled, setCreateDisabled] = React.useState(true)
  const [loading, setLoading] = React.useState(false)

  const dispatch = useDispatch()

  const token = localStorage.getItem("indiepodcasttoken")

  const goToAddEpisodes = () => {
    setShowEpisode(true)
  }

  const goToPodcast = () => {
    setShowEpisode(false)
  }

  useEffect(() => {
    if (podcast === null) {
      setDisabled(true);
      setPodcast({
        name: "",
        desc: "",
        thumbnail: "",
        tags: [],
        episodes: [
          {
            name: "",
            desc: "",
            type: "",
            file: "",
          }
        ],
      })
    } else {
      if (podcast.name === "" && podcast.desc === "") {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
    }
  }, [podcast])

  const uploadFile = (file, index) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        podcast.episodes[index].file.uploadProgress = Math.round(progress);
        setPodcast({ ...podcast, episodes: podcast.episodes });
      },
      (error) => {
        console.error("Upload failed:", error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File uploaded successfully. Download URL:", downloadURL)
          const newEpisodes = podcast.episodes.slice()
          newEpisodes[index].file = downloadURL;
          setPodcast({ ...podcast, episodes: newEpisodes })
        }).catch((error) => {
          console.error("Error getting download URL:", error)
        })
      }
    )
  }

  const createpodcast = async () => {
    setLoading(true)

    await createPodcast(podcast, token).then((res) => {
      console.log("Response from backend:", res)
      setDisabled(true)
      setBackDisabled(true)
      setUploadOpen(false)
      setLoading(false)
      dispatch(
        openSnackbar({
          open: true,
          message: "Podcast creado con éxito!",
          severity: "success",
        })
      )
    }
    ).catch((err) => {
      setDisabled(false)
      setBackDisabled(false)
      setLoading(false)
      console.log("Error from backend:", err)
      dispatch(
        openSnackbar({
          open: true,
          message: "Error creando el podcast",
          severity: "error",
        })
      )
    })
  }

  useEffect(() => {
    if (podcast.episodes.length > 0 && podcast.episodes.every(episode => episode.file !== "" && episode.name !== "" && episode.desc !== "" && podcast.name !== "" && podcast.desc !== "" && podcast.tags !== "" && podcast.image !== "" && podcast.image !== undefined && podcast.image !== null)) {
      if (podcast.episodes.every(episode => episode.file.name === undefined))
        setCreateDisabled(false)
      else
        setCreateDisabled(true)
    }
  }, [podcast])

  return (
    <Modal open={true} onClose={() => setUploadOpen(false)}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: "absolute",
              top: "24px",
              right: "30px",
              cursor: "pointer",
            }}
            onClick={() => setUploadOpen(false)}
          />
          <Title>Subir Podcast</Title>
          {!showEpisode ? (
            <>
              <Label>Detalles:</Label>
              <ImageSelector podcast={podcast} setPodcast={setPodcast} />
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  placeholder="Nombre del podcast*"
                  type="text"
                  value={podcast?.name}
                  onChange={(e) => setPodcast({ ...podcast, name: e.target.value })}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="¿De qué trata tu podcast?* "
                  name="desc"
                  rows={5}
                  value={podcast?.desc}
                  onChange={(e) => setPodcast({ ...podcast, desc: e.target.value })}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  placeholder="Tags separados por ,"
                  name="tags"
                  rows={4}
                  value={podcast?.tags}
                  onChange={(e) => setPodcast({ ...podcast, tags: e.target.value.split(",") })}
                />
              </OutlinedBox>
              <div style={{ display: 'flex', width: '100%', gap: '6px' }}>
                <OutlinedBox style={{ marginTop: "6px", width: '100%', marginRight: '0px' }}>
                  <Select
                    onChange={
                      (e) => setPodcast({ ...podcast, type: e.target.value })
                    }>
                    <Option value="audio">Audio</Option>
                   Line <Option value="video">Video</Option>
                  </Select>
                </OutlinedBox>
                <OutlinedBox style={{ marginTop: "6px", width: '100%', marginLeft: '0px' }}>
                  <Select
                    onChange={
                      (e) => setPodcast({ ...podcast, category: e.target.value })
                    }
                  >
                    <Option value={Category[0].name}>Categoria</Option>
                    {Category.map((category) => (
                      <Option value={category.name} key={category.name}>{category.name}</Option>
                    ))}
                  </Select>
                </OutlinedBox>
              </div>
              <ButtonContainer>
                <ButtonDiv
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "22px", marginBottom: "18px" }}
                  onClick={() => {
                    !disabled && goToAddEpisodes();
                  }}
                >
                  Siguiente
                </ButtonDiv>
              </ButtonContainer>
            </>
          ) : (
            <>
              <Label>Episodio:</Label>
              {podcast.episodes.map((episode, index) => (
                <React.Fragment key={index}>
                  <FileUpload htmlFor={"fileField" + index}>
                    {podcast.episodes[index].file === "" ? (
                      <Uploading>
                        <UploadRoundedIcon />
                        Subí tu podcast
                      </Uploading>
                    ) : (
                      <Uploading>
                        {podcast.episodes[index].file.name === undefined ? (
                          <div style={{ color: 'green', display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                            <CloudDoneRounded sx={{ color: 'inherit' }} />
                            Archivo subido!
                          </div>
                        ) : (
                          <>
                            Archivo: {podcast.episodes[index].file.name}
                            <LinearProgress
                              sx={{ borderRadius: "10px", height: 3, width: "100%" }}
                              variant="determinate"
                              value={podcast.episodes[index].file.uploadProgress}
                              color={"success"}
                            />
                            {podcast.episodes[index].file.uploadProgress}% subido
                          </>
                        )}
                      </Uploading>
                    )}
                  </FileUpload>
                  <File style={{ marginTop: "16px" }} type="file" accept="file_extension|audio/*|video/*|media_type" id={"fileField" + index}
                    onChange={(e) => {
                      podcast.episodes[index].file = e.target.files[0];
                      setPodcast({ ...podcast, episodes: podcast.episodes });
                      uploadFile(podcast.episodes[index].file, index);
                    }}
                  />
                  <OutlinedBox >
                    <TextInput
                      placeholder="Nombre*"
                      type="text"
                      value={episode.name}
                      onChange={(e) => {
                        const newEpisodes = podcast.episodes;
                        newEpisodes[index].name = e.target.value;
                        setPodcast({ ...podcast, episodes: newEpisodes });
                      }}
                    />
                  </OutlinedBox>
                  <OutlinedBox style={{ marginTop: "6px" }}>
                    <Desc
                      placeholder="Descripción* "
                      name="desc"
                      rows={5}
                      value={episode.desc}
                      onChange={(e) => {
                        const newEpisodes = podcast.episodes;
                        newEpisodes[index].desc = e.target.value;
                        setPodcast({ ...podcast, episodes: newEpisodes });
                      }}
                    />
                  </OutlinedBox>
                  <ButtonContainer>
                    <ButtonDiv
                      button={true}
                      activeButton={false}
                      style={{ marginTop: "6px", marginBottom: "12px" }}
                      onClick={() =>
                        setPodcast({
                          ...podcast, episodes: podcast.episodes.filter((_, i) => i !== index)
                        })
                      }
                    >
                      Borrar
                    </ButtonDiv>
                  </ButtonContainer>
                </React.Fragment>
              ))}
              <ButtonContainer>
                <ButtonDiv
                  button={true}
                  activeButton
                  style={{ marginTop: "4px", marginBottom: "18px" }}
                  onClick={() =>
                    setPodcast({ ...podcast, episodes: [...podcast.episodes, { name: "", desc: "", file: "" }] })
                  }
                >
                  Añadir edisodio
                </ButtonDiv>
              </ButtonContainer>
              <ButtonContainer>
                <ButtonDiv
                  button={true}
                  activeButton={false}
                  style={{ marginTop: "6px", width: "100%", margin: 0 }}
                  onClick={() => {
                    !backDisabled && goToPodcast();
                  }}
                >
                  Atrás
                </ButtonDiv>
                <ButtonDiv
                  button={true}
                  activeButton={!disabled}
                  style={{ marginTop: "6px", width: "100%", margin: 0 }}
                  onClick={() => {
                    !disabled && createpodcast();
                  }}
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Crear"
                  )}
                </ButtonDiv>
              </ButtonContainer>
            </>
          )}
        </Wrapper>
      </Container>
    </Modal>
  )
}

export default Upload

Upload.propTypes = {
  setUploadOpen: PropTypes.func.isRequired
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: top;
  justify-content: center;
  overflow-y: scroll;
`;

const ButtonDiv = styled.div`
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_inverted};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  padding: 12px 10px;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_secondary};
  &:hover{
    background-color: ${({ theme }) => theme.primary + 95};
  }
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

const Select = styled.select`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Option = styled.option`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.card};
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 0px 16px; 
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

const File = styled.input`
  display: none;
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