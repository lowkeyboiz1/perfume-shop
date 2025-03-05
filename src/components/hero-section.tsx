export function HeroSection() {
  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden rounded-lg mb-8">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <img
          src="/placeholder.svg?height=500&width=1200"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative text-center text-white space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">Welcome to Our Store</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          Discover our curated collection of premium products at amazing prices.
        </p>
      </div>
    </section>
  )
}

