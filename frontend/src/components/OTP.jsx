/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types'
import { useEffect, useState, useRef } from 'react'
import styled from "styled-components"
import { useTheme } from "styled-components"
import OtpInput from 'react-otp-input'
import CircularProgress from "@mui/material/CircularProgress"
import { useDispatch } from 'react-redux'
import { openSnackbar } from "../redux/snackbarSlice"
import { generateOtp, verifyOtp } from '../api'
import { startTimer, getTimeRemaining, clearTimer, getDeadTime } from '../utils/otpUtils'


const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 16px 22px;
`;

const OutlinedBox = styled.div`
  height: 44px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton }) =>
    googleButton &&
    `
  user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
  user-select: none; 
  border: none;
  background: ${theme.button};
  color: '${theme.text_secondary}';`}
  ${({ activeButton, theme }) =>
    activeButton &&
    `
  user-select: none; 
  border: none;
  background: ${theme.primary};
  color: white;`}
  margin: 3px 20px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  padding: 0px 14px;
`;

const LoginText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0px 26px 0px 26px;
`;

const Span = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  margin: 0px 26px 0px 26px;
`;

const Error = styled.div`
  color: red;
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
  ${({ error }) =>
    error === "" &&
    `    display: none;
  `}
`;

const Timer = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  margin: 2px 26px 8px 26px;
  display: block;
`;

const Resend = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  margin: 2px 26px 8px 26px;
  display: block;
  cursor: pointer;
`;

const OTP = ({ email, name, setOtpVerified, reason }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState('00:00');

  const Ref = useRef(null);

  const resendOtp = () => {
    setShowTimer(true);
    clearTimer(getDeadTime(), setTimer, Ref, startTimer, getTimeRemaining);
    sendOtp();
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    await generateOtp(email, name, reason)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            openSnackbar({
              message: 'OTP sent Successfully',
              severity: 'success',
            })
          );
          setDisabled(true);
          setOtp('');
          setOtpError('');
          setOtpLoading(false);
          setOtpSent(true);
        } else {
          dispatch(
            openSnackbar({
              message: res.status,
              severity: 'error',
            })
          );
          setOtp('');
          setOtpError('');
          setOtpLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
        setOtp('');
        setOtpError('');
        setOtpLoading(false);
      });
  };

  const validateOtp = () => {
    setOtpLoading(true);
    setDisabled(true);
    verifyOtp(otp)
      .then((res) => {
        if (res.status === 200) {
          setOtpVerified(true);
          setOtp('');
          setOtpError('');
          setDisabled(false);
          setOtpLoading(false);
        } else {
          setOtpError(res.data.message);
          setDisabled(false);
          setOtpLoading(false);
        }
      })
      .catch((err) => {
        dispatch(
          openSnackbar({
            message: err.message,
            severity: 'error',
          })
        );
        setOtpError(err.message);
        setDisabled(false);
        setOtpLoading(false);
      });
  };

  useEffect(() => {
    sendOtp();
    clearTimer(getDeadTime(), setTimer, Ref, startTimer, getTimeRemaining);
  }, []);

  useEffect(() => {
    if (timer === '00:00') {
      setShowTimer(false);
    } else {
      setShowTimer(true);
    }
  }, [timer]);

  useEffect(() => {
    if (otp.length === 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [otp]);
  return (
    <div>
      <Title>VERIFY OTP</Title>
      <LoginText >A verification <b>&nbsp;OTP &nbsp;</b> has been sent to: </LoginText>
      <Span>{email}</Span>
      {!otpSent ?
        <div style={{ padding: '12px 26px', marginBottom: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', justifyContent: 'center' }}>Sending OTP<CircularProgress color="inherit" size={20} /></div>
        :
        <div>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            shouldAutoFocus={true}
            inputStyle={{ fontSize: "22px", width: "38px", height: "38px", borderRadius: "5px", border: "1px solid #ccc", textAlign: "center", margin: "6px 4px", backgroundColor: 'transparent', color: theme.text_primary }}
            containerStyle={{ padding: '8px 2px', justifyContent: 'center' }}
            renderInput={(props) => <input {...props} />}
          />
          <Error error={otpError}><b>{otpError}</b></Error>
          <OutlinedBox
            button={true}
            activeButton={!disabled}
            style={{ marginTop: "12px", marginBottom: "12px" }}
            onClick={() => validateOtp()}
          >
            {otpLoading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </OutlinedBox>

          {showTimer ?
            <Timer>Resend in <b>{timer}</b></Timer>
            :
            <Resend onClick={() => resendOtp()}><b>Resend</b></Resend>
          }
        </div>
      }
    </div>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default OTP

OTP.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  otpVerified: PropTypes.bool.isRequired,
  setOtpVerified: PropTypes.func.isRequired,
  reason: PropTypes.string
}

OTP.defaultProps = {
  reason: 'default reason',
}