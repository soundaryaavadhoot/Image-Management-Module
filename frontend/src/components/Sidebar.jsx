// import React from 'react'

// function Sidebar() {
//   return (
//     <div className='min-h-screen w-70 bg-gray-900 p-5 text-white'>
//         <h2 className='mb-8 text-2xl font-bold'>
//             Image Management
//         </h2>
//         <div className='space-y-2'>

//             <p className='cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'>
//                 Dashboard
//             </p>

//             <p className='mt-5 px-4 text-sm text-gray-400'>
//                 IMAGE MANAGEMENT
//             </p>

//             <p className='cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'>
//                 Single Image Upload
//             </p>

//             <p className='cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'>
//                 Multiple Image Upload
//             </p>

//             <p className='cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'>
//                 Multiple Image with Fields
//             </p>

//             <p className='cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'>
//                 Settings
//             </p>

//         </div>
//     </div>
//   )
// }

// export default Sidebar

import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className='min-h-screen w-70 bg-gray-900 p-5 text-white'>
        <h2 className='mb-8 text-2xl font-bold'>
            Image Management
        </h2>

        <div className='space-y-2'>

            <Link
              to="/"
              className='block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'
            >
                Dashboard
            </Link>

            <p className='mt-5 px-4 text-sm text-gray-400'>
                IMAGE MANAGEMENT
            </p>

            <Link
              to="/single-image"
              className='block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'
            >
                Single Image Upload
            </Link>

            <Link
              to="/multiple-images"
              className='block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'
            >
                Multiple Image Upload
            </Link>

            <Link
              to="/multiple-images-fields"
              className='block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'
            >
                Multiple Image with Fields
            </Link>

            <Link
              to="/settings"
              className='block cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-700'
            >
                Settings
            </Link>

        </div>
    </div>
  )
}

export default Sidebar