# 🏥 Medical CRM - Patient Management System

> **A comprehensive healthcare management platform built with modern web technologies**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://crm-medical-app.vercel.app)
[![Backend Repo](https://img.shields.io/badge/Backend-GitHub%20Repo-green?style=for-the-badge)](https://github.com/DamianIanni/tech-case-server)
[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Overview

This is a **full-featured medical CRM application** designed to streamline healthcare operations. Built as a showcase project for recruiters, it demonstrates advanced frontend development skills, modern React patterns, and enterprise-level architecture.

### 🎯 Key Highlights

- **🔐 Multi-role Authentication** - Admin, Manager, and Employee roles with different permissions
- **🏥 Multi-center Management** - Support for multiple medical centers with role-based access
- **👥 Patient Management** - Complete CRUD operations with detailed patient profiles
- **📝 Notes System** - Add, edit, and delete patient notes with real-time updates
- **🎨 Modern UI/UX** - Beautiful, responsive design with dark/light theme support
- **🌐 Internationalization** - Full i18n support (English/Spanish)
- **📊 Data Tables** - Advanced filtering, sorting, and pagination
- **✅ Comprehensive Testing** - 100% test coverage with Jest and React Testing Library

## 🚀 Live Demo

**🔗 [Visit the Live Application](https://tech-case-xbk8.vercel.app/)**

### Demo Credentials

| Role         | Email               | Password      |
| ------------ | ------------------- | ------------- |
| **Admin**    | `demo@admin.com`    | `password123` |
| **Manager**  | `demo@manager.com`  | `password123` |
| **Employee** | `demo@employee.com` | `password123` |

## 🛠️ Tech Stack

### Frontend Core

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework

### UI & Components

- **Shadcn/UI** - Modern component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations
- **Vaul** - Mobile-friendly drawers

### State Management & Data

- **TanStack Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Axios** - HTTP client

### Development & Testing

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

### Internationalization & Theming

- **Next-intl** - Internationalization
- **Next-themes** - Theme management
- **Date-fns** - Date manipulation

## 🏗️ Architecture & Features

### 🔐 Authentication System

- JWT-based authentication with role management
- Protected routes with middleware
- Session persistence with cookies
- Multi-role access control (Admin, Manager, Employee)

### 🏥 Medical Center Management

- Multi-center support with role-based access
- Center switching functionality
- Invitation system for team members
- Center-specific patient and user management

### 👥 Patient Management

- Complete CRUD operations
- Advanced search and filtering
- Patient notes system with real-time updates
- Detailed patient profiles with medical information
- Export capabilities

### 📊 Data Management

- Advanced data tables with sorting, filtering, and pagination
- Real-time updates with optimistic UI
- Comprehensive error handling
- Loading states and skeleton screens

### 🎨 UI/UX Excellence

- Responsive design for all devices
- Dark/light theme support
- Smooth animations and transitions
- Accessible components (WCAG compliant)
- Modern glassmorphism design elements

### 🌐 Internationalization

- Full i18n support (English/Spanish)
- Dynamic language switching
- Localized date and number formatting
- RTL support ready

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   ├── centers/           # Center management
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Shadcn)
│   ├── forms/            # Form components
│   ├── tables/           # Data table components
│   ├── feedback/         # Notifications & alerts
│   └── nav/              # Navigation components
├── hooks/                # Custom React hooks
│   ├── center/           # Center-related hooks
│   ├── patient/          # Patient-related hooks
│   └── team/             # Team management hooks
├── services/             # API services
│   └── api/              # HTTP client & endpoints
├── lib/                  # Utilities & configurations
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DamianIanni/crm-medical-app.git
cd crm-medical-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and start production locally
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

## 🧪 Testing

The project includes comprehensive testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

### Testing Strategy

- **Unit Tests** - Individual component testing
- **Integration Tests** - Component interaction testing
- **API Tests** - Service layer testing
- **Accessibility Tests** - WCAG compliance testing

## 🎨 Design System

### Color Palette

- **Primary**: Rich blue-purple (`oklch(0.55 0.18 280)`)
- **Secondary**: Subtle grays with proper contrast
- **Accent**: Vibrant highlights for CTAs
- **Semantic**: Success, warning, error, and info colors

### Typography

- **Font**: Geist Sans (primary), Geist Mono (code)
- **Scale**: Consistent typographic hierarchy
- **Accessibility**: WCAG AA compliant contrast ratios

### Components

- **Consistent**: Unified design language
- **Accessible**: Screen reader friendly
- **Responsive**: Mobile-first approach
- **Themeable**: Dark/light mode support

## 🔧 Configuration

### Environment Variables

```env
BASE_URL=your_prod_url
BASE_URL_DEV=http://localhost:3000
```

### Customization

The application is highly customizable:

- **Themes**: Modify `globals.css` for color schemes
- **Components**: Extend Shadcn components in `components/ui/`
- **Translations**: Add languages in `messages/`
- **API**: Update endpoints in `services/api/`

## 🚀 Deployment

The application is deployed on **Vercel** with automatic deployments from the main branch.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/DamianIanni/crm-medical-app)

## 🔮 Future Enhancements

### Planned Features

- **📊 Analytics Dashboard** - Patient statistics and insights
- **📅 Appointment Scheduling** - Calendar integration
- **💬 Real-time Chat** - Team communication
- **📱 Mobile App** - React Native companion
- **🔔 Push Notifications** - Real-time updates
- **📄 Report Generation** - PDF exports and analytics

### Technical Improvements

- **🔄 Real-time Updates** - WebSocket integration
- **🔐 Advanced Auth** - OAuth providers, 2FA
- **📈 Performance** - Edge caching, CDN optimization
- **🧪 E2E Testing** - Playwright integration

## 👨‍💻 About the Developer

This project showcases expertise in:

- **Modern React Development** - Hooks, Context
- **TypeScript Mastery** - Advanced types, generics, utility types
- **UI/UX Design** - Accessible, responsive interfaces
- **Testing Excellence** - Comprehensive test coverage
- **Performance Optimization** - Code splitting, lazy loading
- **Architecture Design** - Scalable, maintainable code structure

⭐ **If you found this project impressive, please give it a star!** ⭐
