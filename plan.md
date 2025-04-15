# Plan: Modern Caisse Application

**Tech Stack:** Next.js, React, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL
**Recommended Runtime/Package Manager:** Bun

---

## Phase 1: Project Setup & Configuration

-   [ ] **Initialize Next.js Project:**
    -   Creates the types folder and the lib folder
-   [ ] **Install shadcn/ui:**
    -   Initialize shadcn/ui: `bunx shadcn-ui@latest init`
    -   Follow the prompts to configure components, colors, and CSS variables.
-   [ ] **Install & Configure Prisma:**
    -   Add Prisma CLI as a dev dependency: `bun add -d prisma`
    -   Add Prisma Client: `bun add @prisma/client`
    -   Initialize Prisma with PostgreSQL: `bunx prisma init --datasource-provider postgresql`
    -   Configure your local PostgreSQL connection URL in the `.env` file (created by `prisma init`). Example: `DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"`

## Phase 2: Database Modeling & Migration

-   [ ] **Define Database Schema:**
    -   Edit `prisma/schema.prisma` to define your data models. Consider models like:
        -   `Product` (id, name, price, description, stock, etc.)
        -   `Category` (id, name) (Optional: Relate to Product)
        -   `Order` (id, createdAt, totalAmount, status, etc.)
        -   `OrderItem` (id, orderId, productId, quantity, priceAtPurchase)
        -   `User` (id, name, role - e.g., cashier, admin) (Optional: For authentication)
-   [ ] **Generate Prisma Client:**
    -   Run `bunx prisma generate` whenever you change the schema.
-   [ ] **Create Initial Database Migration:**
    -   Run `bunx prisma migrate dev --name init` to create the SQL migration file based on your schema and apply it to your database.

## Phase 3: Backend Development (API Routes)

-   [ ] **Create Prisma Service:** (Optional but recommended)
    -   Create a singleton instance of `PrismaClient` (e.g., in `lib/prisma.ts`) to reuse the client connection.
-   [ ] **Develop API Endpoints:**
    -   Create API routes within the `/app/api/` directory using Next.js Route Handlers. Examples:
        -   `/app/api/products/route.ts` (GET for listing, POST for creating)
        -   `/app/api/products/[id]/route.ts` (GET for details, PUT for updating, DELETE for removal)
        -   `/app/api/orders/route.ts` (POST for creating new orders)
        -   `/app/api/categories/route.ts` (GET, POST)
    -   Implement logic within these routes using the Prisma Client to interact with the database.

## Phase 4: Frontend Development (UI & Logic)

-   [ ] **Build UI Components:**
    -   Create reusable React components using standard HTML/JSX and shadcn/ui components (e.g., `Button`, `Input`, `Table`, `Card`, `Dialog`). Install required shadcn/ui components using `bunx shadcn-ui@latest add [component-name]`.
    -   Structure your UI within the `/app` directory (e.g., `/app/dashboard/page.tsx`, `/app/products/page.tsx`, `/app/pos/page.tsx`).
-   [ ] **Implement Core POS Interface:**
    -   Page displaying product list/grid.
    -   Functionality to add products to a virtual cart/order summary.
    -   Display running total.
    -   Button to finalize/create the order (calling the `/api/orders` endpoint).
-   [ ] **Implement Product Management:**
    -   Page(s) to list, view, create, edit, and delete products (calling the relevant `/api/products` endpoints). Use shadcn/ui `Table` and `Dialog`/`Sheet` for forms.
-   [ ] **Implement Order History:** (Optional)
    -   Page to view past orders.
-   [ ] **State Management:**
    -   Use React state management (e.g., `useState`, `useReducer`, Context API) or a library like Zustand or Jotai for managing UI state (like the current cart).
-   [ ] **Data Fetching:**
    -   Fetch data in Server Components or use libraries like `swr` or `react-query` (`@tanstack/react-query`) in Client Components to interact with your API routes.

## Phase 5: Styling & Refinement

-   [ ] **Apply Tailwind CSS:**
    -   Utilize Tailwind utility classes for styling components and layouts.
    -   Customize `tailwind.config.js` and `globals.css` as needed.
-   [ ] **Refine UI/UX:**
    -   Ensure the application is responsive and user-friendly.
    -   Focus on creating an elegant and impressive visual appearance.
    -   Test user flows.

## Phase 6: Testing & Deployment (Optional)

-   [ ] **Testing:**
    -   Write unit/integration tests (e.g., using Jest, Vitest, React Testing Library).
-   [ ] **Build for Production:**
---

**Note on Bun:** Using `bun` instead of `npm` or `yarn` (e.g., `bun install`, `bun run dev`, `bunx prisma ...`) is generally faster for installation, script execution, and running the development server.