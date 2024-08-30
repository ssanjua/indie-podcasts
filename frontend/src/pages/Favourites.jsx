import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PodcastCard } from '../components/PodcastCard'
import { getUsers } from '../api/index'
import { CircularProgress } from '@mui/material'

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FavouritesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
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

const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;

const Favourites = () => {
  const [ user, setUser ] = useState(null)
  const [ Loading, setLoading ] = useState(false)
  const { currentUser } = useSelector(state => state.user)
  const token = localStorage.getItem("indiepodcasttoken")

  const getUser = async () => {
    try {
      const res = await getUsers(token);
      setUser(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      getUser().finally(() => setLoading(false))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, token])

  return (
    <Container>
      <Topic>
        Favoritos
      </Topic>
      {Loading ?
        <Loader>
          <CircularProgress />
        </Loader>
        :
        <FavouritesContainer>
          {user?.favorits?.length === 0 && <DisplayNo>No tenés favoritos... todavía 😼</DisplayNo>}
          {user && user?.favorits.map((podcast) => (
            <PodcastCard key={podcast._id} podcast={podcast} user={user} />
          ))}
        </FavouritesContainer>
      }
    </Container>
  )
}

export default Favourites