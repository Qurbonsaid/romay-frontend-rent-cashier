import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateProductMutation } from '@/store/product/product.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import type { CreateProductRequest } from '@/store/product/types'

interface Category {
  _id: string
  name: string
}

interface AddProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
}

const formSchema = z.object({
  name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
  category: z.string().min(1, 'Kategoriya majburiy'),
  sku: z.string().min(4, 'Bar-kod kamida 4 ta belgi'),
  price: z.number().min(0.01, "Narxi 0 dan katta bo'lishi kerak"),
  images: z.array(z.string()).min(1, 'Kamida 1 ta rasm yuklang'),
  description: z.string().optional(),
})

export function AddProductForm({
  open,
  onOpenChange,
  categories,
}: AddProductFormProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [uploadFile] = useUploadFileMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      sku: '',
      price: 0,
      images: [],
      description: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const productData: CreateProductRequest = {
        name: values.name,
        description: values.description || '',
        category_id: values.category,
        price: values.price,
        status: 'active',
        currency: 'USD',
        images: values.images,
        barcode: values.sku,
        attributes: [],
        product_count: 0,
        from_create: 'manual',
      }

      await createProduct(productData).unwrap()
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

  const handleFileUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await uploadFile(file).unwrap()
        return response.file_path
      })

      const urls = await Promise.all(uploadPromises)
      const currentImages = form.getValues('images')
      form.setValue('images', [...currentImages, ...urls])
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yangi mahsulot qo'shish</DialogTitle>
          <DialogDescription>
            Yangi mahsulot ma'lumotlarini kiriting
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mahsulot nomi *</FormLabel>
                  <FormControl>
                    <Input placeholder="Mahsulot nomini kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoriya *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategoriya tanlang" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bar-kod *</FormLabel>
                    <FormControl>
                      <Input placeholder="Bar-kod" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Narx (USD) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tavsif</FormLabel>
                  <FormControl>
                    <Input placeholder="Mahsulot tavsifi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mahsulot rasmlari *</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || [])
                          if (files.length > 0) {
                            await handleFileUpload(files)
                          }
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">
                        Kamida 1 ta rasm yuklang (JPG, PNG, WebP)
                      </p>
                    </div>
                  </FormControl>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = field.value.filter(
                                (_, i) => i !== index
                              )
                              form.setValue('images', newImages)
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Qo'shilmoqda..." : "Qo'shish"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
