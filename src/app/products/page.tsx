import { Suspense } from "react";
import ProductsClient from "./products-client";
import { ProductSkeleton } from "@/components/product/product-card";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-10 sm:px-8">
          <ProductSkeleton />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
