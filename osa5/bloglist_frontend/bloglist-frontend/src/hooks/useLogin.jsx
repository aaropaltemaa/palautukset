import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { useNotification } from './useNotification'
import { useDispatch } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer'

const useLogin = (setUser) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const notify = useNotification()
    const dispatch = useDispatch()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [setUser])

    const refreshUsers = () => {
        dispatch(initializeUsers())
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('Logging in with', username, password)
        try {
            const user = await loginService.login({
                username,
                password
            })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            notify(`welcome ${user.name}`, 'success')
            refreshUsers()
        } catch (exception) {
            console.error('Login failed:', exception)
            notify('Wrong credentials', 'danger')
        }
    }

    const handleLogout = () => {
        console.log('Logging out')
        notify('Logged out successfully', 'success')
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        refreshUsers()
    }

    return {
        username,
        password,
        setUsername,
        setPassword,
        handleLogin,
        handleLogout
    }
}

export default useLogin