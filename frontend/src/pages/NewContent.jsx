import { useEffect, useState } from 'react'
import styled from "styled-components"
import { CircularProgress } from '@mui/material'
import { useCallback } from 'react'
import { getLatestPodcasts } from '../api'
import { PodcastCard } from '../components/PodcastCard'

const MainContent = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px){
    padding: 6px 10px;
  }
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  //center the items if only one item present
  @media (max-width: 550px){
    justify-content: center;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ box, theme }) => box && `
  background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
  `}
  background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @maedia (max-width: 768px){
    font-size: 18px;
  }
`;

const NewContent = () => {
  const [ loading, setLoading ] = useState(false)
  const [ newestPodcast, setNewestPodcast ] = useState([])

  const getNewestPodcast = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getLatestPodcasts()
      setLoading(false)
      setNewestPodcast(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    getNewestPodcast()

  }, [getNewestPodcast])

  return (
    <MainContent>
      {loading ?
        <Loader>
          <CircularProgress />
        </Loader>
        :
        <>
          <FilterContainer>
            <Topic>Nuevos podcasts</Topic>
            <Podcasts>
              {newestPodcast.slice(0, 8).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast.name} />
              ))}
            </Podcasts>
          </FilterContainer>
        </>
      }
    </MainContent>
  )
}

export default NewContent