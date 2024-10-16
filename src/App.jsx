import Home from './pages/Home'
import Footer from './components/Footer'
import Login from './pages/Login'
import Booking from './pages/Booking'
import Register from './pages/Register'
import './App.css'
import Navbar from './components/Navbar'
import Banner from './components/Banner'
import HomeBody from './components/HomeBody'

function App () {

  return (
    <div className='App'>
      <Navbar />
      <Banner />
      <HomeBody/>

      {/* <Home />
      <Footer /> */}
    </div>
  )
}

export default App
