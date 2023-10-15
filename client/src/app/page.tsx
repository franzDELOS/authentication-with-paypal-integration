"use client";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./shared/components/ProductCard";
import products from "@/app/products/products.json";

export default function Home() {
  const router = useRouter();

  const handleClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <Fragment>
      <div className="mx-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:justify-center sm:items-center">
        {products.products.map((product: any) => (
          <ProductCard
            id={product.id}
            title={product.title}
            price={product.price}
            thumbnail={product.thumbnail}
            handleClick={() => handleClick(product.id)}
          />
        ))}
      </div>
    </Fragment>
  );
}
