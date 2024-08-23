import PropTypes from 'prop-types'
import styled from 'styled-components'

const Card = styled.div`
  width: 175px;
  height: 175px;
  border-radius: 0.6rem;
  &:hover{
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  @media (max-width: 768px) {
    width: 250px;
  }
`;

const DefaultCardText = styled.div`
  color: #F2F3F4;
  font-size: 1.4rem;
  font-weight: 600;
  position: relative;
  z-index: 2;
  margin: 0.5rem;
`;

const DefaultCardImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  position: absolute;
  opacity: 0.6;
  z-index: 1;  
  border-radius: 0.6rem;
`;

const FlexContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  position: relative;
  z-index: 2;
`;

export const DefaultCard = ({ category }) => {
  return (
    <Card style={{ "backgroundColor": `${category.color}` }}>
      <FlexContainer>
        <DefaultCardImg
          src={category.img}
          alt="podcast-image"
        />
        <DefaultCardText>
          {category.name}
        </DefaultCardText>

      </FlexContainer>
    </Card>
  )
}

DefaultCard.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
  }).isRequired,
}