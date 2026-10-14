import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import GoogleBusinessProfile from '../components/GoogleBusinessProfile'
import NewsletterBox from '../components/NewsletterBox'
import Marquee from '../components/Marquee'
import Reveal from '../components/Reveal'

const TAGLINES = ['HANDCRAFTED COMFORT', 'TIMELESS DESIGN', 'BUILT TO LAST', 'STATEMENT PIECES']

const Home = () => {
  return (
    <div>
      <Hero/>
      <Reveal><LatestCollection/></Reveal>

      {/* oversized ribbon between collections */}
      <Marquee
        items={TAGLINES}
        reverse
        slow
        separator="❖"
        className="full-bleed my-6 border-y border-gold-500/20 bg-ink-950/60 py-6"
        itemClassName="font-display italic text-5xl sm:text-7xl tracking-wide text-outline-gold cursor-default"
      />

      <Reveal><BestSeller/></Reveal>
      <Reveal><OurPolicy/></Reveal>
      <Reveal><GoogleBusinessProfile/></Reveal>
      <Reveal><NewsletterBox/></Reveal>
    </div>
  )
}

export default Home
