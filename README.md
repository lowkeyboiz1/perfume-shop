# Perfume Shop

A perfume e-commerce application built with Next.js, MongoDB, and React Query.

## Tech Stack

- **Backend**: Next.js API Routes + MongoDB (using native `mongodb` package)
- **Frontend**: Next.js + Tailwind CSS
- **State/Data Fetching**: React Query

## Features

- [x] API Products (CRUD)
- [x] API Orders (CRUD)
- [x] Product interface (name, description, price, discount)
- [x] Simple order form without login (IP tracking)
- [x] Order management dashboard
- [x] Revenue statistics by day/week/month (filterable)
- [x] Clean React Query structure (`api/`, `queries/`, `components/`)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/perfume-shop?retryWrites=true&w=majority
   ```
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products?category=men` - Get products by category
- `GET /api/products/{id}` - Get a single product
- `POST /api/products` - Create a new product
- `PUT /api/products/{id}` - Update a product
- `DELETE /api/products/{id}` - Delete a product

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders?status=pending` - Get orders by status
- `GET /api/orders?startDate=2023-01-01&endDate=2023-01-31` - Get orders by date range
- `GET /api/orders/{id}` - Get a single order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/{id}` - Update an order
- `DELETE /api/orders/{id}` - Delete an order
- `GET /api/orders/stats` - Get order statistics
