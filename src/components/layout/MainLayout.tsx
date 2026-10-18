import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Header } from './Header'
import { AmbientBackground } from '@/components/common/AmbientBackground'

export interface MainLayoutProps {
  children: ReactNode
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/** Main app shell: header + animated content container, responsive width. */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <AmbientBackground />
      <Header />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8"
      >
        {children}
      </motion.main>
    </div>
  )
}
