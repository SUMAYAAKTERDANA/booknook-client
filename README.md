# BookNook - A Small Online Library

**Live Site:**  [Click Here to Visit BookNook](https://booknook-client-alpha-lemon.vercel.app/)

## Project Overview
BookNook is a small online library where users can explore a vast collection of books, add their own books to share with the community, and borrow books for a few days. The core idea is simple: "Add a book, borrow a book, return a book."

## Features
- 📚 **Browse Books:** Explore a wide collection of books across different categories on the Home and All Books pages.
- 🔐 **Secure Authentication:** User registration and login with BetterAuth (Email/Password & Google Social Login).
- ➕ **Add Books:** Logged-in users can add new books with image uploads (via ImgBB), title, author, category, and description.
- 📖 **Borrow System:** Users can borrow available books, with automatic tracking of borrow and return dates. The total available copies decrease upon borrowing and increase upon returning.
- 🔄 **My Borrows & Return:** Users can view all the books they have borrowed and return them with a single click.
- ✏️ **Manage Books (CRUD):** Users can view, edit, and delete the books they have added in the "My Books" section.
- 📱 **Fully Responsive:** Beautiful, modern UI built with Tailwind CSS and Shadcn UI, optimized for mobile, tablet, and desktop views.
- 🛡️ **JWT Protected APIs:** Secure backend API routes using JSON Web Tokens (JWT) for authorized actions.

## Tech Stack
### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS & Shadcn UI
- **Authentication:** BetterAuth (MongoDB Adapter)
- **Animations & Icons:** Swiper.js, Lucide React

### Backend
- **Server:** Express.js (Node.js)
- **Database:** MongoDB
- **Security:** JWT (JSON Web Tokens), CORS

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/SUMAYAAKTERDANA/booknook-client.git