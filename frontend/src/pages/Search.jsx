import { useState } from 'react'
import styled from 'styled-components'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { DefaultCard } from '../components/DefaultCard.jsx'
import { Category } from '../utils/data.js'
import { searchPodcast } from '../api/index.js'
import TopResult from '../components/TopResult.jsx'
import MoreResult from '../components/MoreResult.jsx'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openSnackbar } from '../redux/snackbarSlice.jsx'
import { CircularProgress } from '@mui/material'

const SearchMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
      padding: 20px 9px;
  }
`;

const Heading = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  font-weight: 540;
  margin: 10px 14px;
`;

const BrowseAll = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 14px;
`;

const SearchedCards = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 14px;
  @media (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      padding: 6px;
  }
`;

const Categories = styled.div`
  margin: 20px 10px;
`;

const Search_whole = styled.div`
  margin-top: 20px;
  max-width: 700px;
  display: flex;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_secondary};
  border-radius: 4px;
  cursor: pointer;
  padding: 18px 16px;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.bgMedium};
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text_secondary};
 `;

const OtherResults = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 6px;
  padding: 4px 4px;
  @media (max-width: 768px) {
      height: 100%;
      padding: 4px 0px;
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

const Search = () => {
  const [searched, setSearched] = useState("")
  const [searchedPodcasts, setSearchedPodcasts] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const handleChange = async (e) => {
    setSearchedPodcasts([])
    setLoading(true)
    setSearched(e.target.value)
    await searchPodcast(e.target.value)
      .then((res) => {
        setSearchedPodcasts(res.data)
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });
    setLoading(false)
  }

  return (
    <SearchMain>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Search_whole>
          <SearchOutlinedIcon sx={{ "color": "inherit" }} />
          <input aria-label='Buscar podcast' type='text' placeholder='Buscar podcast'
            style={{  "fontSize": "18px", "border": "none", "outline": "none", "width": "100%", "background": "inherit", "color": "inherit" }}
            value={searched}
            onChange={(e) => handleChange(e)} />
        </Search_whole>
      </div>
      {searched === "" ?
        <Categories>
          <Heading>Ver todo</Heading>
          <BrowseAll>
            {Category.map((category) => (
              <Link to={`/showpodcasts/${category.name.toLowerCase()}`} key={category.name} style={{ textDecoration: "none" }}>
                <DefaultCard category={category} />
              </Link>
            ))}
          </BrowseAll>
        </Categories>
        :
        <>
          {loading ?
            <Loader>
              <CircularProgress />
            </Loader>
            :
            <SearchedCards>
              {searchedPodcasts.length === 0 ?
                <DisplayNo>No hay resultado 🥹 </DisplayNo>
                :
                <>
                  <TopResult podcast={searchedPodcasts[0]} />
                  <OtherResults>
                    {searchedPodcasts.map((podcast) => (
                      <MoreResult key={podcast} podcast={podcast} />
                    ))}
                  </OtherResults>
                </>
              }
            </SearchedCards>
          }
        </>
      }
    </SearchMain>
  )
}

export default Search