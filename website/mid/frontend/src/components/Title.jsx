import React from 'react'

function Title({text1, text2}) {
  return (
    <div className='inline-flex flex-col items-center gap-2 mb-3'>
      <p className='font-display text-ivory-400 tracking-[0.15em] flex items-center gap-3'>
        <span className='text-ruby-500 text-sm' aria-hidden="true">✦</span>
        <span>{text1} <span className='text-shimmer font-semibold'>{text2}</span></span>
        <span className='text-ruby-500 text-sm' aria-hidden="true">✦</span>
      </p>
      <p className='w-14 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent shadow-[0_0_12px_rgba(201,162,75,0.8)]'></p>
    </div>
  )
}

export default Title
