"use client";

import Badge from "@/components/ui/badge";
import { products } from "@wix/stores";
import ProductOptions from "./ProductOptions";
import { useEffect, useState } from "react";
import { checkIsInStock, findVariant } from "@/lib/utils";
import ProductPrice from "./ProductPrice";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InfoIcon } from "lucide-react";
import AddToCartBtn from "@/components/AddToCartBtn";
import dynamic from "next/dynamic";
import BackInStockNotificationBtn from "@/components/BackInStockNotificationBtn";

const ProductMedia = dynamic(() => import("./ProductMedia"), { ssr: false });

interface ProductDetailsProps {
  product: products.Product;
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(
    product.productOptions
      ?.map((option) => ({
        [option.name ?? ""]: option.choices?.[0].description ?? "",
      }))
      .reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  useEffect(() => {
    setQuantity(1);
  }, [selectedOptions]);

  const selectedVariant = findVariant(product, selectedOptions);

  const isInStock = checkIsInStock(product, selectedOptions);

  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;

  const availableQuantityReached =
    !!availableQuantity && quantity >= availableQuantity;

  const selectedOptionsMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === selectedOptions[option.name ?? ""],
    );

    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="h-fit basis-2/5 md:sticky md:top-2">
        <ProductMedia
          media={
            !!selectedOptionsMedia?.length
              ? selectedOptionsMedia
              : product.media?.items
          }
        />
      </div>

      <article className="basis-3/5 space-y-3">
        <h1 className="text-3xl font-bold md:text-4xl">{product.name}</h1>
        {product.brand && (
          <p className="text-muted-foreground">{product.brand}</p>
        )}
        {product.ribbon && <Badge>{product.ribbon}</Badge>}
        {product.description && (
          <div
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
        <div className="flex items-center gap-2">
          <ProductPrice product={product} selectedVariant={selectedVariant} />
          {!!availableQuantity && (
            <Badge className="ms-auto self-end font-semibold">
              {availableQuantity} in stock
            </Badge>
          )}
        </div>
        <ProductOptions
          setSelectedOptions={setSelectedOptions}
          selectedOptions={selectedOptions}
          product={product}
        />
        <p>Quantity</p>
        <div className="flex items-center gap-3">
          <Button
            disabled={!isInStock || quantity <= 1}
            onClick={() => setQuantity((prev) => prev - 1)}
            size="sm"
          >
            -
          </Button>
          <span>{quantity}</span>
          <Button
            disabled={!isInStock || availableQuantityReached}
            onClick={() => setQuantity((prev) => prev + 1)}
            size="sm"
          >
            +
          </Button>
        </div>

        {isInStock ? (
          <div className="pt-6">
            <AddToCartBtn
              className="w-full"
              product={product}
              quantity={quantity}
              selectedOptions={selectedOptions}
            />
          </div>
        ) : (
          <>
            <p className="text-center text-muted-foreground">Out of stock</p>
            <BackInStockNotificationBtn
            className="w-full"
              product={product}
              selectedOptions={selectedOptions}
            />
          </>
        )}

        {!!product.additionalInfoSections?.length && (
          <div className="space-y-2 pt-2">
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <InfoIcon />
              Additional product information.
            </p>
            <Accordion className="w-full space-y-1" type="multiple">
              {product.additionalInfoSections.map((section) => (
                <AccordionItem key={section.title} value={section.title ?? ""}>
                  <AccordionTrigger>{section.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="prose text-sm dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: section.description ?? "",
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </article>
    </div>
  );
};

export default ProductDetails;
