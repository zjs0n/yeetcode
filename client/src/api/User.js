import axios from 'axios'

// defines the basepath of the server
const basepath = 'http://localhost:8081'

export function addUser(data) {
  return axios.put(`${basepath}/signup`, data, {withCredentials: true})
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
    })
}

export function getUser() {
  return axios.get(`${basepath}/user`, {withCredentials: true})
    .then((res) => res.data)
    .catch((err) => {
      console.log(err)
    })
}
