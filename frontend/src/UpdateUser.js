import axios from "axios"

async function UpdateUser(user) {
    const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/user`, user)
    .catch(err => console.log(err))
    console.log('update user result', res.data)
    if (res.status == 200) {
        return (res.data.length ? res.data[0] : {status: 'Deleted'})
        }
    
}

export default UpdateUser