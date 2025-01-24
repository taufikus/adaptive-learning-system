import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './Layout'
import VideoPage from './components/VideoPage'
import Home from './components/Home'
import ItemDetail from './components/ItemDetail'
import Entry from './components/Entry'
import ContentType from './components/ContentType'

const App = () => {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Entry />} />
        <Route path="/content-type" element={<ContentType />} />
        <Route path="/home" element={<Home />} />
        <Route path="/video/:itemId" element={<VideoPage />} />
        <Route path="/text/:itemId" element={<ItemDetail />} />
      </Route>
  </Routes>
  )
}

export default App

