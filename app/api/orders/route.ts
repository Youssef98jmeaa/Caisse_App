import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order, OrderCreateInput } from '@/types';

// GET /api/orders - List all orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Order[]>>({
      data: orders as unknown as Order[],
      success: true
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to fetch orders', success: false },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const data = await request.json() as OrderCreateInput;
    
    // Calculate total based on the items
    let totalAmount = 0;
    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      
      if (!product) {
        return NextResponse.json<ApiResponse<null>>(
          { error: `Product with ID ${item.productId} not found`, success: false },
          { status: 400 }
        );
      }
      
      totalAmount += Number(product.price) * item.quantity;
      
      // Update product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }
    
    // Create the order
    const order = await prisma.order.create({
      data: {
        totalAmount,
        status: data.status || 'PENDING',
        userId: data.userId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true
      },
    });
    
    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Order>>({
      data: order as unknown as Order,
      success: true
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to create order', success: false },
      { status: 500 }
    );
  }
} 