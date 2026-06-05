import { useScrollReveal } from './lib/useScrollReveal'
import BgFx from './components/BgFx'
import StickyCta from './components/StickyCta'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'

import Hero from './sections/Hero'
import Problem from './sections/Problem'
import NotBorn from './sections/NotBorn'
import Cycle from './sections/Cycle'
import About from './sections/About'
import WhatIsIt from './sections/WhatIsIt'
import Journey from './sections/Journey'
import Features from './sections/Features'
import Learn from './sections/Learn'
import Imagine from './sections/Imagine'
import ForWhom from './sections/ForWhom'
import Offer from './sections/Offer'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'

export default function App() {
  useScrollReveal()

  return (
    <>
      <BgFx />
      <Hero />
      <main>
        <SectionDivider />
        <Problem />
        <SectionDivider />
        <NotBorn />
        <SectionDivider />
        <Cycle />
        <SectionDivider />
        <About />
        <SectionDivider />
        <WhatIsIt />
        <SectionDivider />
        <Journey />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <Learn />
        <SectionDivider />
        <Imagine />
        <SectionDivider />
        <ForWhom />
        <SectionDivider />
        <Offer />
        <SectionDivider />
        <Faq />
        <SectionDivider />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  )
}
