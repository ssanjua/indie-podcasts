import PropTypes from 'prop-types'
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { closeSnackbar } from "../redux/snackbarSlice"
import { useDispatch } from "react-redux"

const ToastMessage = ({
    message,
    severity,
    open,
}) => {
  const dispatch = useDispatch();
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={ ()=> dispatch(closeSnackbar())}
    >
      <Alert
        onClose={()=> dispatch(closeSnackbar())}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ToastMessage

ToastMessage.propTypes = {
  message: PropTypes.string,
  severity: PropTypes.string,
  open: PropTypes.bool
}