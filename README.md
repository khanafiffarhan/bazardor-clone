# 🛒 বাজার দর | BazarDor

### Your Smart Daily Market Price Tracker 🇧🇩

**বাজার দর (BazarDor)** is a modern web application that helps users explore daily market prices of essential products in Bangladesh. Users can browse products by category, compare current prices with previous prices, track price changes, and stay informed about market trends through a clean, responsive interface.

## ✨ Key Features

- **📊 Daily Market Prices** — View the latest available prices of essential products using real-time API data.
- **🔍 Product Categories** — Browse products by categories such as rice and other daily necessities.
- **📈 Price Change Tracking** — Compare today's prices with previous prices and identify price increases or decreases.
- **🔐 User Authentication** — Sign up and sign in using email and password, with social login support where configured.
- **📱 Responsive User Interface** — Enjoy a modern, mobile-friendly experience built with reusable components and a responsive layout.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework and application routing |
| [React](https://react.dev/) | Building interactive user interfaces |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| [Tailwind CSS](https://tailwindcss.com/) | Responsive styling and UI design |
| [Better Auth](https://www.better-auth.com/) | Authentication and session management |
| [MongoDB](https://www.mongodb.com/) | Database for authentication and application data |
| [Lucide React](https://lucide.dev/) | Modern interface icons |
| [React Hot Toast](https://react-hot-toast.com/) | User-friendly notifications |
| REST APIs | Fetching product categories and market prices |

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB connection string

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/bazardor-clone.git
   ```

2. Navigate to the project directory:

   ```bash
   cd bazardor-clone
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and configure your environment variables:

   ```env
   BETTER_AUTH_SECRET=your_secure_secret
   BETTER_AUTH_URL=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string

   # Optional: Social authentication
   # GOOGLE_CLIENT_ID=your_google_client_id
   # GOOGLE_CLIENT_SECRET=your_google_client_secret
   # GITHUB_CLIENT_ID=your_github_client_id
   # GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Market Data APIs

BazarDor uses external APIs to retrieve product and category information.

- **Categories:** `https://api.api-store.workers.dev/api/bazardor/categories`
- **Products:** `https://api.abcz.workers.dev/api/bazardor/products`
- **Product Details:** `https://api.api-store.workers.dev/api/bazardor/products/1`
- **Category Products:** `https://api.api-store.workers.dev/api/bazardor/products?category=chal`

API availability and returned data may vary.

## 📂 Project Highlights

- Reusable React components and organized application structure.
- Type-safe product data handling with TypeScript.
- Server-rendered pages and data revalidation with Next.js.
- Authentication integration with Better Auth.
- Market price comparisons using current and historical price fields.

## 🎯 Project Objective

The goal of BazarDor is to make daily market prices easier to access and understand, helping people in Bangladesh make more informed purchasing decisions.

## 👨‍💻 Developer

**Farhan Khan**  
Full Stack Web Developer

- GitHub: [YOUR_GITHUB_USERNAME](https://github.com/YOUR_GITHUB_USERNAME)

---

<p align="center">
  Built with ❤️ using Next.js and TypeScript.
</p>