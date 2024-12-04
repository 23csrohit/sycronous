import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from './context/SocketContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </SocketProvider>
)
