import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getPodcastByCategory, getMostPopularPodcast } from '../api/index.js'
import styled from 'styled-components'
import { PodcastCard } from '../components/PodcastCard.jsx'
import { useDispatch } from "react-redux"
import { openSnackbar } from "../redux/snackbarSlice.jsx"
import { CircularProgress } from '@mui/material'

const DisplayMain = styled.div`
  display: flex;
  padding: 30px 30px;
  flex-direction: column;
  height: 100%;
  overflow-y: scroll;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  gap: 10px;
  padding: 30px 0px;
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.bg};
  padding: 20px;
  border-radius: 6px;
  min-height: 400px;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const DisplayPodcasts = () => {
  const { type } = useParams()
  const [podcasts, setPodcasts] = useState([])
  const [string, setString] = useState("")
  const dispatch = useDispatch()
  const [Loading, setLoading] = useState(false)

  const mostPopular = useCallback(async () => {
    await getMostPopularPodcast()
      .then((res) => {
        setPodcasts(res.data);
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        )
      })
  }, [dispatch])

  const getCategory = useCallback(async () => {
    await getPodcastByCategory(type)
      .then((res) => {
        setPodcasts(res.data)
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        )
      })
  }, [type, dispatch])

  const getallpodcasts = useCallback(async () => {
    if (type === 'mostpopular') {
      setLoading(true)
      let arr = type.split("")
      arr[0] = arr[0].toUpperCase()
      arr.splice(4, 0, " ")
      setString(arr.join(""))
      await mostPopular()
      setLoading(false)
    } else {
      setLoading(true)
      let arr = type.split("")
      arr[0] = arr[0].toUpperCase()
      setString(arr.join(""))
      await getCategory()
      setLoading(false)
    }
  }, [type, mostPopular, getCategory])

  useEffect(() => {
    getallpodcasts()
  }, [getallpodcasts])

  return (
    <DisplayMain>
      <Container>
        <Topic>{string}</Topic>
        {Loading ?
          <Loader>
            <CircularProgress />
          </Loader>
          :
          <Podcasts>
            {podcasts.length === 0 && <DisplayNo>No hay podcasts</DisplayNo>}
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast} podcast={podcast} />
            ))}
          </Podcasts>
        }
      </Container>
    </DisplayMain>
  )
}

export default DisplayPodcasts