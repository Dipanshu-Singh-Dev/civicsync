Here's the revised README with your MongoDB + Prisma stack:

````markdown
# CivicSync - Citizen Issue Reporting Platform

![Project Banner](https://via.placeholder.com/1200x400?text=CivicSync+Community+Engagement+Platform)

A full-stack web platform enabling citizens to report, track, and prioritize civic issues through democratic voting and real-time visualization.

## 🎯 Features

### Authentication (Completed)

✅ JWT-based authentication system  
✅ Session persistence with secure cookies  
✅ Password hashing with bcrypt  
✅ Protected API routes middleware

```prisma
// Prisma Schema
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  issues    Issue[]
  votes     Vote[]
  createdAt DateTime @default(now())
}
```
````

## 🛠 Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19.0-%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-6.3-%23646CFF)
![Radix UI](https://img.shields.io/badge/Radix%20UI-Latest-%23000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-%2338B2AC)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-%23FF6384)
![React Router](https://img.shields.io/badge/React%20Router-7.5-%23CA4245)
![Zustand](https://img.shields.io/badge/Zustand-5.0-%23000000)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-20+-%23339933)
![Express](https://img.shields.io/badge/Express-5.1-%23000000)
![Prisma](https://img.shields.io/badge/Prisma-6.6-%232D3748)
![JWT](https://img.shields.io/badge/JWT-9.0-%23000000)
![bcrypt](https://img.shields.io/badge/bcrypt-5.1-%23003A70)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB-7.0-%2347A248)

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["mongoDb"]
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

## 🗄 Database Structure

```prisma
model Issue {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String
  category    Category
  status      Status   @default(Pending)
  location    Json
  media       String[]
  votes       Vote[]
  author      User     @relation(fields: [authorId], references: [id])
  authorId    String   @db.ObjectId
  createdAt   DateTime @default(now())
}

model Vote {
  id      String @id @default(auto()) @map("_id") @db.ObjectId
  user    User   @relation(fields: [userId], references: [id])
  userId  String @db.ObjectId
  issue   Issue  @relation(fields: [issueId], references: [id])
  issueId String @db.ObjectId
  @@unique([userId, issueId])
}
```

## 🔧 Key Implementation Details

### Auth Flow

```ts
// auth.controller.ts
export const register = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });
};
```

### Security Measures

- Document-level access control via Prisma queries
- Rate limiting with `express-rate-limit`
- Input validation with `zod`
- CSRF protection middleware

## 🚀 Getting Started

1. Clone repo

```bash
git clone https://github.com/yourusername/civicsync.git
```

2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

3. Set up MongoDB (via Atlas or local)

```bash
# .env
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/civicsync?retryWrites=true&w=majority"
```

4. Initialize Prisma

```bash
npx prisma generate
npx prisma db push
```

5. Start development servers

```bash
# Frontend
cd client && npm run dev

# Backend
cd server && npm run dev
```
