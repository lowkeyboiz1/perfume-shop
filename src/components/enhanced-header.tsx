"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Search, Menu, X } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { CartSheet } from "@/components/cart-sheet"
import { cn } from "@/lib/utils"

export function EnhancedHeader() {
  const pathname = usePathname()
  const { cartItems } = useCart()
  const { user } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/products",
      label: "Products",
      active: pathname === "/products",
    },
    {
      href: "/categories",
      label: "Categories",
      active: pathname === "/categories",
    },
  ]

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-300", isScrolled ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" : "bg-background")}>
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <motion.div className="h-8 w-8 rounded-full bg-primary" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} />
              <span className="font-semibold text-lg hidden sm:inline-block">STORE</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {routes.map((route) => {
                const isActive = route.href === pathname
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-sm font-medium transition-colors hover:text-primary relative py-4", route.active ? "text-primary" : "text-muted-foreground")}
                  >
                    {route.label}
                    {route.active && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" layoutId="activeRoute" />}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "300px", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="hidden md:flex items-center relative">
                  <Input type="search" placeholder="Search products..." className="w-full pr-8" />
                  <Button size="icon" variant="ghost" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <Button size="icon" variant="ghost" className="hidden md:flex" onClick={() => setIsSearchOpen(true)}>
                    <Search className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <CartSheet />

            {user ? (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t">
            <nav className="container mx-auto py-4">
              <div className="flex flex-col gap-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn("text-sm font-medium transition-colors hover:text-primary", route.active ? "text-primary" : "text-muted-foreground")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
