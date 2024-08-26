import { deletePodcast } from '../api/index'
import { openSnackbar } from '../redux/snackbarSlice'

export const handleDeletePodcast = async ({
  podcastId,
  token,
  onSuccess = () => { },
  onError = (err) => {
    console.error(err)
  },
  dispatch = null,
}) => {
  try {
    const res = await deletePodcast(podcastId, token);
    if (res.status === 200) {
      onSuccess()
    }
  } catch (err) {
    if (dispatch) {
      dispatch(
        openSnackbar({
          message: err.message,
          severity: "error",
        })
      )
    }
    onError(err)
  }
}