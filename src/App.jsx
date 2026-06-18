import { useState } from 'react'
import './styles/index.scss'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import Footer from './components/Footer/Footer'

function App() {
  const [freshRates, setFreshRates] = useState(null)

  return (
    <>
      <Header onRatesUpdated={setFreshRates} />
      <Main rates={freshRates} />
      <Footer />
    </>
  )
}

export default App