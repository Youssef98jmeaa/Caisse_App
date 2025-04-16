import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductCreateInput, ApiResponse, Product } from "@/types";

// GET /api/products - List all products
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId: categoryId } : undefined,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json<ApiResponse<Product[]>>({
      data: products as unknown as Product[],
      success: true,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json<ApiResponse<Product[]>>(
      { error: "Failed to fetch products", success: false },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ProductCreateInput & {
      categoryId?: string;
    };

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock || 0,
        imageUrl: data.imageUrl,
        category: data.categoryId
          ? {
              connect: { id: data.categoryId },
            }
          : undefined,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json<ApiResponse<Product>>(
      { data: product as Product, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json<ApiResponse<null>>(
      { error: "Failed to create product", success: false },
      { status: 500 }
    );
  }
}
