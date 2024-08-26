import PropTypes from 'prop-types'
import styled from 'styled-components'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Dialog = styled.div`
  background-color: ${({ theme }) => theme.card};
  padding: 24px;
  border-radius: 16px;
  font-size: 12px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 100%;
`;

const DialogTitle = styled.h2`
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const DialogActions = styled.div`
  margin-top: 22px;
  display: flex;
  justify-content: space-around;
`;

const Button = styled.div`
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text_inverted};
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  margin: 6px;
  padding: 10px 8px;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 3px 3px 0px 0px ${({ theme }) => theme.text_secondary};
  &:hover{
    background-color: ${({ theme }) => theme.primary + 95};
  }
`

export const DialogPopUp = ({ open, title, onConfirm, onCancel }) => {
  if (!open) return null

  return (
    <Overlay>
      <Dialog>
        <DialogTitle>{title}</DialogTitle>
        <DialogActions>
          <Button onClick={onConfirm}>
            Confirmar
          </Button>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Overlay>
  )
}

DialogPopUp.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
