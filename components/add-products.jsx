import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

export function AddProducts({ onProductSubmit, scrollToBottom, isLastMessage }) {
    const [products, setProducts] = useState([
        {
            id: 1,
            title: "",
            description: "",
            price: "",
            currency: "USD",
            paymentType: "single",
            images: [],
            imagePreviews: []
        }
    ]);

    const addProduct = () => {
        const newProduct = {
            id: Date.now(),
            title: "",
            description: "",
            price: "",
            currency: "USD",
            paymentType: "single",
            images: [],
            imagePreviews: []
        };
        setProducts([...products, newProduct]);

        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const removeProduct = (id) => {
        if (products.length > 1) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    const updateProduct = (id, field, value) => {
        setProducts(products.map(product =>
            product.id === id ? { ...product, [field]: value } : product
        ));
    };

    const handleImageChange = (id, event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const product = products.find(p => p.id === id);
            const newImages = [...(product.images || [])];
            const newPreviews = [...(product.imagePreviews || [])];

            let processedCount = 0;
            files.forEach(file => {
                newImages.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    newPreviews.push(e.target.result);
                    processedCount++;
                    if (processedCount === files.length) {
                        updateProduct(id, 'images', newImages);
                        updateProduct(id, 'imagePreviews', newPreviews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (productId, imageIndex) => {
        const product = products.find(p => p.id === productId);
        const newImages = product.images.filter((_, index) => index !== imageIndex);
        const newPreviews = product.imagePreviews.filter((_, index) => index !== imageIndex);

        updateProduct(productId, 'images', newImages);
        updateProduct(productId, 'imagePreviews', newPreviews);
    };

    const navigateImage = (productId, direction) => {
        const product = products.find(p => p.id === productId);
        if (!product || product.imagePreviews.length <= 1) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (product.currentImageIndex + 1) % product.imagePreviews.length;
        } else {
            newIndex = product.currentImageIndex === 0
                ? product.imagePreviews.length - 1
                : product.currentImageIndex - 1;
        }

        updateProduct(productId, 'currentImageIndex', newIndex);
    };

    const addImageSlot = (productId) => {
        const fileInput = document.getElementById(`image-input-${productId}`);
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleSubmit = () => {
        const validProducts = products.filter(product =>
            product.title.trim() && product.price.trim()
        );

        if (validProducts.length > 0) {
            const productData = validProducts.map(product => ({
                title: product.title,
                description: product.description,
                price: product.price,
                currency: product.currency,
                paymentType: product.paymentType,
                imageCount: product.images ? product.images.length : 0
            }));

            const message = `PRODUCTS: Here are my products:\n\n${productData.map((product, index) =>
                `${index + 1}. ${product.title}\n   Price: ${product.currency} ${product.price}\n   Payment: ${product.paymentType}\n   Description: ${product.description || 'No description'}\n   Images: ${product.imageCount}`
            ).join('\n\n')}`;

            if (onProductSubmit) {
                onProductSubmit({ text: message });
            }
        }
    };

    const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN"];
    const paymentTypes = [
        { value: "single", label: "Single Payment" },
        { value: "monthly", label: "Monthly Subscription" },
        { value: "yearly", label: "Yearly Subscription" }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-[#ededed]">
                    Products
                </h2>
                <Button
                    onClick={addProduct}
                    variant="outline"
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                    Add New Product
                </Button>
            </div>

            <div className="space-y-3">
                {products.map((product, index) => (
                    <div key={product.id} className="rounded-lg border border-gray-200 dark:border-[#262626] bg-white dark:bg-transparent">
                        {/* Header with product number and delete */}
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-[#262626] bg-gray-50 dark:bg-[#1a1a1a]">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Product {index + 1}
                            </h3>
                            {products.length > 1 && (
                                <button
                                    onClick={() => removeProduct(product.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    title="Remove this product"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="p-3 space-y-3">
                            {/* Product Name */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Enter your product name"
                                    value={product.title}
                                    onChange={(e) => updateProduct(product.id, 'title', e.target.value)}
                                    className="w-full h-9"
                                />
                            </div>

                            {/* Price, Currency, and Payment Type - Responsive Layout */}
                            <div className="space-y-2">
                                {/* Price and Currency Row */}
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-8 md:col-span-5 space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                            Price <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={product.price}
                                                onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                                                className="pl-8 h-9"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-4 md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                            Currency
                                        </label>
                                        <select
                                            value={product.currency}
                                            onChange={(e) => updateProduct(product.id, 'currency', e.target.value)}
                                            className="w-full h-9 text-sm border border-gray-200 dark:border-[#262626] rounded-md bg-white dark:bg-transparent px-2 text-gray-900 dark:text-[#ededed] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        >
                                            {currencies.map(currency => (
                                                <option key={currency} value={currency}>
                                                    {currency}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Payment Type - Desktop: Same row, Mobile: Hidden (shown below) */}
                                    <div className="hidden md:block md:col-span-5 space-y-1.5">
                                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                            Payment Type
                                        </label>
                                        <select
                                            value={product.paymentType}
                                            onChange={(e) => updateProduct(product.id, 'paymentType', e.target.value)}
                                            className="w-full h-9 text-sm border border-gray-200 dark:border-[#262626] rounded-md bg-white dark:bg-transparent px-3 text-gray-900 dark:text-[#ededed] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                        >
                                            {paymentTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Payment Type - Mobile: Separate row */}
                                <div className="md:hidden space-y-1.5">
                                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                        Payment Type
                                    </label>
                                    <select
                                        value={product.paymentType}
                                        onChange={(e) => updateProduct(product.id, 'paymentType', e.target.value)}
                                        className="w-full h-9 text-sm border border-gray-200 dark:border-[#262626] rounded-md bg-white dark:bg-transparent px-3 text-gray-900 dark:text-[#ededed] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    >
                                        {paymentTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                    Description (Optional)
                                </label>
                                <Textarea
                                    placeholder="Describe your product..."
                                    value={product.description}
                                    onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                    rows={2}
                                    className="resize-none text-sm"
                                />
                            </div>

                            {/* Images Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block">
                                    Product Images
                                </label>

                                {/* Images Grid */}
                                <div className="flex flex-wrap gap-2">
                                    {product.imagePreviews && product.imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Product preview ${index + 1}`}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-[#262626]"
                                            />
                                            <button
                                                onClick={() => removeImage(product.id, index)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                title="Remove this image"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Image Button */}
                                    <label className="cursor-pointer w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                                        <input
                                            id={`image-input-${product.id}`}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleImageChange(product.id, e)}
                                        />
                                        <Plus className="w-4 h-4 text-gray-400" />
                                    </label>
                                </div>

                                <p className="text-[10px] text-gray-500 dark:text-gray-400">JPG, PNG up to 5MB each</p>
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            id={`image-input-${product.id}`}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleImageChange(product.id, e)}
                        />
                    </div>
                ))}
            </div>

            {isLastMessage && (
                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleSubmit}
                        variant="default"
                        className="cursor-pointer px-8"
                    >
                        Continue
                    </Button>
                </div>
            )}
        </div>
    );
}