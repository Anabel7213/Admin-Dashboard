"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Image, Product } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().max(400),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  cost: z.coerce.number().min(1),
  profit: z.string().optional(),
  margin: z.string().optional(),
  quantity: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  color: z.string().optional(),
  size: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  material: z.string().optional(),
  condition: z.string().optional(),
  compatibility: z.string().optional(),
  brand: z.string().optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isShipping: z.boolean().default(false).optional(),
  weight: z.coerce.number().optional(),
  shippingCost: z.string().optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product.";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
        cost: parseFloat(String(initialData?.cost)),
      }
    : {
        name: "",
        description: "",
        images: [],
        price: 0,
        cost: 0, //keeps complaining cost is a decimal
        profit: "",
        margin: "",
        quantity: 0,
        categoryId: "",
        color: "",
        size: "",
        width: "",
        height: "",
        material: "",
        condition: "",
        compatibility: "",
        brand: "",
        isFeatured: false,
        isArchived: false,
        isShipping: false,
        weight: 0,
        shippingCost: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
        console.log(data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const { control } = form;
  const price = form.watch("price");
  const cost = form.watch("cost");

  const calculateProfit = () => {
    if (price !== 0 && cost !== 0) {
      return "$" + (price - cost).toFixed(2);
    }
    return "";
  };

  const calculateMargin = () => {
    if (price !== 0 && cost !== 0) {
      return ((price - cost) / price).toFixed(2) + "%";
    }
    return "";
  };

  const isShipping = form.watch("isShipping");

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem className="space-y-0 pb-4">
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    width="w-[200px]"
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="FIRST-ROW lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem className="w-full h-fit">
                  <FormLabel>Size</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Medium" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="w-full h-fit">
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="#000000"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="SECOND-ROW lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
            <div className="PRICING flex flex-wrap w-full">
              <div className="PRICING-ALIGNER-CONTAINER flex flex-wrap p-4 border w-full rounded-lg sm:pb-4 lg:pb-0">
                <div className="flex w-full gap-4 flex-nowrap">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="$0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="$0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full gap-4 flex-nowrap">
                  <FormField
                    control={control}
                    name="profit"
                    render={() => (
                      <FormItem className="w-full">
                        <FormLabel>Profit</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            value={calculateProfit()}
                            readOnly
                            placeholder="$0.00"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="margin"
                    render={() => (
                      <FormItem className="w-full">
                        <FormLabel>Margin</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            value={calculateMargin()}
                            readOnly
                            placeholder="0.00%"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="SECOND-ROW-SECOND-COL-FIRST-ROW lg:flex flex-col w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full mb-6 mt-0">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="Product description"
                        {...field}
                        className="resize-none h-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="SECOND-ROW-SECOND-COL-SECOND-ROW lg:flex w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap items-end">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          placeholder="10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Popover>
                  <PopoverTrigger asChild className="w-full">
                    <Button variant="outline">Specifications</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 space-y-3">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Extra</h4>
                        <p className="text-sm text-muted-foreground">
                          Specify optional custom parameters.
                        </p>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='12.8"'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder='24.6"'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="material"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Steel"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Condition</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="New"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Apple"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="compatibility"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Compatibility</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Apple Iphone 16 Pro"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="THIRD-ROW lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
            <div className="THIRD-ROW-FIRST-COL lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full h-fit">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        Will appear on home page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full h-fit">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Archived</FormLabel>
                      <FormDescription>
                        Will not appear anywhere.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="THIRD-ROW-SECOND-COL lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap justify-left">
              <div className="CONTAINER w-full lg:flex lg:flex-row gap-4 lg:items-end sm:flex sm:flex-col">
                <FormField
                  control={form.control}
                  name="isShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          // @ts-ignore
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Requires Shipping</FormLabel>
                        <FormDescription>
                          This is a physical product.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                {isShipping && (
                  <div className="REVEALER lg:flex lg:flex-row w-full gap-4 lg:flex-nowrap sm:flex sm:flex-wrap">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Weight (lb)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={loading}
                              placeholder="0.0 lb"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="shippingCost"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Cost of Shipping</FormLabel>
                          <FormControl>
                            <Input
                              disabled={loading}
                              placeholder="Free"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
