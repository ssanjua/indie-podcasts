import PropTypes from 'prop-types'
import styled from 'styled-components'

const Card = styled.div`
  position: relative;
  text-decoration: none;
  background-color: ${({ selected, theme }) => selected ? theme.bgMedium : theme.card};
  max-width: 220px;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  border-radius: 6px;  
  box-shadow: ${({ selected }) => selected ? '0 0 18px 0 rgba(0, 0, 0, 0.3)' : '0 0 16px 0 rgba(0, 0, 0, 0.1)'};
  transform: ${({ selected }) => selected ? 'translateY(-8px)' : 'none'};
  filter: ${({ selected }) => selected ? 'brightness(1.2)' : 'none'};
  transition: all 0.4s ease-in-out;
  
  &:hover{
    cursor: pointer;
    transform: translateY(-8px);
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
  width: 180px;
  height: 120px;
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

export const EpisodeSelectionCard = ({ podcast, selected, onClick }) => {
  return (
    <Card onClick={onClick} selected={selected}>
      <div>
        <Top>
          <CardImage src={podcast.thumbnail} />
        </Top>
        <CardInformation>
          <MainInfo>
            <Title>{podcast.name}</Title>
            <Description>{podcast.desc}</Description>
          </MainInfo>
        </CardInformation>
      </div>
    </Card>
  );
}

EpisodeSelectionCard.propTypes = {
  podcast: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    desc: PropTypes.string,
    thumbnail: PropTypes.string.isRequired,
    type: PropTypes.string
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
