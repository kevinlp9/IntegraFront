import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart3,
  GraduationCap,
  LogIn,
  MessageSquare,
  Radio,
  Sparkles,
  Users,
  UserPlus,
} from 'lucide-react'
import { AmbientBackground } from '@/components/common/AmbientBackground'
import { Logo } from '@/components/common/Logo'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'

const FEATURES = [
  {
    icon: Users,
    title: 'Grupos del semestre',
    description:
      'Crea tus grupos, administra la lista de alumnos y conserva el historial completo del semestre en un solo lugar.',
  },
  {
    icon: BarChart3,
    title: 'Acumulado de calificaciones',
    description:
      'Suma parcial 1, 2, 3, extraordinario y la calificación del profesor para obtener automáticamente el promedio final.',
  },
  {
    icon: Radio,
    title: 'Evaluación en vivo',
    description:
      'Activa salas por equipo o individuales y recibe las calificaciones de todo el grupo en tiempo real.',
  },
  {
    icon: MessageSquare,
    title: 'Retroalimentación por alumno',
    description:
      'Cada alumno consulta su calificación y retroalimentación en cada evento desde su propia cuenta.',
  },
] as const

const STEPS = [
  {
    role: 'Profesor',
    icon: Sparkles,
    items: [
      'Crea tu grupo y registra la lista de alumnos con boleta y nombre.',
      'Comparte el código del grupo y aprueba a quienes se inscriben.',
      'Abre salas por equipo o individuales en cada parcial.',
      'Consulta el acumulado y el promedio final del semestre.',
    ],
  },
  {
    role: 'Alumno',
    icon: GraduationCap,
    items: [
      'Regístrate y únete a tu grupo con tu nombre y boleta.',
      'Confirma tu identidad con tu contraseña y correo.',
      'Participa en cada sala desde tu celular.',
      'Revisa tu calificación y retroalimentación de cada evento.',
    ],
  },
] as const

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

/** Public landing page: platform overview plus entry points to login/register. */
export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="secondary" size="sm">
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm">
              <UserPlus className="h-4 w-4" />
              Registrarse
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.section
          initial="initial"
          animate="animate"
          variants={fadeUp}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center py-16 text-center sm:py-24"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-body-sm font-medium text-primary-200">
            <Sparkles className="h-4 w-4" />
            Tu salón de clases del semestre
          </span>
          <h1 className="max-w-3xl font-display text-h1 text-text-primary">
            Gestiona tus grupos y lleva el{' '}
            <span className="text-gradient">acumulado de calificaciones</span>
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-text-secondary">
            Integra reúne a profesores y alumnos en un mismo espacio: crea
            grupos, evalúa en vivo por equipo o individual, y obtén el promedio
            final del semestre con la retroalimentación de cada evento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button size="lg" fullWidth>
                <UserPlus className="h-5 w-5" />
                Crear cuenta gratis
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" fullWidth>
                <LogIn className="h-5 w-5" />
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </motion.section>

        {/* Features */}
        <section className="pb-16 sm:pb-24">
          <div className="mb-10 text-center">
            <h2 className="font-display text-h2 text-text-primary">
              Todo tu semestre en una sola plataforma
            </h2>
            <p className="mt-2 text-body-sm text-text-secondary">
              Desde la lista de tu grupo hasta el promedio final, con
              evaluación en vivo cuando la necesites.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <Card className="h-full">
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-h3 text-text-primary">{title}</h3>
                  <p className="mt-2 text-body-sm text-text-secondary">
                    {description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="pb-20 sm:pb-28">
          <div className="mb-10 text-center">
            <h2 className="font-display text-h2 text-text-primary">
              ¿Cómo funciona?
            </h2>
            <p className="mt-2 text-body-sm text-text-secondary">
              Un flujo simple tanto para quien imparte como para quien
              aprende.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {STEPS.map(({ role, icon: Icon, items }) => (
              <Card key={role} variant="outlined">
                <div className="mb-4 flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/15 text-primary-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-h3 text-text-primary">{role}</h3>
                </div>
                <ol className="space-y-3">
                  {items.map((item, i) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-caption font-bold text-text-secondary">
                        {i + 1}
                      </span>
                      <span className="text-body-sm text-text-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-caption text-text-secondary">
        © {new Date().getFullYear()} Integra · Tu salón de clases del semestre
      </footer>
    </div>
  )
}
