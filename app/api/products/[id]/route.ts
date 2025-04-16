import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Product, ProductUpdateInput } from '@/types';

// GET /api/products/[id] - Get a product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json<ApiResponse<null>>(
        { error: 'Product not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Product>>({
      data: product as unknown as Product,
      success: true
    });
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to fetch product', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const data = await request.json() as ProductUpdateInput;
    
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        imageUrl: data.imageUrl,
        category: data.category,
      },
      include: {
        category: true
      }
    });

    return NextResponse.json<ApiResponse<Product>>({
      data: product as unknown as Product,
      success: true
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to update product', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<null>>({
      success: true
    }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to delete product', success: false },
      { status: 500 }
    );
  }
} 