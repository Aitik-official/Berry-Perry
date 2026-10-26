import { useState } from 'react'
import type { Product } from '@/lib/products-data'
import type { StoreTaxonomyConfig } from '@/lib/store-taxonomy'

interface UseProductFormProps {
  products: Product[]
  taxonomyConfig: StoreTaxonomyConfig
  saveProductsToStorage: (
    updatedList: Product[],
    syncApiProduct?: { method: 'POST' | 'PUT' | 'DELETE'; product?: Product; id?: string }
  ) => void
  triggerToast: (msg: string) => void
}

export function useProductForm({
  products,
  taxonomyConfig,
  saveProductsToStorage,
  triggerToast,
}: UseProductFormProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form fields
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formGender, setFormGender] = useState<'men' | 'women' | 'unisex' | 'boys' | 'girls' | 'kids' | string>('unisex')
  const [formMainCategory, setFormMainCategory] = useState('baby-kids-clothing')
  const [formCategory, setFormCategory] = useState('clothing')
  const [formSport, setFormSport] = useState('clothing')
  const [formPrice, setFormPrice] = useState(699)
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>(999)
  const [formBadge, setFormBadge] = useState('NEW')
  const [formMainImage, setFormMainImage] = useState('')
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>([])
  const [formDescription, setFormDescription] = useState('')
  const [formInStock, setFormInStock] = useState(true)
  const [formRating, setFormRating] = useState(4.8)
  const [formReviewsCount, setFormReviewsCount] = useState(35)
  const [formReviews, setFormReviews] = useState<import('@/lib/products-data').ReviewItem[]>([])

  // Interactive Sizing Picker
  const [formSizes, setFormSizes] = useState<string[]>(['0-6M', '6-12M', '1-2Y', '2-3Y', '3-4Y'])
  const [customSizeInput, setCustomSizeInput] = useState('')

  // Interactive Color Picker
  const [formColors, setFormColors] = useState<{ name: string; hex: string; image?: string }[]>([
    { name: 'Berry Pink', hex: '#EB008B' },
    { name: 'Soft Blue', hex: '#3ea2a0' },
  ])
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#5CB946')

  // Interactive Bullet Points / Features list
  const [formFeatures, setFormFeatures] = useState<string[]>([
    '100% certified combed cotton gentle on delicate baby skin',
    'Hypoallergenic & non-toxic dyes safe for infants',
    'Reinforced flatlock seams prevent rubbing or chafing',
  ])
  const [newFeatureInput, setNewFeatureInput] = useState('')

  const handleOpenAddProduct = () => {
    setEditingProduct(null)
    setFormName('')
    setFormSlug('')
    setFormGender('unisex')
    const defaultMain = taxonomyConfig.mainCategories?.[0]?.value || 'baby-kids-clothing'
    setFormMainCategory(defaultMain)
    const subForMain = taxonomyConfig.categories?.filter((c) => !c.parentCategory || c.parentCategory === defaultMain)
    setFormCategory(subForMain?.[0]?.value || 'clothing')
    setFormSport('clothing')
    setFormPrice(699)
    setFormOriginalPrice(999)
    setFormBadge('NEW')
    setFormMainImage('')
    setFormGalleryImages([])
    setFormDescription('')
    setFormInStock(true)
    setFormRating(4.8)
    setFormReviewsCount(15)
    setFormReviews([])
    setFormSizes(['S', 'M', 'L', 'XL'])
    setFormColors([
      { name: 'Navy', hex: '#080d2d' },
      { name: 'Red', hex: '#EB008B' },
    ])
    setFormFeatures([
      'Moisture-wicking dry-fit aerodynamic fabric',
      'Athletic ergonomic stretch cut',
      'UV 30+ sun protection for match play',
    ])
    setIsProductModalOpen(true)
  }

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormSlug(product.slug)
    setFormGender(product.gender)
    const matchedCategory = taxonomyConfig.categories?.find((c) => c.value === product.category)
    const resolvedMain = product.mainCategory || matchedCategory?.parentCategory || (product.gender === 'women' ? 'women' : 'men')
    setFormMainCategory(resolvedMain)
    setFormCategory(product.category)
    setFormSport(product.sport)
    setFormPrice(product.price)
    setFormOriginalPrice(product.originalPrice || '')
    setFormBadge(product.badge || '')
    setFormMainImage(product.image || '')
    const initialGallery = (product.images?.length ? product.images : [product.image]).filter(Boolean)
    setFormGalleryImages(initialGallery)
    setFormDescription(product.description)
    setFormInStock(product.inStock)
    setFormRating(product.rating || 5)
    setFormReviewsCount(product.reviewsCount || 0)
    setFormReviews(product.reviews || [])
    setFormSizes(product.sizes?.length ? product.sizes : ['M', 'L', 'XL'])
    setFormColors(
      product.colors?.length
        ? product.colors
        : [{ name: 'Navy', hex: '#080d2d' }, { name: 'White', hex: '#ffffff' }]
    )
    setFormFeatures(
      product.features?.length
        ? product.features
        : ['Moisture-wicking performance fabric', 'Durable stitch craftsmanship']
    )
    setIsProductModalOpen(true)
  }

  const handleNameChange = (name: string) => {
    setFormName(name)
    if (!editingProduct) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormSlug(generatedSlug)
    }
  }

  const toggleSizeSelection = (size: string) => {
    if (formSizes.includes(size)) {
      if (formSizes.length > 1) {
        setFormSizes(formSizes.filter((s) => s !== size))
      } else {
        triggerToast('At least one size must remain selected.')
      }
    } else {
      setFormSizes([...formSizes, size])
    }
  }

  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim().toUpperCase()
    if (trimmed && !formSizes.includes(trimmed)) {
      setFormSizes([...formSizes, trimmed])
      setCustomSizeInput('')
    }
  }

  const handleAddColor = () => {
    if (!newColorName.trim()) {
      triggerToast('Please provide a name for this color (e.g. Navy, Scarlet, Black).')
      return
    }
    setFormColors([...formColors, { name: newColorName.trim(), hex: newColorHex }])
    setNewColorName('')
    setNewColorHex('#080d2d')
  }

  const handleRemoveColor = (index: number) => {
    if (formColors.length > 1) {
      setFormColors(formColors.filter((_, i) => i !== index))
    } else {
      triggerToast('At least one color is required for shoppers.')
    }
  }

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return
    setFormFeatures([...formFeatures, newFeatureInput.trim()])
    setNewFeatureInput('')
  }

  const handleRemoveFeature = (index: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== index))
  }

  const handleRemoveGalleryImage = (index: number) => {
    if (formGalleryImages.length > 1) {
      const updated = formGalleryImages.filter((_, i) => i !== index)
      setFormGalleryImages(updated)
      if (index === 0 && updated.length > 0) {
        setFormMainImage(updated[0])
      }
    } else {
      triggerToast('At least one image is required.')
    }
  }

  const handleReplaceGalleryImage = (index: number, newImg: string) => {
    const updated = [...formGalleryImages]
    updated[index] = newImg
    setFormGalleryImages(updated)
    if (index === 0) {
      setFormMainImage(newImg)
    }
  }

  const handleSetMainGalleryImage = (index: number) => {
    if (index <= 0 || index >= formGalleryImages.length) return
    const target = formGalleryImages[index]
    const rest = formGalleryImages.filter((_, i) => i !== index)
    const updated = [target, ...rest]
    setFormGalleryImages(updated)
    setFormMainImage(target)
    triggerToast('Set as main display photo!')
  }

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim()) {
      triggerToast('Please enter a product title.')
      return
    }

    const subCatObj = taxonomyConfig.categories?.find((c) => c.value === formCategory)
    const resolvedSport =
      subCatObj?.sport ||
      (taxonomyConfig.sports?.some((s) => s.value === formCategory)
        ? formCategory
        : editingProduct?.sport || 'clothing')

    const generatedSku =
      editingProduct?.sku ||
      `BP-${(formName.slice(0, 3) + Date.now().toString().slice(-4)).toUpperCase()}`

    const generatedWarehouseBarcode =
      editingProduct?.warehouseBarcode ||
      `29${Date.now().toString().slice(-8)}${Math.floor(10 + Math.random() * 90)}`

    const payload: Product = {
      id: editingProduct?.id || `bp-prod-${Date.now()}`,
      sku: generatedSku,
      warehouseBarcode: generatedWarehouseBarcode,
      supplierBarcode: editingProduct?.supplierBarcode || undefined,
      stockQuantity: editingProduct?.stockQuantity ?? 25,
      name: formName.trim(),
      slug: formSlug.trim() || formName.toLowerCase().replace(/\s+/g, '-'),
      gender: formGender,
      mainCategory: formMainCategory,
      subCategory: formCategory,
      category: formCategory,
      sport: resolvedSport,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      badge: formBadge.trim() || undefined,
      image: formMainImage || formGalleryImages[0] || '',
      images: formGalleryImages.length > 0 ? formGalleryImages : (formMainImage ? [formMainImage] : []),
      description: formDescription.trim() || 'Engineered for high performance and durability.',
      features: formFeatures.length > 0 ? formFeatures : ['High performance athletic fabric'],
      sizes: formSizes.length > 0 ? formSizes : ['M', 'L', 'XL'],
      colors: formColors.length > 0 ? formColors : [{ name: 'Navy', hex: '#080d2d' }],
      inStock: formInStock,
      rating: Number(formRating) || 5.0,
      reviewsCount: Number(formReviewsCount) || (formReviews.length || 0),
      reviews: formReviews,
      videoUrl: editingProduct?.videoUrl || '/videos/display_video.mp4',
      actionVideoUrl: editingProduct?.actionVideoUrl || '/videos/jadeja.mp4',
    }

    if (editingProduct) {
      const updated = products.map((p) => (p.id === editingProduct.id ? payload : p))
      saveProductsToStorage(updated, { method: 'PUT', product: payload })
      triggerToast(`Product "${payload.name}" updated successfully!`)
    } else {
      const updated = [payload, ...products]
      saveProductsToStorage(updated, { method: 'POST', product: payload })
      triggerToast(`Product "${payload.name}" created successfully!`)
    }

    setIsProductModalOpen(false)
  }

  return {
    isProductModalOpen,
    setIsProductModalOpen,
    editingProduct,
    formName,
    formSlug,
    formGender,
    setFormGender,
    formMainCategory,
    setFormMainCategory,
    formCategory,
    setFormCategory,
    formSport,
    setFormSport,
    formPrice,
    setFormPrice,
    formOriginalPrice,
    setFormOriginalPrice,
    formBadge,
    setFormBadge,
    formMainImage,
    setFormMainImage,
    formGalleryImages,
    setFormGalleryImages,
    formDescription,
    setFormDescription,
    formInStock,
    setFormInStock,
    formRating,
    setFormRating,
    formReviewsCount,
    setFormReviewsCount,
    formReviews,
    setFormReviews,
    formSizes,
    customSizeInput,
    setCustomSizeInput,
    formColors,
    setFormColors,
    newColorName,
    setNewColorName,
    newColorHex,
    setNewColorHex,
    formFeatures,
    newFeatureInput,
    setNewFeatureInput,
    handleOpenAddProduct,
    handleOpenEditProduct,
    handleNameChange,
    toggleSizeSelection,
    handleAddCustomSize,
    handleAddColor,
    handleRemoveColor,
    handleAddFeature,
    handleRemoveFeature,
    handleRemoveGalleryImage,
    handleReplaceGalleryImage,
    handleSetMainGalleryImage,
    handleSubmitProduct,
  }
}
