import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import Trash from './assets/trash-solid.svg'
import Lock from './assets/lock-solid.svg'
import Unlock from './assets/lock-open-solid.svg'
import { useAppContext } from './AppContext'

const Home = () => {
  const {user, changeUserState, setUser} = useAppContext();
  const [data, setData] = useState([]);
  useEffect(() =>{
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/table`)
    .then(res => {
        console.log(res)
        setData(res.data)
    })
    .catch(err => console.log(err))
  }, [])

  const [checkedItems, setCheckedItems] = useState({})
  const [allChecked, setAllChecked] = useState(false)

  const handleCheckboxChange = (event) => {
    setCheckedItems(prev => ({...prev, [event.target.name]: event.target.checked}));
    console.log(checkedItems)
    let updCheckedItems = {...checkedItems, [event.target.name]: event.target.checked}
    if (Object.values(updCheckedItems).length === data.length) {
      setAllChecked(Object.values(updCheckedItems).every(checked => checked === true))
    }
    else {setAllChecked(false)}
    console.log('updcheckeditems', Object.values(updCheckedItems))
    
  }

  const handleCheckboxChangeAll = (event) => {
    let result = {}
    setAllChecked(event.target.checked)
    for (let i in data) {
      result[data[i].id] = event.target.checked
    }
    setCheckedItems(result)
  }

  const handleChangeStatus = (status) => {
    changeUserState(user)
    let data = {
      ids: [],
      status,
      userid: user.id
    }
    for (let id in checkedItems) {checkedItems[id] && data.ids.push(id)}
    console.log(data)
    if (data.ids.length) {
      axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/change`, data)
      .then(res => {
        console.log(res)
        setData(res.data)
      })
      .catch(err => console.log(err))
    }    
  }

  return (
    <div className="d-flex flex-column bg-dark align-items-center min-vh-100">
      <nav className="navbar bg-body-tertiary fixed-top">
        <div className="container-fluid d-flex justify-content-between">
          <span className="navbar-item">
            {`Hello, ${user.name}!`}
          </span>
          <span className='text-primary text-decoration-underline' onClick={() => setUser({status: ''})}>Logout</span>
        </div>
      </nav>
      <div className="d-flex justify-content-start w-75 gap-2" style={{ marginTop: '150px'}}>
                    <button type='button' className='btn btn-light' onClick={() => handleChangeStatus('Blocked')}><img src={Lock} width={20} height={20}/>  Block</button>
                    <button type='button' className='btn btn-light' onClick={() => handleChangeStatus('Active')}><img src={Unlock} width={20} height={20}/></button>
                    <button type='button' className='btn btn-danger' onClick={() => handleChangeStatus('Delete')}><img src={Trash} width={20} height={20}/>

                    </button>
                </div>
      <div className='w-75' style={{ marginTop: '20px'}}>
        <table className='table table-bordered table-striped table-hover'>
          <thead>
            <tr>
                <th><input type="checkbox" checked={allChecked} onChange={handleCheckboxChangeAll} /></th>
                <th>Name</th>
                <th>Email</th>
                <th>Last login</th>
                <th>Status</th>
            </tr>
          </thead>
            {data.map((val) => {
                return (
                  <tbody>
                    <tr key={val.id}>
                        <td>
                        <input 
                          type="checkbox"
                          name={val.id}
                          checked={checkedItems[val.id]}
                          onChange={handleCheckboxChange}
                        />
                        </td>
                        <td>{val.name}</td>
                        <td>{val.email}</td>
                        <td>{val.last_login}</td>
                        <td>{val.status}</td>
                    </tr>
                  </tbody>
                )
            })} 
        </table>
      </div>
    </div>
);
}

export default Home