import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotificationRequest } from "@/hooks/back-in-stock";
import { z } from "zod";
import { requiredString } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";

import { InfoIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingBtn from "./LoadingBtn";
import env from "@/env";

const formSchema = z.object({
  email: requiredString.email("Invalid email"),
});

type FormValues = z.infer<typeof formSchema>;

interface BackInStockNotificationBtnProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

const BackInStockNotificationBtn = ({
  product,
  selectedOptions,
  ...props
}: BackInStockNotificationBtnProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { handleSubmit, control } = form;

  const mutation = useCreateBackInStockNotificationRequest();

  const onSubmit = async ({ email }: FormValues) => {
    mutation.mutate({
      email,
      product,
      selectedOptions,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          Notify when available
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when available</DialogTitle>
          <DialogDescription>
            Enter your email address and {"we'll"} let you know when this
            product is back in stock.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingBtn
              type="submit"
              className="mt-3"
              isLoading={mutation.isPending}
            >
              Notify me
            </LoadingBtn>
          </form>
        </Form>

        {mutation.isSuccess && (
          <div className="py-2.5 text-green-600">
            Thank you {"we'll"} notify you when this product is back in stock
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BackInStockNotificationBtn;
