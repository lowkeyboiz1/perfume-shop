"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EnhancedProductCard } from "@/components/enhanced-product-card"
import { products } from "@/data/products"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Grid, List, SlidersHorizontal } from "lucide-react"

type ViewMode = "grid" | "list"
type SortOption = "featured" | "price-asc" | "price-desc" | "name"

export function EnhancedProductGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sort, setSort] = useState<SortOption>("featured")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = Array.from(new Set(products.map((product) => product.category)))

  const filteredProducts = products
    .filter((product) => (selectedCategory === "all" || product.category === selectedCategory) && product.price >= priceRange[0] && product.price <= priceRange[1])
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <h2 className="text-2xl font-bold">Featured Products</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border rounded-md p-1">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border rounded-lg p-4 mb-8 space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button variant={selectedCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory("all")}>
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Price Range</label>
                <div className="mt-2 flex items-center gap-4">
                  <Input type="number" placeholder="Min" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="w-24" />
                  <span>to</span>
                  <Input type="number" placeholder="Max" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="w-24" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="grid gap-6"
        style={{
          gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr",
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EnhancedProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found matching your criteria</p>
        </motion.div>
      )}
    </div>
  )
}
