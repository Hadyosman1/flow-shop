import { Skeleton } from "./ui/skeleton";

const ProductCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[450px] rounded-md" />
      ))}
    </div>
  );
};
export default ProductCardsSkeleton;
