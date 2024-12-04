import { Navigate, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
import { useAppStore } from "./store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/api-client"
import { GET_USERINFO_ROUTE } from "./utils/constants"
import Loading from "./components/common/Loading"


// private route
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  // /console.log({ userInfo })
  return userInfo ? children : <Navigate to='/auth' />
}

// Auth route
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore()
  return userInfo ? <Navigate to='/chat' /> : children
}



function App() {
  const { userInfo, setUserInfo, token } = useAppStore()
  const [loading, setLoading] = useState(false)
  console.log("userInfo from App = ", userInfo)
  // console.log("token from App = ", token)

  // get user data
  useEffect(() => {
    const getUserData = async () => {
      setLoading(true)
      console.log("userInfo from apppp = ", userInfo)
      try {
        const response = await apiClient.post(GET_USERINFO_ROUTE,
          { token },
          { withCredentials: true }
        )
        console.log("GET_USERINFO_ROUTE RESPONSE => ", response)
        // save user data to store and local-storage 
        if (response.data.success && response.data.user._id) {
          setUserInfo(response.data.user)
          localStorage.setItem("userInfo", JSON.stringify(response.data?.user));
        }
      } catch (error) {
        console.log('GET_USERINFO_ROUTE ERROR => ', error)
      }
      finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      console.log("calling again to find info")
      getUserData()
    }
    else {
      setLoading(false)
    }
  }, [token, userInfo, setUserInfo])


  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className='overflow-auto  '>

      <Routes>
        <Route path='/auth' element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
        />

        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }

        />
        <Route path='/chat' element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
        />


        <Route path='*' element={<Navigate to='/auth' />} />
      </Routes>

    </div>
  )
}

export default App
