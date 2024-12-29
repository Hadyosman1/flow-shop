import Image from "next/image";
import bannerImg from "@/assets/banner.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="banner-bg relative flex overflow-clip rounded-r md:min-h-96">
      <Image
        src={bannerImg}
        alt="banner"
        fill
        quality={100}
        priority
        className="hidden object-cover md:block"
        sizes="(max-width: 768px) 90vw"
      />
      <div className="relative z-[2] flex w-full flex-col items-center justify-center gap-6 py-16 text-center md:w-2/5 md:px-3">
        <h1 className="text-4xl font-extrabold">Fill the void in your heart</h1>
        <p className="max-w-[500px] text-muted-foreground">
          Tough day? Credit card maxed out? Buy some expensive stuff and become
          happy again!
        </p>
        <Button asChild>
          <Link href="/shop">
            Shop Now
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Banner;
