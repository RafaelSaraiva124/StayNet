# 🏨 StayNet

> Modern hotel booking and management platform built with **Next.js**, **TypeScript**, **Neon PostgreSQL**, **Drizzle ORM**, **Stripe** and **Docker**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 About

StayNet is a full-stack hotel reservation and hotel management platform designed to centralise the entire booking workflow into a single application.

Unlike traditional booking websites that focus only on customers, StayNet also provides management tools for hotel partners, allowing them to manage hotels, rooms, reservations, check-ins and check-outs from the same platform.

The platform supports multiple user roles with different permissions and includes secure authentication, online payments and email notifications.

---

## ✨ Features

### 👤 Customer

* User registration and authentication
* Browse hotels
* Search and filter hotels
* View hotel details
* Interactive map (OpenStreetMap)
* Add hotels to favourites
* Shopping cart
* Online booking
* Stripe payment integration
* Booking history
* Password recovery
* Email verification

### 🏨 Hotel Partner

* Register as a partner
* Manage hotel information
* Manage rooms
* Upload hotel images
* Confirm reservations
* Check-in / Check-out management
* Booking dashboard

### 👨‍💼 Administrator

* User management
* Partner management
* Platform administration
* Hotel moderation

---

# 🏗 Architecture

```
               <img width="840" height="830" alt="Arquitetura" src="https://github.com/user-attachments/assets/63dd8b7f-5bba-43b7-9b12-d3e7ceed1b99" />

```

---

## 🚀 Tech Stack

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI

### Backend

* Next.js Server Actions
* API Routes
* Auth.js
* Drizzle ORM

### Database

* Neon PostgreSQL
* Cloudinary

### Services

* Stripe
* Redis
* Resend
* OpenStreetMap

### DevOps

* Docker

---


## 💳 Payments

StayNet integrates **Stripe Checkout** to securely process online payments.

Reservations are only confirmed after successful payment and availability validation.

---

## 📷 Media Storage

Hotel images are stored in **Cloudinary**, keeping the primary database lightweight while providing automatic optimisation and fast content delivery.

---



## 📸 Screenshots

<img width="915" height="466" alt="image" src="https://github.com/user-attachments/assets/3a5e2f26-f1cb-4ce5-a984-ac5f3f3a0cd9" /><img width="915" height="439" alt="image" src="https://github.com/user-attachments/assets/b3eb4242-24c1-4962-b480-def79a237ae8" /><img width="928" height="469" alt="image" src="https://github.com/user-attachments/assets/1992478f-2492-4eba-a4ab-60f43989635f" /><img width="930" height="440" alt="image" src="https://github.com/user-attachments/assets/171868fc-4f3d-4300-8cfc-d8eef9a4825f" /><img width="913" height="430" alt="image" src="https://github.com/user-attachments/assets/132ebda6-746c-4a11-95f7-a30db3926bf7" /><img width="916" height="437" alt="image" src="https://github.com/user-attachments/assets/5f3b6f15-3188-4ce5-a028-8bdeb55bfdab" />






---

## 👨‍💻 Author

**Rafael Saraiva**

Software Engineer

Portfolio: https://portfolio.g0dr.pt

LinkedIn: https://linkedin.com/in/your-linkedin

---

## 📄 License

This project is licensed under the MIT License.
