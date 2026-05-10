import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './App.css'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]

const STATS = [
  { value: '10+', label: 'Years in Aerospace' },
  { value: '250+', label: 'Flight Hours' },
  { value: '3', label: 'Major Platforms' },
  { value: 'CPL', label: 'Pilot License' },
]

const FLIGHT_CREDENTIALS = [
  { icon: '✈', title: 'Commercial Pilot License (CPL)', status: 'active', note: 'Transport Canada' },
  { icon: '🌙', title: 'Private Pilot License + Night Rating', status: 'active', note: 'IFR Group 3' },
  { icon: '📡', title: 'Instrument Rating – IFR Group 3', status: 'active', note: 'Current & Active' },
  { icon: '⏳', title: 'Multi-Engine Rating', status: 'progress', note: 'Actively Pursuing' },
  { icon: '⏳', title: 'IFR Group 1 (IATRA / IATPL)', status: 'progress', note: 'In Progress' },
  { icon: '🩺', title: 'TC Class 1 Medical Certificate', status: 'eligible', note: 'Eligible to Hold' },
]

const EXPERIENCE = [
  {
    period: '2025 – 2026',
    role: 'Electrical Methods Specialist – Centre d\'Excellence Global 7500/6500/5500',
    company: 'Bombardier',
    points: [
      'Develop, audit, and improve manufacturing processes and assembly instructions for electrical installations on Global 7500, 6500, and 5500 platforms',
      'Interpret complex electrical drawings, wiring diagrams, and schematics to create compliant work instructions',
      'Analyze and implement Engineering Change Requests (ECR/PCR) for airworthiness-compliant electrical modifications',
      'Troubleshoot and resolve production Non-Conformity Reports (NCRs), diagnosing root causes and implementing corrective actions',
      'Drive lean initiatives to reduce cycle time and optimize production costs',
    ],
  },
  {
    period: '2025 – Present',
    role: 'Structure & Air Systems Methods Rework Engineer (A220)',
    company: 'Bombardier',
    points: [
      'Lead engineering change management for structure and air systems on the A220 program, ensuring airworthiness compliance',
      'Review and approve engineering modifications (ECR/PCR), assessing production and quality impact',
      'Define and validate tooling and assembly requirements in coordination with engineering, quality, and production',
      'Ensure adherence to Transport Canada, FAA, and EASA regulatory frameworks throughout the change management cycle',
    ],
  },
  {
    period: '2021 – 2025',
    role: 'Electrical Manufacturing Specialist – Simulator Programs',
    company: 'CAE',
    points: [
      'Supported production readiness and technical validation of full-flight simulators including cockpit systems and avionics',
      'Coordinated technical activities troubleshooting complex faults across electrical and avionics subsystems',
      'Gained deep exposure to pilot workflows, flight procedures, and HMI design across multiple aircraft types',
      'Produced technical documentation and system validation reports supporting program readiness milestones',
    ],
  },
  {
    period: '2019 – 2021',
    role: 'Methods Engineering Specialist (Electrical / Air Systems / Structures)',
    company: 'Airbus',
    points: [
      'Supported multi-system engineering across electrical, air, and structural disciplines on commercial aircraft programs',
      'Resolved production non-conformances (NCRs) impacting aircraft readiness and delivery schedules',
      'Ensured compliance with Transport Canada and EASA certification requirements',
      'Coordinated with engineering, quality, and production teams to implement approved modifications',
    ],
  },
  {
    period: '2017 – 2019',
    role: 'Electrical Methods Specialist – Global 7500 / 6500 / 5500',
    company: 'Bombardier',
    points: [
      'Tested and validated electrical harnesses and system integration on Global Express business jet platforms',
      'Managed ECR/PCR implementation, coordinating with engineering and production for accurate integration',
      'Authored and maintained production work instructions, electrical drawings interpretation, and technical documentation',
      'Resolved NCRs and electrical system anomalies; implemented lean initiatives reducing cycle time',
    ],
  },
  {
    period: '2017 – 2019',
    role: 'Aerospace Manufacturing Instructor',
    company: 'École des métiers de l\'aérospatiale / Bombardier',
    points: [
      'Delivered technical instruction in aerospace manufacturing processes, electrical systems, and assembly procedures',
      'Conducted structured briefings, assessments, and evaluations for apprentice aerospace technicians',
    ],
  },
  {
    period: '2015 – 2017',
    role: 'Electrical Assembler',
    company: 'Bombardier Aerospace',
    points: [
      'Installed, tested, and validated aircraft electrical and avionics systems during production and pre-delivery phases',
      'Supported aircraft preparation for production flight tests and customer delivery',
    ],
  },
]

const COMPETENCIES = [
  'Functional Check Flight (FCF) Support',
  'Flight Readiness & Safety of Flight Assessments',
  'Production Flight Test Support',
  'Return-to-Service Flight Checks',
  'Aircraft Systems (Electrical, Air, Structures)',
  'Engineering Change Management (ECR/PCR)',
  'Regulatory Compliance (TC / FAA / EASA)',
  'Technical Documentation & Aircraft Summary Reports',
  'Customer Liaison & Delivery Support',
  'Cross-functional Coordination (Eng. / QA / Production)',
  'NCR Troubleshooting & Resolution',
  'Lean Process Optimization',
]

const TECHNICAL_SKILLS = [
  { category: 'CAD / PLM', items: ['CATIA', 'AutoCAD', 'MicroStation', 'SAP', 'PLM'] },
  { category: 'Aircraft Platforms', items: ['Global 7500', 'Global 6500', 'Global 5500', 'A220 / CSeries'] },
  { category: 'Aircraft Systems', items: ['Electrical', 'Air Systems', 'Structures', 'Avionics (Simulator)'] },
  { category: 'Regulatory', items: ['Transport Canada', 'FAA', 'EASA'] },
  { category: 'Office & Reporting', items: ['Microsoft Office Suite', 'Technical Documentation', 'Work Instructions'] },
  { category: 'Languages', items: ['English (Professional)', 'French (Professional)'] },
]

// Photo gallery entries — placeholders until real photos are provided
const GALLERY = [
  { id: 'g1', placeholder: true, caption: 'Flight Operations', sub: 'CPL Training Hours' },
  { id: 'g2', placeholder: true, caption: 'Global 7500 Production Floor', sub: 'Bombardier Mirabel' },
  { id: 'g3', placeholder: true, caption: 'Cockpit Systems', sub: 'Simulator Qualification — CAE' },
  { id: 'g4', placeholder: true, caption: 'A220 Assembly', sub: 'Airbus Canada' },
  { id: 'g5', placeholder: true, caption: 'Cross-Country IFR', sub: '300nm+ Navigation' },
  { id: 'g6', placeholder: true, caption: 'FCF Readiness Package', sub: 'Pre-Flight Documentation' },
]

// ─── Fade-in section wrapper ─────────────────────────────────────────────────

function Section({ id, children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`section ${className}`}
    >
      {children}
    </motion.section>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [expandedJob, setExpandedJob] = useState(null)

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setNavOpen(false)
  }

  return (
    <div className="app">
      {/* ── Navigation ── */}
      <header className="nav">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => scrollTo('about')}>
            <span className="nav-logo-main">A. AMASHA</span>
            <span className="nav-logo-sub">CPL · FCF Specialist</span>
          </button>

          <nav className="nav-links desktop">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`nav-link ${activeSection === id ? 'active' : ''}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <a href="mailto:amashaahmed@icloud.com" className="nav-cta">
            Contact
          </a>

          <button className="hamburger" onClick={() => setNavOpen((o) => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              className="nav-mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {NAV_LINKS.map(({ id, label }) => (
                <button key={id} onClick={() => scrollTo(id)} className="nav-mobile-link">
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-grid">
          {/* Animated runway lines */}
          <div className="runway">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="runway-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
        </div>

        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="badge-dot" />
            Commercial Pilot · CPL · IFR Group 3
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Ahmed
            <br />
            <span className="hero-name-accent">Amasha</span>
          </motion.h1>

          <motion.p
            className="hero-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Flight Support & Functional Check Flight Specialist
          </motion.p>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Bombardier · Airbus · CAE &nbsp;|&nbsp; Montréal, Canada
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <button className="btn-primary" onClick={() => scrollTo('experience')}>
              View Experience
            </button>
            <button className="btn-outline" onClick={() => scrollTo('credentials')}>
              Flight Credentials
            </button>
          </motion.div>
        </div>

        {/* Stat bar */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="hero-stat">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="scroll-cue"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          ↓
        </motion.div>
      </div>

      {/* ── About ── */}
      <Section id="about">
        <div className="section-header">
          <span className="section-tag">01 — PROFILE</span>
          <h2>Professional Summary</h2>
        </div>
        <div className="about-grid">
          <div className="about-text">
            <p>
              Aviation professional with a <strong>Commercial Pilot License (CPL)</strong> and over{' '}
              <strong>10 years of aerospace experience</strong> across Bombardier, Airbus, and CAE.
              Proven expertise spanning electrical methods engineering, engineering change management
              (ECR/PCR), NCR resolution, and lean process improvement across{' '}
              <strong>Global 7500/6500/5500</strong> and <strong>A220</strong> platforms.
            </p>
            <p>
              Combines pilot operational knowledge with hands-on engineering depth in electrical
              systems, air systems, and structures to support{' '}
              <strong>Functional Check Flights</strong>, production flight tests,
              return-to-service checks, and aircraft delivery operations.
            </p>
            <p>
              Grounded in Transport Canada regulatory requirements with a strong eagerness to
              expand expertise across FAA and EASA certification frameworks. Strong communicator
              experienced in cross-functional coordination with engineering, quality, production,
              and customer-facing teams.
            </p>
          </div>
          <div className="about-highlights">
            <div className="highlight-card">
              <div className="highlight-icon">✈</div>
              <div>
                <h4>Dual Identity</h4>
                <p>One of very few professionals who has worked on the Global 7500 at component level and can also fly it.</p>
              </div>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🛠</div>
              <div>
                <h4>Full-Platform Depth</h4>
                <p>From FTV electrical assembly to methods rework engineering — cockpit through tail on the Global family.</p>
              </div>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">📋</div>
              <div>
                <h4>Regulatory Fluency</h4>
                <p>TCCA OEB Rev.3, TCDS BD-700-2A12, EASA TCDS IM.E.113 — NCR to airworthiness sign-off chain.</p>
              </div>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🌐</div>
              <div>
                <h4>Bilingual Professional</h4>
                <p>Full professional fluency in English and French — bridging engineering, QA, production, and flight ops.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Credentials ── */}
      <Section id="credentials" className="section-alt">
        <div className="section-header">
          <span className="section-tag">02 — FLIGHT CREDENTIALS</span>
          <h2>Pilot Qualifications</h2>
        </div>
        <div className="credentials-grid">
          {FLIGHT_CREDENTIALS.map(({ icon, title, status, note }) => (
            <div key={title} className={`credential-card status-${status}`}>
              <div className="credential-icon">{icon}</div>
              <div className="credential-info">
                <h4>{title}</h4>
                <span className="credential-note">{note}</span>
              </div>
              <div className={`credential-badge badge-${status}`}>
                {status === 'active' ? 'Active' : status === 'progress' ? 'In Progress' : 'Eligible'}
              </div>
            </div>
          ))}
        </div>
        <div className="credentials-callout">
          <div className="callout-icon">💡</div>
          <p>
            <strong>250+ flight hours</strong> including cross-country IFR legs ≥ 300 nm. Instrument rated and
            multi-engine qualified in Group 3. Group 1 multi-engine IFR actively in progress.
          </p>
        </div>
      </Section>

      {/* ── Experience ── */}
      <Section id="experience">
        <div className="section-header">
          <span className="section-tag">03 — CAREER TIMELINE</span>
          <h2>Professional Experience</h2>
        </div>
        <div className="timeline">
          {EXPERIENCE.map((job, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot" />
                <div className="marker-line" />
              </div>
              <div className="timeline-content">
                <div className="timeline-header" onClick={() => setExpandedJob(expandedJob === i ? null : i)}>
                  <div className="timeline-meta">
                    <span className="timeline-period">{job.period}</span>
                    <span className="timeline-company">{job.company}</span>
                  </div>
                  <h3 className="timeline-role">{job.role}</h3>
                  <button className="timeline-toggle" aria-label="expand">
                    {expandedJob === i ? '−' : '+'}
                  </button>
                </div>
                <AnimatePresence initial={false}>
                  {expandedJob === i && (
                    <motion.ul
                      className="timeline-points"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {job.points.map((pt, j) => (
                        <li key={j}>{pt}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Skills ── */}
      <Section id="skills" className="section-alt">
        <div className="section-header">
          <span className="section-tag">04 — CAPABILITIES</span>
          <h2>Skills & Competencies</h2>
        </div>
        <div className="skills-layout">
          <div>
            <h3 className="skills-sub-heading">Core Competencies</h3>
            <div className="competencies-grid">
              {COMPETENCIES.map((c) => (
                <div key={c} className="competency-chip">
                  <span className="chip-check">✓</span> {c}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="skills-sub-heading">Technical Skills</h3>
            <div className="tech-skills">
              {TECHNICAL_SKILLS.map(({ category, items }) => (
                <div key={category} className="tech-group">
                  <span className="tech-category">{category}</span>
                  <div className="tech-items">
                    {items.map((item) => (
                      <span key={item} className="tech-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Gallery ── */}
      <Section id="gallery">
        <div className="section-header">
          <span className="section-tag">05 — VISUAL RECORD</span>
          <h2>Career Highlights</h2>
          <p className="section-note">Photos from flight operations, production floor, and career milestones coming soon.</p>
        </div>
        <div className="gallery-grid">
          {GALLERY.map(({ id, placeholder, caption, sub, src }) => (
            <div key={id} className="gallery-card">
              {placeholder ? (
                <div className="gallery-placeholder">
                  <div className="placeholder-icon">
                    {caption.includes('Flight') || caption.includes('IFR') || caption.includes('Cockpit') ? '✈' :
                     caption.includes('Global') ? '🛩' :
                     caption.includes('A220') ? '✈' : '📋'}
                  </div>
                  <span className="placeholder-label">Photo Coming Soon</span>
                </div>
              ) : (
                <img src={src} alt={caption} className="gallery-img" />
              )}
              <div className="gallery-caption">
                <strong>{caption}</strong>
                <span>{sub}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="gallery-note">
          To add photos: place image files in <code>public/photos/</code> and update the GALLERY array in App.jsx.
        </p>
      </Section>

      {/* ── Contact ── */}
      <Section id="contact" className="section-alt">
        <div className="section-header">
          <span className="section-tag">06 — GET IN TOUCH</span>
          <h2>Contact</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">✉</div>
            <div>
              <span className="contact-label">Email</span>
              <a href="mailto:amashaahmed@icloud.com" className="contact-value">
                amashaahmed@icloud.com
              </a>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <div>
              <span className="contact-label">Phone</span>
              <a href="tel:+14389924234" className="contact-value">
                +1 (438) 992-4234
              </a>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <div>
              <span className="contact-label">Location</span>
              <span className="contact-value">Montréal / Laval, Quebec, Canada</span>
            </div>
          </div>
          <div className="contact-card">
            <div className="contact-icon">🏢</div>
            <div>
              <span className="contact-label">Available For</span>
              <span className="contact-value">Mirabel-based operations</span>
            </div>
          </div>
        </div>

        <div className="contact-platforms">
          <h3>Target Roles</h3>
          <div className="platforms-row">
            {['FCF Support Specialist', 'Flight Test Support', 'Aircraft Delivery Ops', 'Methods Engineering', 'Production Flight Test'].map((r) => (
              <span key={r} className="platform-tag">{r}</span>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <span>AHMED AMASHA</span>
            <span className="footer-sub">CPL · FCF Specialist · Montréal</span>
          </div>
          <div className="footer-links">
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollTo(id)} className="footer-link">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ahmed Amasha. All rights reserved.</span>
          <span>Bombardier · Airbus · CAE</span>
        </div>
      </footer>
    </div>
  )
}
