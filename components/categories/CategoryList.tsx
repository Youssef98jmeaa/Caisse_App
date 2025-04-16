import {
    Card, CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { CategoryActions } from "./CategoryActions";
import { Category } from "@/types";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
}

export async function CategoryList() {
  const categories = await getCategories();

  if (!categories.length) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>No Categories</CardTitle>
          <CardDescription>
            Add your first category using the form.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                {category.products.length} product{category.products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <CategoryActions category={category} />
          </div>
        </Card>
      ))}
    </div>
  );
} 