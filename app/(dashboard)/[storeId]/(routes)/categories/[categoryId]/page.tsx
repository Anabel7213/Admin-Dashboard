import prismadb from "@/lib/prismadb";

import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params
}: {
  params: { categoryId: string, storeId: string }
}) => {
  if(params.categoryId === "new") {
    return ( 
      <div className="flex-col">
        <div className="flex-1 space-y-4 py-8 px-4 pt-6">
          <CategoryForm initialData={null} />
        </div>
      </div>
    );
  }
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 py-8 px-4 pt-6">
        <CategoryForm initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;