"use client"

import { useState } from "react"
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle, EnhancedCardDescription, EnhancedCardFooter } from "@/components/ui/enhanced-card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { motion } from "framer-motion"

export function ComponentShowcase() {
  const [showMore, setShowMore] = useState(false)

  return (
    <section id="components" className="mt-16">
      <h2 className="text-3xl font-bold mb-8">Component Examples</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Login Card */}
        <EnhancedCard gradient>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Welcome back</EnhancedCardTitle>
            <EnhancedCardDescription>Enter your credentials to access your account</EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent className="space-y-4">
            <EnhancedInput label="Email" type="email" placeholder="Enter your email" />
            <EnhancedInput label="Password" type="password" placeholder="Enter your password" />
          </EnhancedCardContent>
          <EnhancedCardFooter>
            <EnhancedButton className="w-full">Sign in</EnhancedButton>
          </EnhancedCardFooter>
        </EnhancedCard>

        {/* Pricing Card */}
        <EnhancedCard gradient>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Pro Plan</EnhancedCardTitle>
            <EnhancedCardDescription>Perfect for growing businesses</EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="flex items-baseline justify-center mb-4">
              <span className="text-3xl font-bold">$</span>
              <span className="text-5xl font-bold">49</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                All features included
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                24/7 support
              </li>
              <li className="flex items-center">
                <span className="mr-2">✓</span>
                Advanced analytics
              </li>
            </ul>
          </EnhancedCardContent>
          <EnhancedCardFooter>
            <EnhancedButton variant="outline" className="w-full">
              Get Started
            </EnhancedButton>
          </EnhancedCardFooter>
        </EnhancedCard>

        {/* Feature Card */}
        <EnhancedCard gradient>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Smart Analytics</EnhancedCardTitle>
            <EnhancedCardDescription>Get insights into your business performance</EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="space-y-4">
              <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "75%" }} transition={{ duration: 1, ease: "easeOut" }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Usage</span>
                <span className="font-medium">75%</span>
              </div>
              {showMore && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="pt-4 space-y-2">
                  <p className="text-sm text-muted-foreground">Your usage has increased by 23% compared to last month.</p>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 rounded-md bg-primary/10 text-center">
                      <div className="text-lg font-semibold">23%</div>
                      <div className="text-xs text-muted-foreground">Growth</div>
                    </div>
                    <div className="flex-1 p-3 rounded-md bg-primary/10 text-center">
                      <div className="text-lg font-semibold">98%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </EnhancedCardContent>
          <EnhancedCardFooter>
            <EnhancedButton variant="ghost" className="w-full" onClick={() => setShowMore(!showMore)}>
              {showMore ? "Show Less" : "Show More"}
            </EnhancedButton>
          </EnhancedCardFooter>
        </EnhancedCard>
      </div>
    </section>
  )
}
