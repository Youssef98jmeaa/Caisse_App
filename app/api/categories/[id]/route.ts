import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse, Category, CategoryUpdateInput } from "@/types";

// GET /api/categories/[id] - Get a category by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!category) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Category not found", success: false },
        { status: 404 }
      );
    }

    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Category>>({
      data: category as Category,
      success: true,
    });
  } catch (error) {
    console.error(`Failed to fetch category:`, error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to fetch category", success: false },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    const data = (await request.json()) as CategoryUpdateInput;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
      },
      include: {
        products: true,
      },
    });

    // Cast response type to match our API structure
    return NextResponse.json<ApiResponse<Category>>({
      data: updatedCategory as Category,
      success: true,
    });
  } catch (error) {
    console.error(`Failed to update category:`, error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to update category", success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Invalid category ID", success: false },
        { status: 400 }
      );
    }

    // First, check if category has associated products
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      return NextResponse.json<ApiResponse<null>>(
        { error: "Category not found", success: false },
        { status: 404 }
      );
    }

    // Now TypeScript knows category has products because of the include
    if (category.products.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          error:
            "Cannot delete category with associated products. Please remove products first or reassign them to another category.",
          success: false,
        },
        { status: 400 }
      );
    }

    // Delete the category if there are no associated products
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse<null>>({
      data: null,
      success: true,
    });
  } catch (error) {
    console.error(`Failed to delete category:`, error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to delete category", success: false },
      { status: 500 }
    );
  }
}
