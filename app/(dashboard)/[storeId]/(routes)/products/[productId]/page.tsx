import prismadb from "@/lib/prismadb";

import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params
}: {
  params: { productId: string, storeId: string }
}) => {
  if(params.productId === "new") {
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return ( 
      <div className="flex-col">
        <div className="flex-1 space-y-4 py-8 px-4 pt-6">
          <ProductForm 
            categories={categories} 
            initialData={null}
          />
        </div>
      </div>
    );
  }
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 py-8 px-4 pt-6">
        <ProductForm 
          categories={categories} 
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;
