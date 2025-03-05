"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import PerfumeScene from "./perfume-scene"

export default function PerfumeShowcase() {
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const perfumes = [
    {
      id: 1,
      name: "LUMINOUS AMBER",
      description: "A warm, sensual fragrance with notes of amber, vanilla, and sandalwood",
      price: "$195",
      color: "#d4a76a",
    },
    {
      id: 2,
      name: "MIDNIGHT ORCHID",
      description: "An intoxicating blend of rare orchids, jasmine, and musk",
      price: "$210",
      color: "#9370db",
    },
    {
      id: 3,
      name: "CRYSTAL ROSE",
      description: "Delicate rose petals infused with bergamot and cedarwood",
      price: "$185",
      color: "#e6b3b3",
    },
  ]

  const yRanges = perfumes.map((_, index) => {
    return [index * 0.3, index * 0.3 + 0.2, index * 0.3 + 0.3]
  })
  const opacityRanges = yRanges.map(() => [0, 1, 0])
  const scaleRanges = yRanges.map(() => [0.8, 1, 0.8])
  const yValues = yRanges.map(() => ["20vh", "0vh", "-20vh"])

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-30 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center">
          <PerfumeScene scrollYProgress={scrollYProgress} />

          {perfumes.map((perfume, index) => {
            const opacity = useTransform(scrollYProgress, yRanges[index], opacityRanges[index])

            const scale = useTransform(scrollYProgress, yRanges[index], scaleRanges[index])

            const y = useTransform(scrollYProgress, yRanges[index], yValues[index])

            return (
              <motion.div
                key={perfume.id}
                style={{ opacity, y, scale }}
                className="absolute w-full max-w-xl px-6 text-center"
              >
                <h2 className="text-5xl md:text-7xl font-serif mb-4" style={{ color: perfume.color }}>
                  {perfume.name}
                </h2>
                <p className="text-lg md:text-xl text-white/80 mb-6 font-light">{perfume.description}</p>
                <p className="text-2xl font-light mb-8">{perfume.price}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full 
                  hover:bg-white/20 transition-colors text-white font-light"
                >
                  DISCOVER
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

