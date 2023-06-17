import axios from 'axios'

// defines the basepath of the server
const basepath = 'http://localhost:8081'

export const Language = {
  PYTHON: 'PYTHON'
}

export function submitAnswer(data) {
  return axios.post(`http://54.204.80.16:8080/`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
      if (err && err.response && err.response.data)
        return err.response.data
      return {
        exception_type: 'UNKNOWN',
        message: 'An unknown error has occurred, please try again later.'
      }
    })
}

export function getDefaultCodeMap(problemId) {
  return axios.get(`${basepath}/problems/${problemId}/default-code`, {withCredentials: true})
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
    })
}
