// Import types directly from Prisma's generated code
import { Prisma } from '../lib/generated/prisma';

// Re-export Prisma enums
export { Prisma };

// Define PrismaJson type for use in the application
export type PrismaJson<T> = Prisma.JsonValue & T;

// API Response Types - Used for standardizing API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Extended Prisma Types - Add application-specific functionality
// while maintaining compatibility with Prisma's generated types

// Product Types
export type Product = Prisma.ProductGetPayload<{
  include: { category: true }
}>;

export type ProductCreateInput = Prisma.ProductCreateInput;
export type ProductUpdateInput = Prisma.ProductUpdateInput & { id: string };

// Category Types
export type Category = Prisma.CategoryGetPayload<{
  include: { products: true }
}>;

export type CategoryCreateInput = Prisma.CategoryCreateInput;
export type CategoryUpdateInput = Prisma.CategoryUpdateInput & { id: string };

// Order Types
export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true
      }
    },
    user: true
  }
}>;

export type OrderItem = Prisma.OrderItemGetPayload<{
  include: { product: true }
}>;

// Enum type definitions
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type UserRole = 'CASHIER' | 'ADMIN';

export type OrderCreateInput = {
  items: {
    productId: string;
    quantity: number;
    price: number | string | Prisma.Decimal;
  }[];
  userId?: string | null;
  status?: OrderStatus;
};

export type OrderUpdateInput = {
  status: OrderStatus;
};

// User Types
export type User = Prisma.UserGetPayload<{
  include: { orders: true }
}>;

export type UserCreateInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}; 