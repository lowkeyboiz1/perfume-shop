'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Laptop, Shield, Zap, LineChart } from 'lucide-react'

const features = [
  {
    title: 'Lightning Fast',
    description: 'Optimized for speed and performance, ensuring quick load times and smooth interactions.',
    icon: Zap
  },
  {
    title: 'Responsive Design',
    description: 'Perfectly adapts to any screen size, providing an optimal viewing experience.',
    icon: Laptop
  },
  {
    title: 'Secure & Reliable',
    description: 'Built with security in mind, protecting your data and ensuring reliable operation.',
    icon: Shield
  },
  {
    title: 'Analytics',
    description: 'Built-in analytics to track performance and user engagement metrics.',
    icon: LineChart
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className='bg-muted/50 py-24'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight'>Powerful Features</h2>
          <p className='mt-4 text-lg text-muted-foreground'>Everything you need to build modern websites and applications.</p>
        </div>

        <motion.div ref={ref} variants={containerVariants} initial='hidden' animate={isInView ? 'visible' : 'hidden'} className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className='group relative overflow-hidden'>
                <CardHeader>
                  <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                    <feature.icon className='h-6 w-6 text-primary' />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <div className='absolute inset-0 rounded-lg transition-colors group-hover:bg-primary/5' />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
