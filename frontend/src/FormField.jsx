import React from 'react'

const FormField = ({name, onChange, errors}) => {
  return (
    <div className='mb-3'>
        <label htmlFor={name} className="form-label">{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <input id={name} type={name==='name' ? 'text': name} className="form-control" name={name} onChange={onChange} placeholder={'Enter your '+ name}/>
        <span className='text-danger'>{errors[name]}</span>
    </div>
  )
}

export default FormField