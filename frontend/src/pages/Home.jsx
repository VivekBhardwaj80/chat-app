import React from 'react'
import Sidebar from '../components/Sidebar'
import MessageArea from '../components/MessageArea'
import getMessage from '../hooks/getMessage'

const Home = () => {
  getMessage()
  return (
    <div className='w-full h-[100vh] flex'>
      <Sidebar /> 
      <MessageArea />
    </div>
  )
}

export default Home