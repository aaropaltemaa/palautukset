import { useState } from 'react'

const useBlogFormField = (name) => {
    const [value, setValue] = useState('')

    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return {
        name,
        value,
        onChange: handleChange,
    }
}

export default useBlogFormField