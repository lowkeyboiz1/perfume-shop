import { EnhancedProductGrid } from "@/components/enhanced-product-grid"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <EnhancedProductGrid />
    </div>
  )
}
