import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/reviews";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import WixImage from "../WixImage";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import LoadingBtn from "../LoadingBtn";
import StarRatingInput from "./StarRatingInput";
import { useRef } from "react";
import { Button } from "../ui/button";
import { CircleAlert, ImageUpIcon, Loader2Icon, XIcon } from "lucide-react";
import useMediaUpload, { MediaAttachment } from "./useMediaUpload";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Must be at least 5 characters")
    .max(100, "Must be less than 100 characters")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Must be at least 10 characters")
    .max(3000, "Must be less than 3000 characters")
    .or(z.literal("")),
  rating: z.number().int().min(1, "Please rate this product").max(5),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProductReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

const CreateProductReviewDialog = ({
  open,
  onOpenChange,
  product,
  onSubmitted,
}: CreateProductReviewDialogProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      rating: 0,
    },
  });

  const mutation = useCreateProductReview();

  const { attachments, clearAttachments, removeAttachment, startUpload } =
    useMediaUpload();

  const router = useRouter();

  const onSubmit = async ({ body, rating, title }: FormValues) => {
    if (!product._id) throw Error("Something went wrong");

    mutation.mutate(
      {
        productId: product._id,
        body,
        title,
        rating,
        media: attachments
          .filter((a) => a.url)
          .map((a) => ({
            url: a.url!,
            type: a.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAttachments();
          onSubmitted();
          setTimeout(() => router.refresh(), 2000);
        },
      },
    );
  };

  const uploadInProgress = attachments.some((a) => a.state === "uploading");

  // const disabled =

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Did you like this product? Share your thoughts with other customers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Product</Label>
            <div className="flex items-center gap-3">
              <WixImage
                className="rounded"
                mediaIdentifier={product.media?.mainMedia?.image?.url}
                width={70}
                height={70}
              />
              <span className="font-bold">{product.name}</span>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRatingInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        className="max-h-52 min-h-32"
                        placeholder="Tell others about your experience..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      Write a detailed review to help others customers.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap items-center gap-5">
                {attachments.map((a) => (
                  <AttachmentPreview
                    key={a.id}
                    attachment={a}
                    onRemoveClick={removeAttachment}
                  />
                ))}
                <AddMediaButton
                  disabled={
                    attachments.filter((a) => a.state !== "failed").length >= 5
                  }
                  onFileSelected={startUpload}
                />
              </div>

              <LoadingBtn
                type="submit"
                isLoading={mutation.isPending}
                disabled={mutation.isPending || uploadInProgress}
              >
                Submit
              </LoadingBtn>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductReviewDialog;

interface AddMediaButtonProps {
  onFileSelected: (file: File) => void;
  disabled: boolean;
}

const AddMediaButton = ({ disabled, onFileSelected }: AddMediaButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        disabled={disabled}
        type="button"
        variant="outline"
        size="icon"
        title="Add media"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageUpIcon />
        <span className="sr-only">Add media</span>
      </Button>
      <input
        hidden
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        disabled={disabled}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files[0]);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

const AttachmentPreview = ({
  attachment: { id, url, state, file },
  onRemoveClick,
}: AttachmentPreviewProps) => {
  return (
    <div
      className={cn(
        "relative size-fit",
        state === "failed" && "outline outline-1 outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImage
          mediaIdentifier={url}
          scaleToFill={false}
          placeholder={URL.createObjectURL(file)}
          alt="attachment preview"
          className={cn(
            "max-h-24 max-w-24 object-contain",
            !url && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn("aspect-video max-h-32 max-w-32", !url && "opacity-50")}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {state === "uploading" && (
        <div
          title="Loading"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <Loader2Icon className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          title="Failed to upload media"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      <Button
        variant="outline"
        size={"icon"}
        type="button"
        title="Remove attachment"
        onClick={() => onRemoveClick(id)}
        className="absolute right-0 top-0 aspect-square size-6 -translate-y-1/2 translate-x-1/2"
      >
        <XIcon />
        <span className="sr-only">Remove attachment</span>
      </Button>
    </div>
  );
};
