# Salon Beauty - Premium Beauty Management System

A modern, full-featured salon management system built with React, TypeScript, and Tailwind CSS. This comprehensive platform provides both customer-facing services and administrative tools for managing a beauty salon business.

## 🌟 Features

### Customer Experience
- **Modern Homepage** with animated sections and interactive elements
- **Service Discovery** with detailed service cards and pricing
- **Online Booking System** for appointments
- **Customer Dashboard** to manage bookings and profile
- **Shopping Cart** functionality for service bundling
- **Responsive Design** optimized for all devices
- **Theme Support** with Light, Dark, and Super Black modes

### Customer Reviews & Ratings
- **Interactive Rating Display** with 2-row grid layout (3 full + 2 partial views)
- **Auto-rotating Reviews** with hover-to-pause functionality
- **Multiple Review Sources** (Website & Google Maps)
- **Smooth Animations** and corner shadow effects

### Admin Management System
- **Comprehensive Dashboard** with business analytics
- **Customer Management** with advanced filtering and search
- **Order Management** with status tracking and payment monitoring
- **Service Management** with ordering and visibility controls
- **Ratings Management** for homepage review control
- **Discount & Promotion Management** with full CRUD operations
  - Create and manage VIP benefits and festival offers
  - Set discount types (percentage or fixed amount)
  - Target specific customer tiers (VIP, Regular, All)
  - Apply to specific services or all services
  - Set usage limits and validity periods with real-time countdown timers
  - Real-time discount status management
  - **Admin-Controlled Visibility**: Only discounts marked as "active" by admin appear on homepage and user dashboard
  - **Database Price Updates**: Discounted prices are stored and updated in database when discounts are applied
  - **Automatic Price Calculation**: Service prices automatically adjust and persist based on applicable active discounts
  - **Time-sensitive Promotions**: Real-time countdown showing "X days left" for urgent bookings
- **VIP Customer Benefits** with exclusive pricing and perks
- **Reusable Data Tables** with pagination, sorting, and search
- **Real-time Status Updates** with toast notifications
- **Visual Discount Indicators** with blinking highlights for festival promotions

### Technical Features
- **Responsive Design System** with semantic tokens
- **Advanced Animations** using Framer Motion
- **Type-Safe Development** with TypeScript
- **Component-Based Architecture** for maintainability
- **Consistent UI/UX** across all pages
- **Performance Optimized** with lazy loading and code splitting

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Theming**: Next-themes with custom theme provider

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd salon-beauty
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── data-table.tsx  # Generic table with pagination
│   │   ├── rating-grid.tsx # Interactive rating display
│   │   ├── theme-provider.tsx
│   │   └── ...
│   ├── admin/              # Admin-specific components
│   └── user/               # User-specific components
├── pages/
│   ├── admin/              # Admin management pages
│   │   ├── AdminDashboard.tsx
│   │   ├── CustomersManagement.tsx
│   │   ├── OrdersManagement.tsx
│   │   ├── RatingsManagement.tsx
│   │   ├── DiscountManagement.tsx
│   │   └── ServiceOrdering.tsx
│   ├── user/               # Customer-facing pages
│   │   ├── UserDashboard.tsx
│   │   ├── UserServices.tsx
│   │   └── UserAppointments.tsx
│   └── Index.tsx           # Homepage
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
└── App.tsx                 # Main application component
```

## 🎨 Design System

### Theme Configuration
The application supports three themes:
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy on the eyes for low-light usage  
- **Super Black**: High contrast OLED-optimized theme

### Color Tokens
Uses semantic color tokens defined in `index.css`:
- `--primary`: Main brand color
- `--secondary`: Secondary actions
- `--accent`: Highlights and special elements
- `--muted`: Subtle text and backgrounds

### Component Patterns
- Consistent spacing using Tailwind's spacing scale
- Reusable component variants using class-variance-authority
- Responsive design with mobile-first approach
- Smooth animations and micro-interactions

## 👥 User Roles & Features

### Customers
- Browse services with detailed information
- Book appointments online
- Manage personal bookings
- View appointment history
- Access responsive mobile interface

### Administrators
- **Dashboard Analytics**: Key business metrics and insights
- **Customer Management**: 
  - View customer profiles with booking history
  - Update customer status (Active/VIP/Inactive)
  - Search and filter customers
- **Order Management**:
  - Track order status and payments
  - Confirm/cancel appointments
  - View detailed order information
- **Service Management**:
  - Control service visibility on homepage
  - Reorder services for optimal display
  - Mark services as popular/featured
- **Rating Management**:
  - Add/edit/delete customer reviews
  - Control review order and visibility
  - Manage both website and Google reviews
- **Discount Management**:
  - Create and edit discount offers with full form validation
  - Set percentage or fixed amount discounts
  - Target specific customer tiers (VIP, Regular, All)
  - Apply discounts to specific services or all services
  - Configure validity periods and usage limits
  - **Admin Activation Control**: Toggle discount status to control visibility on customer-facing pages
  - **Database Integration**: Discounted prices automatically update in database when applied
  - Real-time statistics for active discounts and usage

## 🔧 Configuration

### Environment Setup
The application is designed to work with Lovable's platform and can be easily deployed:

1. **Development**: Run locally with `npm run dev`
2. **Production**: Deploy through Lovable's platform or any static hosting
3. **Database**: Ready for Supabase integration (see DBReadme.md)

### Customization
- **Branding**: Update colors and logos in the design system
- **Services**: Modify service data in respective components
- **Layout**: Adjust responsive breakpoints in Tailwind config

## 📊 Data Management

### Table System
Centralized data table component with features:
- **Pagination**: Server-side pagination support
- **Search**: Real-time search functionality
- **Sorting**: Column-based sorting
- **Filtering**: Status and category filters
- **Actions**: Custom row actions and bulk operations

### State Management
- Local state with React hooks for UI interactions
- Future-ready for backend integration with TanStack Query
- Optimistic updates for better user experience

## 🚀 Deployment

### Lovable Platform
1. Connect your GitHub account in Lovable
2. Push changes to sync automatically
3. Deploy directly from Lovable interface

### Self-Hosting Options
1. Build the project: `npm run build`
2. Deploy the `dist` folder to any static hosting service
3. Configure environment variables for your hosting platform

### Supabase Integration
For full backend functionality:
1. Click the Supabase button in Lovable
2. Connect your Supabase project
3. Configure database tables as per DBReadme.md
4. Set up authentication and RLS policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain component documentation
- Test responsive design on multiple devices
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check DBReadme.md for database schema
- **Issues**: Report bugs via GitHub issues
- **Questions**: Contact the development team
- **Updates**: Follow releases for new features

## 🔮 Roadmap

### Upcoming Features
- Real-time notifications
- Advanced analytics dashboard
- Mobile app companion
- Multi-location support
- Advanced reporting tools
- Integration with payment gateways
- Staff management system
- Inventory tracking

---

**Built with ❤️ using Lovable - The AI-powered web development platform**#   L o o k s n l o v e  
 #   L o o k s n l o v e  
 