import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { NumberInput } from '@/components/ui/number-input'
import { Button } from '@/components/ui/button'
import { useCreateProductMutation } from '@/store/product/product.api'
import { useUploadFileMutation } from '@/store/upload/upload.api'
import type { CreateProductRequest } from '@/store/product/types'

const formSchema = z.object({
  name: z.string().min(2, 'Kamida 2 ta belgi kiriting'),
  category: z.string().min(1, 'Kategoriya majburiy'),
  sku: z.string().min(4, 'Bar-kod kamida 4 ta belgi'),
  price: z.number().min(0.01, "Narxi 0 dan katta bo'lishi kerak"),
  images: z.array(z.string()).min(1, 'Kamida 1 ta rasm yuklang'),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface Category {
  _id: string
  name: string
}

interface CreateProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  onSuccess?: () => void
}

export function CreateProductDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: CreateProductDialogProps) {
  const [createProduct] = useCreateProductMutation()
  const [uploadFile] = useUploadFileMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
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

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

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

      // Reset form and close dialog
      form.reset()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const currentImages = form.getValues('images')

    try {
      const uploadPromises = fileArray.map(async (file) => {
        try {
          const response = await uploadFile(file).unwrap()
          return response.file_path
        } catch (error) {
          console.error('Upload error:', error)
          return null
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(
        (url): url is string => url !== null
      )

      form.setValue('images', [...currentImages, ...validUrls])
    } catch (error) {
      console.error('File upload failed:', error)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const currentImages = form.getValues('images')
    const newImages = currentImages.filter(
      (_, index) => index !== indexToRemove
    )
    form.setValue('images', newImages)
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
            {/* Product Name */}
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

            {/* Category */}
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
                      {categories.map((category) => (
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

            {/* Barcode */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bar-kod *</FormLabel>
                  <FormControl>
                    <Input placeholder="Bar-kod kiriting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Narx (USD) *</FormLabel>
                  <FormControl>
                    <NumberInput
                      allowDecimals={true}
                      decimalPlaces={2}
                      placeholder="0.00"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
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

            {/* Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rasmlar *</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />

                      {field.value.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {field.value.map((url, index) => (
                            <div key={index} className="relative">
                              <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Kamida 1 ta rasm yuklang (JPG, PNG, WebP)
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
