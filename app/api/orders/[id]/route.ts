import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Order, OrderUpdateInput } from '@/types';

// GET /api/orders/[id] - Get an order by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Order not found', success: false },
        { status: 404 }
      );
    }

    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Order>>({
      data: order as unknown as Order,
      success: true
    });
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to fetch order', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await request.json() as OrderUpdateInput;
    
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      },
    });

    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Order>>({
      data: order as unknown as Order,
      success: true
    });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to update order', success: false },
      { status: 500 }
    );
  }
} 