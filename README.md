# 🛒 Snapcart — Grocery Delivery Platform

A full-stack, real-time grocery delivery platform built with **Next.js**, featuring role-based dashboards for admins, delivery personnel, and customers — complete with live order tracking, in-app chat, and AI-powered reply suggestions.

---

## ✨ Features

### 👤 Customer (User)
- Browse groceries by category with an animated category slider
- Add/remove items from cart with quantity controls (Redux-managed)
- Place orders via Cash on Delivery or Online Payment
- Track orders in real time on a live map
- View assigned delivery boy details and call directly
- Receive real-time order status updates via WebSocket

### 🏪 Admin
- Dashboard with key stats: total orders, customers, revenue, and pending deliveries
- Revenue filtering by today, last 7 days, or all time
- Interactive bar chart showing order trends over the last 6 days
- Manage and update order statuses in real time
- View assigned delivery personnel per order
- Admin sidebar panel with grocery and order management links

### 🛵 Delivery Boy
- View and accept/reject incoming delivery assignments (via WebSocket)
- Live GPS location broadcasting to the server via Socket.io
- Real-time map showing delivery address and delivery boy position with a connecting polyline
- In-app chat with customers, including AI-powered quick reply suggestions
- OTP-based delivery confirmation flow

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion (`motion/react`) |
| State Management | Redux Toolkit |
| Authentication | NextAuth.js (Credentials + Google OAuth) |
| Database | MongoDB (via Mongoose) |
| Real-Time | Socket.io |
| Maps | React Leaflet + OpenStreetMap |
| Charts | Recharts |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## 📁 Project Structure

```
├── components/
│   ├── AdminDashBoard.tsx          # Server component — fetches orders, users, stats
│   ├── AdminDashBoardClient.tsx    # Client component — charts, earnings filter
│   ├── AdminOrderCard.tsx          # Order card with status management (admin view)
│   ├── CategorySlider.tsx          # Auto-scrolling horizontal category slider
│   ├── DeliveryBoyDashBoard.tsx    # Delivery dashboard with GPS, OTP, chat
│   ├── DeliveryChat.tsx            # Real-time chat with AI reply suggestions
│   ├── EditRoleMobile.tsx          # Role & mobile number setup on first login
│   ├── GeoUpdater.tsx              # Background GPS broadcaster via Socket.io
│   ├── GroceryItemCard.tsx         # Product card with add-to-cart controls
│   ├── HeroSection.tsx             # Auto-sliding hero banner
│   ├── LiveMap.tsx                 # Real-time map with delivery boy + user pins
│   ├── Navbar.tsx                  # Role-aware navbar with search, cart, profile
│   ├── RegisterForm.tsx            # Registration form with Google OAuth option
│   ├── UserDashBoard.tsx           # Server component — renders grocery listing
│   ├── UserOrderCard.tsx           # Order card with tracking button (user view)
│   └── Welcome.tsx                 # Onboarding welcome screen
├── lib/
│   ├── db.ts                       # MongoDB connection helper
│   └── socket.ts                   # Socket.io client singleton
├── models/
│   ├── grocery.model.ts
│   ├── order.model.ts
│   ├── user.model.ts
│   └── message.model.ts
├── redux/
│   ├── cartSlice.ts
│   └── store.ts
└── app/
    └── api/                        # Next.js API routes
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Google OAuth credentials (for Google Sign-In)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/snapcart.git
cd snapcart

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Socket.io server (if separate)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Roles & Access

Snapcart uses a role-based access system. On first login, users choose their role and enter their mobile number.

| Role | Access |
|---|---|
| `user` | Browse products, cart, checkout, order tracking |
| `admin` | Dashboard, grocery management, order management |
| `delivery` | Delivery assignments, live map, OTP confirmation |

> Only one admin account is permitted. Once an admin exists, the admin role is hidden from the role selector.

---

## 🗺️ Real-Time Features

Snapcart uses **Socket.io** for all real-time functionality:

- `update-location` — Delivery boy broadcasts GPS coordinates
- `new-assignment` — Admin pushes new delivery assignments to delivery boys
- `order-status-update` — Status changes propagate instantly to user and admin views
- `sendMessage` / `joinRoom` — Per-order chat rooms between customer and delivery boy

---

## 🤖 AI Chat Suggestions

The in-app delivery chat includes an **AI Suggest** button powered by the `/api/chat/ai_suggestions` endpoint. It reads the last customer message and returns context-aware quick replies for the delivery boy, reducing response friction during active deliveries.

---

## 📦 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/user/edit_role_mobile` | Set user role and mobile |
| GET | `/api/check_for_admin` | Check if an admin already exists |
| GET | `/api/delivery/get_assignment` | Fetch pending delivery assignments |
| GET | `/api/delivery/current_order` | Get active delivery order |
| GET | `/api/delivery/assignment/:id/accept_assignment` | Accept a delivery |
| POST | `/api/delivery/otp/send` | Send delivery OTP to customer |
| POST | `/api/delivery/otp/verify` | Verify OTP and mark as delivered |
| POST | `/api/admin/update_order_status/:id` | Update order status |
| POST | `/api/chat/messages` | Fetch chat history for an order |
| POST | `/api/chat/ai_suggestions` | Get AI quick-reply suggestions |

---

## 📸 UI Highlights

- **Hero Section** — Full-screen auto-sliding banner with background images, smooth fade transitions, and dot indicators
- **Category Slider** — Auto-scrolling horizontal slider with manual navigation arrows, scroll-aware button visibility
- **Grocery Cards** — Hover zoom effect, animated add-to-cart with inline quantity controls
- **Admin Earnings Card** — Switchable between today / 7-day / total revenue views
- **Live Map** — Dual markers (user + delivery boy) with a green polyline and auto-recentering
- **Delivery Chat** — Animated message bubbles, auto-scroll to latest, AI suggestion chips

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

<p align="center">Built with ❤️ using Next.js, Socket.io, and MongoDB</p>