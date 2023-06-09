import Login from './components/login/Login'
import Signup from './components/signup/Signup'
import React, { useState } from 'react'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Article from './components/articles/Article'
import Home from './components/home/Home'
import DevsDashboard from './components/dashboard/DevsDashboard'
import Profile from './components/dashboard/Profile'
import DevArticles from './components/dev/DevArticles'
import MyArticles from './components/dev/MyArticles'
import DevLogin from './components/dev/DevLogin'
import DevSignup from './components/dev/DevSignup'
import { useEffect } from 'react'
import { reactLocalStorage } from 'reactjs-localstorage'
import ContactUs from './components/contact-us/ContactUs'
import TeamsPage from './components/teamspage/TeamsPage'
import DevsNavbar from './components/dashboard/DevsNavbar'
import Settings from './components/dev/Settings'

function App() {
  const [user, setUser] = useState(null)

  const subId = parseInt(localStorage.getItem('user'))

  const token = localStorage.getItem('jwt')

  useEffect(() => {
    fetch(
      `/subscribers/${subId}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((user) => {
            setUser(user)
            console.log(user.username)
            // window.localStorage.setItem('user', `${user.username}`)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
  }, [subId, token])

  function handleLogin(user) {
    setUser(user)
    reactLocalStorage.setObject('users', user)
  }
  // function handleLogout() {
  //   setUser(null);
  // }

  function handleDevLogin(dev) {
    // console.log('you have handled a dev logged in call back')
    setUser(dev)
    fetch('/devs').then(
      (response) => {
        if (response.ok) {
          return response.json().then((data) => {
            // console.log(data)
            const myDev = data.find((dev) => dev.username)
            // console.log(myDev)
          })
        }
      }
    )
  }
  return (
    <>
      <div className='body-container'>
        <div className='content-wrap'>
          {window.location.pathname.includes('dev') ? (
            <DevsNavbar />
          ) : (
            <Navbar />
          )}
          <Routes>
            <Route path='/' index element={<Home />} />
            <Route path='signup' element={<Signup />} />
            <Route path='login' element={<Login handleLogin={handleLogin} />} />
            <Route
              path='articles'
              element={<Article user={user} handleLogin={handleLogin} />}
            />

            <Route path='about' element={<TeamsPage />} />
            <Route path='contact_us' element={<ContactUs />} />
            <Route
              path='dev'
              element={<DevLogin handleDevLogin={handleDevLogin} />}
            />
            <Route path='dev-signup' element={<DevSignup />} />

            <Route path='dev/dashboard' element={<DevsDashboard user={user} />}>
              <Route index element={<Home />} />

              <Route path='profile' element={<Profile />} />
              <Route path='create-profile' element={<Profile />} />
              <Route path='create' element={<DevArticles />} />
              <Route path='articles' element={<MyArticles />} />
              <Route path='settings' element={<Settings />} />
            </Route>

            <Route path='*' element={<Home />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App