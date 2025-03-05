export function HeroSection() {
  return (
    <section className='relative mb-8 flex h-[500px] items-center justify-center overflow-hidden rounded-lg'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 bg-gradient-to-r from-black/60 to-black/30' />
        <img src='/placeholder.svg?height=500&width=1200' alt='Hero background' className='h-full w-full object-cover' />
      </div>
      <div className='relative space-y-4 text-center text-white'>
        <h1 className='text-4xl font-bold md:text-6xl'>Welcome to Our Store</h1>
        <p className='mx-auto max-w-2xl text-lg md:text-xl'>Discover our curated collection of premium products at amazing prices.</p>
      </div>
    </section>
  )
}
