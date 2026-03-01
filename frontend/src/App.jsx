import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Formulaire from './components/Formulaire'
import Admin from './components/Admin'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Formulaire/>} />
        <Route path='/admin' element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  )
}
