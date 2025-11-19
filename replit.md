# EtMday BCI - Aplicación Tótem Touch

## Overview
This project is an interactive web application designed for BCI's EtMday events. Its primary purpose is to facilitate the scheduling of mentorships via touch-enabled totems in a vertical orientation (1080x1920), with responsive support for tablets. The application aims to provide a seamless user experience for event attendees to register, select services, and receive mentorship QR codes.

## User Preferences
I prefer iterative development with clear communication at each stage. Please ask for confirmation before implementing significant changes or making major architectural decisions. I value a clean, readable codebase with well-documented decisions. Ensure all user-facing text is in Spanish.

## System Architecture

### UI/UX Decisions
The application features a responsive design primarily for vertical orientation (1080x1920) on kiosks, with adaptability for tablets. It uses BCI brand colors. All UI elements are scaled using `vh/vw` units based on a 1080x1920 base resolution to ensure consistent scaling. Touch targets are dynamically calculated to be at least 48px. Images are full-screen with `object-fit: cover`. The design includes 6 fluid pages optimized for touch interaction, with seamless transitions. Critical information, such as QR codes, remains visible across all application states (loading, success, error).

### Technical Implementations
- **Frontend**: Built with React 18 and TypeScript, utilizing Wouter for SPA navigation, Shadcn components with Tailwind CSS for UI, React Hook Form and Zod for form validation, `qrcode.react` for QR generation, and TanStack Query v5 for state management.
- **Backend**: Implemented with Express.js and TypeScript, using PostgreSQL (Neon) as the database and Drizzle ORM for database interactions. A custom `DatabaseStorage` implements an `IStorage` interface for data persistence.
- **Responsive System**: Utilizes `calc(value / 1080 * 100vw)` and `calc(value / 1920 * 100vh)` for responsive scaling. `clamp()` is used for fluid sizing of form elements.
- **Touch Optimizations**: Includes `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent`, with minimum 48x48px touch targets and `user-scalable=no` in the viewport.
- **Virtual Keyboard**: Custom integrated virtual keyboard component (`VirtualKeyboard.tsx`) for kiosk touch interface with three modes (text, numeric, email). All form inputs are `readOnly` and trigger the virtual keyboard on focus. Keyboard features include uppercase/lowercase toggle, backspace, clear, and close functionality.
- **Validation**: Frontend validation uses Zod resolvers with React Hook Form, while backend validation also employs Zod schemas. Shared schemas (`shared/schema.ts`) ensure consistency. Specific Chilean RUT (Module 11 algorithm) and phone number (+569XXXXXXXX) validations are implemented.
- **Error Handling**: Features visual and descriptive error states, preserves console data for staff, and provides clear action buttons. QR codes are always displayed, even in error states (with reduced opacity).
- **Data Testids**: Comprehensive `data-testids` are used across the application for robust end-to-end testing with Playwright.

### Feature Specifications
- **User Flow**:
    1.  **Inicio (`/`)**: Full-screen background image, click anywhere to proceed.
    2.  **Bienvenida (`/bienvenida`)**: Full-screen background image, click anywhere to proceed.
    3.  **Registro (`/registro`)**: Full-page form with fields for Name, Chilean RUT (validated), Phone (validated), Email, Sales Level (4 options, saved to DB), and optional Company RUT with toggle. Real-time Zod validation and automatic RUT formatting. All text inputs use integrated virtual keyboard for kiosk touch interface.
    4.  **Selección de Servicio (`/seleccion-servicio`)**: Allows users to choose between "Mentorías" and "Jugar Activación". Features a layered design with a large mascot and compact service cards.
        -   If only "Jugar Activación" is selected, data is saved, a toast is shown, and the app returns to home after 3s.
        -   If "Mentorías" is selected (alone or with "Jugar Activación"), proceeds to Category Selection.
    5.  **Selección Categoría (`/seleccion-categoria`)**: Users select one of four mentorship categories (e.g., Servicios Financieros, Marketing y Ventas).
    6.  **Confirmación (`/confirmacion`)**: Displays dynamic text and a static QR code based on the selected mentorship category. Handles backend registration (POST `/api/registrations`), shows loading states with a visible QR code, and manages success/error states, returning to home after 30s.
- **Data Model**: `registrations` table in PostgreSQL storing user details, service selections, and mentorship category. `nivelVentas` is an enum with predefined values.
- **QR Code Management**: Uses static QR image files (`.png`) for each mentorship category. A robust `getQRCodeForCategory()` function normalizes input and provides a guaranteed fallback QR.

## External Dependencies

-   **Database**: PostgreSQL (specifically Neon for deployment).
-   **ORM**: Drizzle ORM.
-   **Frontend Libraries**: React, TypeScript, Wouter, Shadcn, Tailwind CSS, React Hook Form, Zod, `qrcode.react`, TanStack Query.
-   **Backend Libraries**: Express.js.