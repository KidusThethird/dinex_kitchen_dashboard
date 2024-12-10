import React from 'react'

export default function NavBar() {
  return (
    <div className='fixed w-full bg-primaryColor text-white py-2 '>

        <div className='flex space-x-5 px-10'>
            <a href="/home">Home</a>
            <a href="/delivered">Delivered Orders</a>
            <a href="">Options</a>
        </div>
      
    </div>
  )
}
