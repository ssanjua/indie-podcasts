export const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  return { total, hours, minutes, seconds }
}

export const startTimer = (e, setTimer, Ref, getTimeRemaining) => {
  let { total, minutes, seconds } = getTimeRemaining(e)
  if (total >= 0) {
      setTimer(
          (minutes > 9 ? minutes : '0' + minutes) + ':' + (seconds > 9 ? seconds : '0' + seconds)
      )
  }
}

export const clearTimer = (e, setTimer, Ref, startTimer) => {
  setTimer('01:00')
  if (Ref.current) clearInterval(Ref.current);
  const id = setInterval(() => startTimer(e), 1000)
  Ref.current = id
}

export const getDeadTime = () => {
  let deadline = new Date()
  deadline.setSeconds(deadline.getSeconds() + 60)
  return deadline
}