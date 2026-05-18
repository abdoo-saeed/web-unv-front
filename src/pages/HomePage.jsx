import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function HomePage() {
  return (
    <section className="page hero-page">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        Welcome
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
      >
        Welcome to Saraha App
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
      >
        Send anonymous messages, view your inbox, and manage your profile — all with smooth routing.
      </motion.p>

      <motion.div
        className="hero-actions"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <Link to="/send-message" className="btn btn-primary">
          Send Message
        </Link>
        <Link to="/get-message" className="btn btn-secondary">
          My Messages
        </Link>
        <Link to="/profile" className="btn btn-secondary">
          Profile
        </Link>
      </motion.div>

      <motion.div
        className="feature-grid"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.25 },
          },
        }}
      >
        {[
          {
            title: 'Send anonymously',
            body: 'Write a message to any user without revealing who you are.',
          },
          {
            title: 'Read your inbox',
            body: 'See the anonymous messages you received in one place.',
          },
          {
            title: 'Manage your profile',
            body: 'Update your details and upload a profile image.',
          },
        ].map((card) => (
          <motion.article
            key={card.title}
            className="card"
            variants={{
              hidden: { opacity: 0, y: 14, scale: 0.98 },
              show: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
          >
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}

export default HomePage
