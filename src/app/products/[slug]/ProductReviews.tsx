"use client";

import LoadingBtn from "@/components/LoadingBtn";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { getProductReviews } from "@/wix-api/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import { CornerDownRight, StarIcon } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Zoom from "react-medium-image-zoom";
import WixImage from "@/components/WixImage";
import { media as wixMedia } from "@wix/sdk";

interface ProductReviewsProps {
  product: products.Product;
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["product-reviews", product._id],
      queryFn: async ({ pageParam }) => {
        if (!product._id) throw Error("Product id missing");
        const pageSize = 2;

        return getProductReviews(wixBrowserClient, {
          productId: product._id,
          limit: pageSize,
          cursor: pageParam,
        });
      },
      select: (data) => ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter(
            (item) =>
              item.moderation?.moderationStatus ===
              reviews.ModerationModerationStatus.APPROVED,
          ),
        })),
      }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.cursors.next,
    });

  const reviewItems = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="space-y-5">
      {status === "pending" && <ProductReviewsSkeleton />}
      {status === "error" && (
        <p className="text-destructive">Error fetching reviews</p>
      )}
      {status === "success" && !reviewItems.length && !hasNextPage && (
        <p>No reviews yet.</p>
      )}
      <div className="divide">
        {reviewItems.map((review) => (
          <Review key={review._id} review={review} />
        ))}
      </div>
      {hasNextPage && (
        <LoadingBtn
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
        >
          Load more reviews
        </LoadingBtn>
      )}
    </div>
  );
};

export default ProductReviews;

interface ReviewProps {
  review: reviews.Review;
}

const Review = ({
  review: { author, reviewDate, content, reply },
}: ReviewProps) => {
  return (
    <div className="py-5 first:pt-0 last:pb-0">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 pb-2">
          {Array.from({ length: 5 }, (_, idx) => (
            <StarIcon
              key={idx}
              className={cn(
                "size-7 text-primary",
                idx + 1 <= (content?.rating || 0) && "fill-primary",
              )}
            />
          ))}
          {content?.title && <h3 className="font-bold">{content.title}</h3>}
          <p className="text-sm text-muted-foreground">
            by {author?.authorName || "Anonymous"}
            {reviewDate && <> on {new Date(reviewDate).toLocaleDateString()}</>}
          </p>
          {content?.body && (
            <div className="whitespace-pre-line">{content.body}</div>
          )}
        </div>
        {!!content?.media?.length && (
          <div className="flex flex-wrap gap-2">
            {content.media.map((m) => (
              <MediaAttachment key={m.image || m.video} media={m} />
            ))}
          </div>
        )}
        {reply?.message && (
          <div className="ms-10 mt-2.5 space-y-1 border-t pt-2.5">
            <div className="flex items-center gap-2">
              <CornerDownRight className="size-5" />
              <Image src={logo} alt="Flow Shop Logo" width={20} height={20} />
              <span className="font-bold">Flow Shop Team</span>
            </div>
            <div className="whitespace-pre-line">{reply.message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MediaAttachmentProps {
  media: reviews.Media;
}

const MediaAttachment = ({ media }: MediaAttachmentProps) => {
  if (media.image) {
    return (
      <Zoom>
        <WixImage
          mediaIdentifier={media.image}
          scaleToFill={false}
          alt="review image"
          className="max-h-40 max-w-40 object-contain"
        />
      </Zoom>
    );
  }

  if (media.video) {
    const video = wixMedia.getVideoUrl(media.video);

    return (
      <video controls className="max-h-40 max-w-40">
        <source src={video.url} type={`video/${video.url.split(".").pop()}`} />
      </video>
    );
  }

  return <span className="text-destructive">Unsupported media type</span>;
};

export function ProductReviewsSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 3 }, (_, idx) => (
        <div key={idx} className="space-y-1.5">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-16 w-72" />
        </div>
      ))}
    </div>
  );
}
