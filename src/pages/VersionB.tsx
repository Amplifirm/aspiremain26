import { useState, useRef, useEffect } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  AnimatePresence,
} from 'framer-motion'
import './VersionB.css'

/* ===== VARIANTS ===== */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
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

/* ===== LETTER ANIMATION ===== */
function AnimatedLetters({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 80, rotateX: -60 },
            visible: {
              opacity: 1, y: 0, rotateX: 0,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            },
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ===== MAIN COMPONENT ===== */
export function VersionB() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 })
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const photos = [
    '/images/conference.jpg',
    '/images/events-section.jpg',
    '/images/incentive.jpg',
    '/images/sailing.jpg',
  ]

  const highlights = [
    { img: '/images/event-anniversary.jpg', title: 'AI strategies that actually drive revenue for SMBs', speaker: 'Bryan Antepara, Cloud Engineer' },
    { img: '/images/event-cruise.jpg', title: 'Building scalable IT infrastructure from day one', speaker: 'Carl Mazzanti, President, eMazzanti' },
    { img: '/images/event-sailing.jpg', title: 'Zero-trust cybersecurity for the modern workplace', speaker: 'Brindavani Pathuri, Network Engineer' },
    { img: '/images/conference.jpg', title: 'Championship culture: leadership lessons from sports', speaker: 'Dan Karosen, Co-Founder, FC Motown' },
  ]

  const faqs = [
    { q: 'Who should attend Aspire 26?', a: 'Aspire is designed for business owners, executives, IT leaders, and technology staff at small to medium-sized businesses looking to drive growth through technology.' },
    { q: 'When and where is Aspire 26?', a: 'Aspire 26 takes place on October 14, 2026 at the Microsoft Technology Center in Times Square, New York City. The event runs from 9:00 AM to 5:00 PM.' },
    { q: 'Is there a virtual option?', a: 'Yes — virtual attendance is completely free. You\'ll have access to all keynotes and select sessions via livestream.' },
    { q: 'How do I become a sponsor?', a: 'We partner with leading technology companies to deliver value to attendees. Contact us at aspire@emazzanti.net to discuss sponsorship opportunities.' },
  ]

  return (
    <div className="vb">
      {/* Scroll Progress */}
      <motion.div className="scroll-progress" style={{ scaleX, background: 'linear-gradient(90deg, #FF5F3D, #FFB800)' }} />

      {/* ===== TOP BAR ===== */}
      <motion.div
        className="vb-topbar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="vb-topbar-left">
          <div className="vb-logo">ASPIRE</div>
          <div className="vb-tagline">eMazzanti's conference for people who build businesses</div>
        </div>
        <div className="vb-topbar-right">
          <a href="#faq">FAQ</a>
        </div>
      </motion.div>

      {/* ===== INFO BAR ===== */}
      <motion.div
        className="vb-infobar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="vb-infobar-items">
          <div className="vb-infobar-item">
            <strong>October 14, 2026</strong>
            <span>In-person & Virtual</span>
          </div>
          <div className="vb-infobar-item">
            <strong>Microsoft Technology Center</strong>
            <span>New York City, NY</span>
          </div>
        </div>
        <div className="vb-infobar-right">
          <span className="vb-price-tag">Tickets available now: Free</span>
          <a href="#tickets" className="vb-btn-register">Register</a>
        </div>
      </motion.div>

      {/* ===== HERO ===== */}
      <section className="vb-hero">
        <AnimatedLetters text="ASPIRE" className="vb-hero-text" />
      </section>

      {/* ===== REGISTRATION CTA ===== */}
      <motion.section
        className="vb-reg-cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <motion.div className="vb-reg-label" variants={fadeIn}>SAVE YOUR SPOT</motion.div>
        <motion.div className="vb-reg-content" variants={fadeUp}>
          <h2>
            Registration is open.<br />
            <a href="#tickets">Get Aspire tickets &rarr;</a>
          </h2>
          <div className="vb-reg-virtual">Virtual is always free.</div>
        </motion.div>
        <motion.div className="vb-reg-price" variants={fadeUp} custom={2}>FREE</motion.div>
      </motion.section>

      {/* ===== PHOTO STRIP ===== */}
      <motion.div
        className="vb-photos"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        {photos.map((src, i) => (
          <motion.div key={i} className="vb-photo-item" variants={scaleIn} custom={i}>
            <img src={src} alt={`Aspire moment ${i + 1}`} />
          </motion.div>
        ))}
      </motion.div>

      {/* ===== STATS ===== */}
      <motion.section
        className="vb-stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.div className="vb-stats-label" variants={fadeIn}>ASPIRE 26 AT A GLANCE</motion.div>
        <motion.div className="vb-stats-numbers" variants={fadeUp}>
          <h2><Counter target={20} suffix="+" /> speakers</h2>
          <h2><Counter target={24} suffix="+" /> sessions</h2>
          <h2><Counter target={150} suffix="+" /> attendees</h2>
        </motion.div>
      </motion.section>

      {/* ===== WHY ATTEND ===== */}
      <motion.section
        className="vb-why"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <motion.div className="vb-why-label" variants={fadeIn}>WHY ATTEND</motion.div>
        <div className="vb-why-content">
          <div className="vb-why-grid">
            <motion.div className="vb-why-col" variants={fadeUp}>
              <h3>What you'll learn</h3>
              <p>
                Hear from industry experts on AI adoption, cloud strategy, and cybersecurity. Get first-look insights into emerging technologies and discover how leading SMBs are leveraging innovation to drive revenue and reduce costs.
              </p>
            </motion.div>
            <motion.div className="vb-why-col" variants={fadeUp} custom={1}>
              <h3>Who you'll meet</h3>
              <p>
                Over 150 business owners, executives, and technology leaders attend Aspire to exchange ideas, build relationships, and find new ways to grow. Connect with peers who share your ambition and challenges.
              </p>
            </motion.div>
          </div>
          <motion.div className="vb-expect" variants={fadeUp} custom={2}>
            <h3>What to expect</h3>
            <p>
              Attend inspiring keynotes, level up with hands-on workshops across four strategic tracks, and walk away with actionable strategies and new connections to fuel your next chapter of growth.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== HIGHLIGHTS ===== */}
      <motion.section
        className="vb-highlights"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div className="vb-highlights-header">
          <motion.div className="vb-highlights-label" variants={fadeIn}>MEMORABLE MOMENTS</motion.div>
          <motion.h2 className="vb-highlights-title" variants={fadeUp}>Highlights from Aspire 2025</motion.h2>
        </div>
        <motion.div className="vb-highlights-grid" variants={stagger}>
          {highlights.map((h, i) => (
            <motion.div key={i} className="vb-highlight-card" variants={fadeUp} custom={i}>
              <div className="vb-highlight-thumb">
                <img src={h.img} alt={h.title} />
                <div className="vb-play-btn">
                  <svg viewBox="0 0 24 24"><polygon points="8,5 20,12 8,19" /></svg>
                </div>
              </div>
              <h4>{h.title}</h4>
              <div className="vb-speaker-name">{h.speaker}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ===== FAQ ===== */}
      <motion.section
        className="vb-faq"
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div className="vb-faq-header">
          <motion.div className="vb-faq-label" variants={fadeIn}>QUESTIONS</motion.div>
          <motion.h2 className="vb-faq-title" variants={fadeUp}>Frequently asked questions</motion.h2>
        </div>
        <div className="vb-faq-list">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={`vb-faq-item ${openFaq === i ? 'open' : ''}`}
              variants={fadeUp}
              custom={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="vb-faq-question">
                {faq.q}
                <span className="vb-faq-arrow">&darr;</span>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    className="vb-faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== TICKETS ===== */}
      <motion.section
        className="vb-tickets"
        id="tickets"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
      >
        <div className="vb-tickets-header">
          <motion.div className="vb-tickets-label" variants={fadeIn}>REGISTER</motion.div>
          <motion.h2 className="vb-tickets-title" variants={fadeUp}>Select your ticket</motion.h2>
        </div>
        <motion.div className="vb-tickets-grid" variants={stagger}>
          <motion.div
            className="vb-ticket-card"
            variants={scaleIn}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <h3>In person</h3>
            <div className="vb-ticket-details">
              Microsoft Technology Center<br />
              New York City, NY
            </div>
            <div className="vb-ticket-price">Free</div>
            <div className="vb-ticket-note">Limited to 150 attendees</div>
            <a href="#" className="vb-ticket-btn">Select in person</a>
          </motion.div>
          <motion.div
            className="vb-ticket-card"
            variants={scaleIn}
            custom={1}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <h3>Virtual</h3>
            <div className="vb-ticket-details">
              Livestream<br />
              Online
            </div>
            <div className="vb-ticket-price">Free</div>
            <div className="vb-ticket-note">Unlimited access to all keynotes</div>
            <a href="#" className="vb-ticket-btn">Select virtual</a>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <motion.footer
        className="vb-footer-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
      >
        <div className="vb-footer-top">
          <motion.div className="vb-footer-logo" variants={fadeUp}>ASPIRE</motion.div>
          <motion.div className="vb-footer-links" variants={fadeUp} custom={1}>
            <div className="vb-footer-link-col">
              <a href="#">Register</a>
              <a href="#faq">FAQ</a>
              <a href="#">Why attend</a>
            </div>
            <div className="vb-footer-link-col">
              <a href="#">X</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
              <a href="#">YouTube</a>
            </div>
          </motion.div>
        </div>
        <motion.div className="vb-footer-bottom" variants={fadeIn} custom={2}>
          <span className="vb-footer-brand">eMazzanti</span>
          <div className="vb-footer-legal">
            <a href="#">Cookie settings</a>
            <a href="#">Event Terms</a>
            <span>&copy; eMazzanti 2026</span>
          </div>
        </motion.div>
      </motion.footer>
    </div>
  )
}

export default VersionB
