import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { checkIsInStock, cn } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (option: Record<string, string>) => void;
}

const ProductOptions = ({
  product,
  selectedOptions,
  setSelectedOptions,
}: ProductOptionsProps) => {
  return (
    <div className="space-y-2.5">
      <div className="space-y-2.5">
        {product.productOptions?.map((option) => (
          <fieldset key={option.name} className="space-y-2.5">
            <legend>{option.name}</legend>
            <div className="flex flex-wrap items-center gap-2">
              {option.choices?.map((choice) => (
                <div key={choice.description}>
                  <input
                    className="peer appearance-none"
                    type="radio"
                    name={option.name}
                    value={choice.description}
                    id={choice.description}
                    checked={
                      selectedOptions?.[option.name ?? ""] ===
                      choice.description
                    }
                    onChange={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        [option.name ?? ""]: choice.description ?? "",
                      })
                    }
                  />
                  <Button
                    className={cn(
                      "bg-secondary/50 hover:border-primary hover:bg-secondary peer-checked:border-primary",
                      !checkIsInStock(product, {
                        ...selectedOptions,
                        [option.name ?? ""]: choice.description ?? "",
                      }) && "opacity-50",
                    )}
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <Label
                      className="cursor-pointer"
                      htmlFor={choice.description}
                    >
                      {option.optionType?.toLowerCase() === "color" && (
                        <span
                          style={{ background: choice.value }}
                          className="size-4 rounded-full border drop-shadow"
                        />
                      )}
                      {choice.description}
                    </Label>
                  </Button>
                </div>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
