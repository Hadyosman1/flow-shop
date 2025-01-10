import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

const StarRatingInput = ({ value, onChange }: StarRatingInputProps) => {
  const ratingText = ["Terrible", "Bad", "Ok", "Good", "Great"];

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 5 }, (_, idx) => (
        <button type="button" key={idx} onClick={() => onChange(idx + 1)}>
          <StarIcon
            className={cn(
              "size-7 text-primary",
              idx + 1 <= value && "fill-primary",
            )}
          />
        </button>
      ))}
      <span>{ratingText[value - 1]}</span>
    </div>
  );
};

export default StarRatingInput;
