# Event Planner 🗓️

Event Planner is a full-stack web application for managing events, built with **Laravel** and **Angular 19**.  
It supports role-based access (Admin / User), secure authentication, and a clean, scalable architecture inspired by **Clean Architecture** and **Separation of Concerns** principles.

---

## 🚀 Tech Stack

### Backend
- **Laravel**
- **Laravel Sanctum** (API authentication)
- RESTful API
- MySQL (or any Laravel-supported DB)

### Frontend
- **Angular 19**
- **Tailwind CSS**
- Standalone components
- Auth & Role Guards

---

## 🧠 Architecture Overview

This project was designed with maintainability and scalability in mind.

### Backend (Laravel)
- **Controllers** → thin, request/response only  
- **Services** → business logic  
- **Repositories** → data access abstraction  
- **DTOs (Data Transfer Objects)** → clean data flow  
- **Categories, Events, Registrations** clearly separated  
- **Single Responsibility Principle** applied across layers  

> Think of it as a clean-architecture cocktail:  
> controllers + services + repos + DTOs 🍸

### Frontend (Angular)
- Feature-based structure
- **AuthGuard** → protects authenticated routes
- **RoleGuard** → restricts admin-only pages
- Centralized API services
- Clean separation between UI, logic, and data access

---

## 🔐 Authentication & Authorization

- Token-based authentication using **Laravel Sanctum**
- Role-based access control:
  - **Admin**
  - **User**
- Frontend route protection using:
  - `AuthGuard`
  - `RoleGuard`

---

## ✨ Features

### 👤 User
- Browse events with search & filters
- View event details
- Register for events (if places are available)
- View personal registrations
- Secure login & logout

### 🛠️ Admin
- Create, update, delete events
- Manage event categories
- View all user registrations
- Dashboard-ready structure

---

## 📦 Core Domain Models

- **User**
- **Event**
- **Category**
- **Registration**

Relationships are clearly defined and enforced on both backend and frontend.

---

## ⚙️ Setup Instructions

### Backend (Laravel)
```bash
composer install
php artisan migrate --seed
php artisan serve
