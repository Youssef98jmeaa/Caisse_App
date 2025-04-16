import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponse, Category, CategoryCreateInput } from '@/types';



// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        products: true
      }
    });
    
    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Category[]>>({
      data: categories as unknown as Category[],
      success: true
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to fetch categories', success: false },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a new category
export async function POST(request: Request) {
  try {
    const data = await request.json() as CategoryCreateInput;
    
    const category = await prisma.category.create({
      data: {
        name: data.name,
      },
      include: {
        products: true
      }
    });
    
    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Category>>(
      { data: category as unknown as Category, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json<ApiResponse<null>>(
      { error: 'Failed to create category', success: false },
      { status: 500 }
    );
  }
} 