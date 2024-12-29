import { products } from "@wix/stores";
import Link from "next/link";
import WixImage from "./WixImage";
import Badge from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import DiscountBadge from "./DiscountBadge";

interface ProductCardProps {
  product: products.Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const mainImage = product.media?.mainMedia?.image;

  return (
    <Link
      href={`products/${product.slug}`}
      className="h-full rounded-md border border-muted bg-card shadow transition duration-300 hover:shadow-md hover:shadow-primary/50"
    >
      <div className="relative overflow-hidden rounded-t-[inherit]">
        <WixImage
          className="transform-gpu rounded-[inherit] transition duration-300 hover:scale-105"
          mediaIdentifier={mainImage?.url}
          alt={mainImage?.altText}
          scaleToFill
          width={700}
          height={700}
        />
        <div className="absolute bottom-1 right-1 flex flex-wrap items-center gap-1">
          {product.ribbon && <Badge>{product.ribbon}</Badge>}
          {product.discount && <DiscountBadge data={product.discount} />}
          <Badge className="bg-secondary font-semibold text-secondary-foreground">
            {getFormattedPrice(product)}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 p-3">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <div
          className="line-clamp-5 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
        />
      </div>
    </Link>
  );
};

export default ProductCard;

function getFormattedPrice(product: products.Product) {
  const minPrice = product.costRange?.minValue;
  const maxPrice = product.costRange?.maxValue;

  if (minPrice && maxPrice && minPrice !== maxPrice) {
    return `from ${formatCurrency(minPrice, product.priceData?.currency)}`;
  } else {
    return (
      product.priceData?.formatted?.discountedPrice ||
      product.priceData?.formatted?.price ||
      "N/A"
    );
  }
}
