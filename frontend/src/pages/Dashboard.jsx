import PropTypes from 'prop-types'
import { useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { getMostPopularPodcast, getPodcastByCategory, getLatestPodcasts, getUsers } from '../api'
import { PodcastCard } from '../components/PodcastCard.jsx'
import { Link } from 'react-router-dom'
import { CircularProgress } from '@mui/material'


const DashboardMain = styled.div`
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

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${({ box, theme }) => box && `
  background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
  `}
  // background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
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

const Span = styled.span`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  font-weight: 400;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  padding: 0.5rem;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_primary};
  border-radius: 10px;
  cursor: pointer;
  @media (max-width: 768px){
    font-size: 14px;
  }
  color: ${({ theme }) => theme.primary};
  &:hover{
    transition: 0.2s ease-in-out;
  }
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

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Dashboard = ({ setSignInOpen }) => {
  const [ mostPopular, setMostPopular ] = useState([])
  const [ user, setUser ] = useState()
  const [ comedy, setComedy ] = useState([])
  const [ news, setNews ] = useState([])
  const [ sports, setSports ] = useState([])
  const [ crime, setCrime ] = useState([])
  const [ loading, setLoading ] = useState(false)
  const [ newestPodcast, setNewestPodcast ] = useState([])

  //user
  const { currentUser } = useSelector(state => state.user)
  const token = localStorage.getItem("indiepodcasttoken")

  const getUser = useCallback(async () => {
    try {
      const res = await getUsers(token)
      setUser(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [token])

  const getPopularPodcast = useCallback(async () => {
    try {
      const res = await getMostPopularPodcast()
      setMostPopular(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getPodcastsByCategory = useCallback(async (category, setter) => {
    try {
      const res = await getPodcastByCategory(category)
      setter(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  const getAllData = useCallback(async () => {
    setLoading(true)
    try {
      if (currentUser) {
        await getUser()
      }
    await Promise.all([
      getPopularPodcast(),
      getPodcastsByCategory("variedad", setComedy),
      getPodcastsByCategory("noticias", setNews),
      getPodcastsByCategory("deportes", setSports),
      getPodcastsByCategory("tecnologia", setCrime)
    ])
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}, [currentUser, getUser, getPopularPodcast, getPodcastsByCategory])

  const getNewestPodcast = useCallback(async () => {
    try {
      const res = await getLatestPodcasts()
      setNewestPodcast(res.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([getAllData(), getNewestPodcast()])
      setLoading(false)
    }
    fetchData()
  }, [getAllData, getNewestPodcast])

  return (
    <DashboardMain>
      {loading ?
        <Loader>
          <CircularProgress />
        </Loader>
        :
        <>
          <FilterContainer>
            <Topic>Populares 
              <Link to={`/showpodcasts/mostpopular`} style={{ textDecoration: "none" }}>
                <Span>más</Span>
              </Link>
            </Topic>
            <Podcasts>
              {mostPopular.slice(0, 10).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast._id} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Topic>Nuevos podcasts</Topic>
            <Podcasts>
              {newestPodcast.slice(0, 8).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast.name} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Topic>Variedad
              <Link to={`/showpodcasts/variedad`} style={{ textDecoration: "none" }}>
                <Span>más</Span>
              </Link>
            </Topic>
            <Podcasts>
              {comedy.slice(0, 4).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast._id} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/noticias`} style={{ textDecoration: "none" }}>
              <Topic>Noticias
                <Span>más</Span>
              </Topic>
            </Link>
            <Podcasts>
              {news.slice(0, 4).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast._id} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/tecnologia`} style={{ textDecoration: "none" }}>
              <Topic>Tecnología
                <Span>más</Span>
              </Topic>
            </Link>
            <Podcasts>
              {crime.slice(0, 4).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast._id} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
          <FilterContainer>
            <Link to={`/showpodcasts/deportes`} style={{ textDecoration: "none" }}>
              <Topic>Deportes
                <Span>más</Span>
              </Topic>
            </Link>
            <Podcasts>
              {sports.slice(0, 4).map((podcast) => (
                <PodcastCard podcast={podcast} key={podcast._id} user={user} setSignInOpen={setSignInOpen} />
              ))}
            </Podcasts>
          </FilterContainer>
        </>
      }
    </DashboardMain>
  )
}

export default Dashboard

Dashboard.propTypes = {
  setSignInOpen: PropTypes.bool,
}