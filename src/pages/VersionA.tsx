import { useEffect, useState, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  animate,
} from 'framer-motion'
import './VersionA.css'

/* ===== ANIMATION VARIANTS ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08 },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

/* ===== COUNTER ===== */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) {
      const c = animate(count, target, { duration: 2, ease: [0.16, 1, 0.3, 1] })
      return c.stop
    }
  }, [isInView, count, target])

  useEffect(() => {
    return rounded.on('change', (v) => setDisplay(String(v)))
  }, [rounded])

  return <span ref={ref}>{display}{suffix}</span>
}

/* ===== PARALLAX IMAGE ===== */
function ParallaxImg({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30])

  return (
    <div ref={ref} style={{ overflow: 'hidden', height: '100%', width: '100%' }}>
      <motion.img src={src} alt={alt} style={{ y, width: '100%', height: '120%', objectFit: 'cover' }} />
    </div>
  )
}

/* ===== MAGNETIC WRAP ===== */
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 18 })
  const sy = useSpring(y, { stiffness: 250, damping: 18 })

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        x.set((e.clientX - r.left - r.width / 2) * 0.12)
        y.set((e.clientY - r.top - r.height / 2) * 0.12)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/* ===== APP ===== */
function App() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="site">
      {/* Scroll Progress */}
      <motion.div className="scroll-progress" style={{ scaleX }} />

      {/* ===== HEADER ===== */}
      <motion.header
        className={`header ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div className="header-left">
          <a href="#" className="logo">
            ASPIRE&nbsp;<span className="logo-accent">26</span>
          </a>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#tracks">Tracks</a>
            <a href="#speakers">Speakers</a>
            <a href="#highlights">Highlights</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="header-right">
          <a href="#" className="btn-header-outline">Agenda</a>
          <Magnetic>
            <a href="#register" className="btn-header-fill">Register Now</a>
          </Magnetic>
        </div>
      </motion.header>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/conference.jpg" alt="Aspire 26 Conference" />
        </div>
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <div className="hero-text">
            <motion.h1 variants={fadeUp}>
              Transform your business<br />
              <span className="accent">through technology.</span>
            </motion.h1>
            <motion.div className="hero-cta" variants={fadeUp} custom={2}>
              <Magnetic>
                <a href="#register" className="btn-hero">Register Free</a>
              </Magnetic>
              <a href="#tracks" className="arrow-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </motion.div>
          </div>
          <motion.div className="hero-info" variants={fadeUp} custom={3}>
            <p>
              October 14, 2026 &bull; Microsoft Technology Center, NYC. A one-day immersive conference for SMB leaders — 24 expert sessions, 4 strategic tracks, 150+ executives.
            </p>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        >
          SCROLL
          <div className="scroll-line" />
        </motion.div>
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about" id="about">
        <motion.div
          className="about-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p variants={fadeUp}>
            We bring together 150+ business leaders to discover strategies that drive revenue, strengthen cybersecurity, and unlock the full potential of cloud and AI — all in one transformative day at Microsoft Technology Center.
          </motion.p>
          <motion.div className="about-cta" variants={fadeUp} custom={2}>
            <Magnetic>
              <a href="#tracks" className="btn-about">View all tracks</a>
            </Magnetic>
            <a href="#" className="arrow-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <motion.div
        className="stats-bar"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        {[
          { n: 24, s: '+', l: 'Expert Sessions' },
          { n: 150, s: '+', l: 'Attendees' },
          { n: 4, s: '', l: 'Strategic Tracks' },
          { n: 1, s: '', l: 'Epic Day' },
        ].map((s, i) => (
          <motion.div key={i} className="stat-item" variants={fadeUp} custom={i}>
            <div className="stat-number"><Counter target={s.n} suffix={s.s} /></div>
            <div className="stat-label">{s.l}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ===== TRACKS ===== */}
      <section className="tracks" id="tracks">
        <motion.div
          className="tracks-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div className="section-label" variants={fadeUp}>
            <span className="dot" />
            STRATEGIC TRACKS
          </motion.div>
          <motion.a href="#" className="section-link" variants={fadeIn} custom={1}>
            Full agenda &rarr;
          </motion.a>
        </motion.div>

        <motion.div
          className="tracks-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {[
            { name: 'Revenue Growth', sessions: '6 sessions' },
            { name: 'Cybersecurity', sessions: '6 sessions' },
            { name: 'Cloud & AI', sessions: '6 sessions' },
            { name: 'Productivity', sessions: '6 sessions' },
          ].map((t, i) => (
            <motion.div key={i} className="track-item" variants={fadeUp} custom={i}>
              <h3>{t.name}</h3>
              <span className="track-sessions">{t.sessions}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== EVENT DETAIL ===== */}
      <section className="event-detail" id="speakers">
        <motion.div
          className="event-detail-image"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={slideLeft}
        >
          <ParallaxImg src="/images/events-section.jpg" alt="Event experience" />
        </motion.div>
        <motion.div
          className="event-detail-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={slideRight}
        >
          <h3>An experience designed for executive impact</h3>
          <p>
            Aspire 26 goes beyond typical conferences. Expect hands-on workshops, fireside chats with industry pioneers, and actionable strategies you can implement the next morning. Network with 150+ decision-makers in an intimate, high-signal environment.
          </p>
          <Magnetic>
            <a href="#register" className="btn-cyan">
              Reserve your spot
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </Magnetic>
        </motion.div>
      </section>

      {/* ===== SPONSORS ===== */}
      <section className="sponsors">
        <motion.div
          className="section-label"
          style={{ marginBottom: 48 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <span className="dot" />
          TRUSTED PARTNERS
        </motion.div>
        <motion.div
          className="sponsors-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          <motion.div className="sponsors-description" variants={fadeUp}>
            <p>
              Aspire is made possible by leading technology partners. From cloud infrastructure to cybersecurity, our sponsors bring cutting-edge solutions to help your business thrive.
            </p>
          </motion.div>
          <motion.div className="sponsors-names" variants={stagger}>
            {['Microsoft', 'WatchGuard', 'SentinelOne', 'Datto', 'Cisco Meraki', 'Barracuda'].map((name, i) => (
              <motion.h3 key={i} variants={fadeUp} custom={i}>{name}</motion.h3>
            ))}
          </motion.div>
        </motion.div>
        <div className="sponsors-show-all">
          <a href="#">View all partners &rarr;</a>
        </div>
      </section>

      {/* ===== HIGHLIGHTS ===== */}
      <section className="highlights" id="highlights">
        <motion.div
          className="highlights-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.h2 className="highlights-title" variants={fadeUp}>
            <span className="white">Aspire </span>
            <span className="blue">25 Recap</span>
          </motion.h2>
          <motion.a href="#" className="section-link" variants={fadeIn} custom={1}>
            View gallery &rarr;
          </motion.a>
        </motion.div>

        <motion.div
          className="highlights-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {[
            { img: '/images/event-anniversary.jpg', tag: 'Keynote', company: 'Main Stage', title: 'Olympic medalist Jack Alexy on peak performance' },
            { img: '/images/event-cruise.jpg', tag: 'Workshop', company: 'Cloud Track', title: 'Hands-on AI adoption strategies for SMBs' },
            { img: '/images/event-sailing.jpg', tag: 'Networking', company: 'Executive Mixer', title: '150+ leaders connecting at Microsoft NYC' },
          ].map((h, i) => (
            <motion.div key={i} className="highlight-card" variants={scaleIn} custom={i}>
              <ParallaxImg src={h.img} alt={h.title} />
              <div className="highlight-overlay">
                <div className="highlight-top">
                  <span className="highlight-tag">{h.tag}</span>
                  <span className="highlight-company">{h.company}</span>
                </div>
                <div className="highlight-bottom">
                  <h3>{h.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section" id="register">
        <div className="cta-glow" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div className="cta-person" variants={fadeUp}>
            <div className="cta-person-photo">
              <img src="/images/theresa.jpg" alt="Jennifer Mazzanti" />
            </div>
            <div className="cta-person-info">
              <h4>Jennifer Mazzanti</h4>
              <span>CEO & Co-Founder, eMazzanti</span>
            </div>
          </motion.div>
          <motion.h2 className="cta-heading" variants={fadeUp} custom={1}>
            Ready to transform your business in one day?
          </motion.h2>
          <motion.div className="cta-bottom" variants={fadeUp} custom={2}>
            <p className="cta-description">
              With over 20 years powering businesses through technology, eMazzanti brings you a day of expert insights, hands-on learning, and meaningful connections — completely free.
            </p>
            <div className="cta-buttons">
              <Magnetic>
                <a href="#" className="btn-cta primary">Register Now — Free</a>
              </Magnetic>
              <Magnetic>
                <a href="#" className="btn-cta secondary">Request Info</a>
              </Magnetic>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <motion.section
        className="newsletter"
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="section-label" style={{ marginBottom: 40 }}>
          <span className="dot" />
          STAY UPDATED
        </div>
        <div className="newsletter-content">
          <motion.div className="newsletter-person" variants={fadeUp}>
            <div className="newsletter-photo">
              <img src="/images/rob.jpg" alt="Carl Mazzanti" />
            </div>
            <div className="newsletter-person-info">
              <h4>Carl Mazzanti</h4>
              <span>President, eMazzanti</span>
            </div>
          </motion.div>
          <div className="newsletter-form-area">
            <motion.div className="newsletter-heading" variants={fadeUp} custom={1}>
              <h3>Subscribe for speaker reveals, agenda updates, and early access.</h3>
            </motion.div>
            <motion.div className="newsletter-form" variants={fadeUp} custom={2}>
              <label htmlFor="email">Your email*</label>
              <input type="email" id="email" placeholder="" />
              <a href="#" className="privacy-link">I accept the data privacy policy</a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.footer
        className="footer"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="footer-content">
          <motion.div className="footer-brand" variants={fadeUp}>
            <p>
              Powered by eMazzanti Technologies — a leading managed services provider, Microsoft expert, and WatchGuard Platinum partner since 2001.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Twitter">X</a>
              <a href="#" aria-label="YouTube">YT</a>
            </div>
          </motion.div>
          <motion.div className="footer-col" variants={fadeUp} custom={1}>
            <a href="#">Revenue Growth</a>
            <a href="#">Cybersecurity</a>
            <a href="#">Cloud & AI</a>
            <a href="#">Productivity</a>
            <a href="#">Full Agenda</a>
          </motion.div>
          <motion.div className="footer-col" variants={fadeUp} custom={2}>
            <a href="#">About Aspire</a>
            <a href="#">Speakers</a>
            <a href="#">Register</a>
            <a href="#">Contact</a>
            <a href="#">eMazzanti.net</a>
          </motion.div>
        </div>
        <motion.div className="footer-bottom" variants={fadeIn} custom={3}>
          <span>&copy; 2026 eMazzanti Technologies. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </motion.div>
      </motion.footer>
    </div>
  )
}

export default App
export { App as VersionA }
