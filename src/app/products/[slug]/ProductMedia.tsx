import WixImage from "@/components/WixImage";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

const ProductMedia = ({ media }: ProductMediaProps) => {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);

  if (!media?.length) return null;

  const selectedImage = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <>
      <div className="aspect-square rounded bg-secondary">
        {selectedImage?.url ? (
          <Zoom>
            <WixImage
              className="rounded shadow"
              mediaIdentifier={selectedImage.url}
              alt={selectedImage.altText}
              scaleToFill
              width={1000}
              height={1000}
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls className="size-full">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>

      {media.length > 1 && (
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2">
          {media.map((mediaItem) => (
            <MediaPreview
              key={mediaItem._id}
              mediaItem={mediaItem}
              isSelected={selectedMedia?._id === mediaItem._id}
              onSelect={() => setSelectedMedia(mediaItem)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductMedia;

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

const MediaPreview = ({
  mediaItem,
  isSelected,
  onSelect,
}: MediaPreviewProps) => {
  const imageUrl = mediaItem.image?.url;
  const stillFrameMediaId = mediaItem.video?.stillFrameMediaId;
  const thumbnailUrl = mediaItem.thumbnail?.url;

  const resolvedThumbnailUrl =
    stillFrameMediaId && thumbnailUrl
      ? thumbnailUrl.split(stillFrameMediaId)[0] + stillFrameMediaId
      : undefined;

  if (!imageUrl && !resolvedThumbnailUrl) return null;

  return (
    <div
      onClick={onSelect}
      className={"relative cursor-pointer rounded bg-secondary"}
    >
      <WixImage
        mediaIdentifier={imageUrl || resolvedThumbnailUrl}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        scaleToFill
        width={160}
        height={160}
        className={cn("rounded shadow", {
          "ring-2 ring-primary": isSelected,
        })}
      />
      {resolvedThumbnailUrl && (
        <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full border border-primary bg-background/80 p-3">
          <PlayIcon className="text-primary" />
        </span>
      )}
    </div>
  );
};
