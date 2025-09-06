import React from 'react'

export default function Button({
    children,
    type="submit" ,
    bgClolor="bg-blue-600",
    textColor = "text-white",
    className='',
    ...props
}) {
  return (
<button className={`px-4 py-2 ${bgClolor} ${textColor} rounded-lg ${className}`} {...props}>
    {children}
</button>
  )
}
