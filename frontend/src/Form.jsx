import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ValidateLogin from './LoginValidation'
import FormField from './FormField'
import moment from 'moment'
import { useAppContext } from './AppContext'

const Form = ({heading}) => {
    const {user, changeUserState, setUser} = useAppContext();
    let messageText = ''
    if (user.status === 'Blocked') {
        messageText = "You're blocked and can no longer log into the system"
    }
    else if (user.status === 'Deleted') {
        messageText = "You were deleted from the system. You can re-register if you wish to"
    }
    const [message, setMessage] = useState({
        text: messageText,
        type: 'danger'
    })
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        lastLogin: ''
    })
    const [errors, setErrors] = useState({})
    const navigate = useNavigate();
    const handleInput = (event) => {
        let loginTime = moment().format("HH:mm:ss, MMM D, YYYY");
        setValues(prev => ({...prev, [event.target.name]: event.target.value, lastLogin: loginTime}))
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        setErrors(ValidateLogin(values))
        let errorsTemp = ValidateLogin(values)
        if (heading === 'Sign up' && Object.values(errorsTemp).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/signup`, values)
            .then(res => {
                console.log(res)
                if (res.data === 'Email exists') {
                    setMessage(prev => ({...prev, text:'User with this email already exists. Maybe try login?'}))
                } else {
                    console.log('Successful sign up')
                    setMessage(prev => ({...prev, text:'Successful sign up. Now log into the system', type:'success'}))
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
        }
        else if (heading === 'Login' && Object.values(errorsTemp).slice(1).every(value => value === '')) {
            axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/login`, values)
            .then(res => {
                console.log(res.data)
                if (res.data === 'Success') {
                    changeUserState(values)
                    if (user.status === 'Blocked') {
                        setMessage(prev => ({...prev, text:"You're blocked and can no longer log into the system"}))
                    }
                } else if (res.data === 'Incorrect password') {
                    setMessage(prev => ({...prev, text: res.data}))
                } else if (res.data === 'Incorrect email') {
                    setMessage(prev => ({...prev, text:'User not found'}))
                }
                
            })
            .catch(err => console.log(err))
        }
        if (!Object.values(errorsTemp).every(value => value === '')) {        
            setMessage(prev => ({...prev, text:''}))
        }
    }
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark">
        {message.text && <div className={`alert alert-${message.type} w-50`} role="alert">{message.text}</div>}
        <div className='bg-light p-3 rounded w-50'>
            <h2>{heading}</h2>
            <form onSubmit={handleSubmit}>
                {heading === 'Sign up' && 
                <FormField name='name' onChange={handleInput} errors={errors} />}
                <FormField name='email' onChange={handleInput} errors={errors} />
                <FormField name='password' onChange={handleInput} errors={errors} />
                <div className="d-flex justify-content-between">
                    <button type='submit' className='btn btn-success'>{heading}</button>
                    <Link to={heading === 'Login' ? '/signup' : '/'} type='button' className='btn btn-secondary'>
                        {heading === 'Login' ? 'Sign up' : 'Login'}
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Form