import React, { useState } from 'react';
import { Clock, MapPin, Phone, Mail, Star, Building2, Edit2, Save, X, Plus, Eye } from 'lucide-react';

export const Summary = ({
    name: initialName = "Sample Business",
    description: initialDescription = "A modern business focused on quality and customer satisfaction.",
    location: initialLocation = "123 Main St, City, State",
    hexColors: initialHexColors = ["#3B82F6", "#FFFFFF", "#6B7280"],
    style: initialStyle = "Modern and Professional",
    hours: initialHours = "Mon-Fri 9AM-6PM",
    email: initialEmail = "",
    phone: initialPhone = "",
    uniqueSellingProposition: initialUSP = "We provide exceptional service with innovative solutions.",
    products: initialProducts = [
        {
            id: 1,
            name: "Sample Product",
            description: "High-quality product description that showcases the key features and benefits",
            price: 99,
            currency: "USD",
            paymentType: "One-time",
            images: ["https://via.placeholder.com/300x200?text=Product+Image"]
        }
    ]
}) => {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);
    const [location, setLocation] = useState(initialLocation);
    const [hexColors, setHexColors] = useState(initialHexColors);
    const [style, setStyle] = useState(initialStyle);
    const [hours, setHours] = useState(initialHours);
    const [email, setEmail] = useState(initialEmail);
    const [phone, setPhone] = useState(initialPhone);
    const [uniqueSellingProposition, setUniqueSellingProposition] = useState(initialUSP);
    const [products, setProducts] = useState(initialProducts);
    const [editingField, setEditingField] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const EditableField = ({ value, onChange, placeholder, fieldId, multiline = false, className = "" }) => {
        const isEditing = editingField === fieldId;

        if (isEditing) {
            const handleKeyDown = (e) => {
                if (e.key === 'Enter' && !multiline) {
                    setEditingField(null);
                }
                if (e.key === 'Escape') {
                    setEditingField(null);
                }
            };

            return (
                <div className="flex items-start gap-2">
                    {multiline ? (
                        <textarea
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className="flex-1 bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] resize-none min-h-[80px] focus:border-[#888888] outline-none"
                            autoFocus
                        />
                    ) : (
                        <input
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder}
                            className={`flex-1 bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#888888] outline-none ${className}`}
                            autoFocus
                        />
                    )}
                    <button onClick={() => setEditingField(null)} className="text-green-400 hover:text-green-300 p-1">
                        <Save className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingField(null)} className="text-[#888888] hover:text-[#a1a1a1] p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            );
        }

        return (
            <div
                className="group cursor-pointer hover:bg-[#1a1a1a] rounded-lg px-3 py-2 -mx-3 -my-2 flex gap-2 transition-colors min-h-[36px] items-center"
                onClick={() => setEditingField(fieldId)}
            >
                <span className={`flex-1 text-[#ededed] text-sm ${!value && 'text-[#888888]'}`}>
                    {value || placeholder}
                </span>
                <Edit2 className="w-4 h-4 text-[#666666] group-hover:text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
        );
    };

    const ColorDisplay = ({ colors, onChange, fieldId }) => {
        const isEditing = editingField === fieldId;

        const addColor = () => onChange([...colors, "#000000"]);
        const updateColor = (index, newColor) => {
            const newColors = [...colors];
            newColors[index] = newColor;
            onChange(newColors);
        };
        const removeColor = (index) => {
            if (colors.length > 1) onChange(colors.filter((_, i) => i !== index));
        };

        if (isEditing) {
            return (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <button onClick={addColor} className="text-[#888888] hover:text-[#ededed] p-1">
                            <Plus className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingField(null)} className="text-green-400 hover:text-green-300 p-1">
                            <Save className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingField(null)} className="text-[#888888] hover:text-[#a1a1a1] p-1">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2 bg-[#1a1a1a] border border-[#404040] rounded-lg p-2">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="w-6 h-6 rounded cursor-pointer border border-[#666666]"
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="bg-transparent text-[#ededed] text-sm w-20 outline-none font-mono"
                                />
                                {colors.length > 1 && (
                                    <button onClick={() => removeColor(index)} className="text-red-400 hover:text-red-300 p-1">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div
                className="group cursor-pointer hover:bg-[#1a1a1a] rounded-lg px-3 py-2 -mx-3 -my-2 flex items-center gap-2 transition-colors min-h-[36px]"
                onClick={() => setEditingField(fieldId)}
            >
                <div className="flex gap-1">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="w-6 h-6 rounded-lg border border-[#333333]"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <Edit2 className="w-4 h-4 text-[#666666] group-hover:text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
        );
    };

    const ProductModal = ({ product, onSave, onClose }) => {
        const [formData, setFormData] = useState(product || {
            name: "",
            description: "",
            price: "",
            currency: "USD",
            paymentType: "One-time",
            images: []
        });

        const handleSave = () => {
            onSave(formData);
            onClose();
        };

        const currencies = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "MXN"];
        const paymentTypes = ["One-time", "Monthly", "Yearly"];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-[#0a0a0a] border border-[#262626] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                        <h3 className="text-lg font-semibold text-[#ededed]">
                            {product ? 'Edit Product' : 'Add Product'}
                        </h3>
                        <button onClick={onClose} className="text-[#888888] hover:text-[#a1a1a1]">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#ededed] mb-2">
                                Product Name *
                            </label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#888888] outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#ededed] mb-2">
                                    Price *
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#888888] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#ededed] mb-2">
                                    Currency
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#888888] outline-none"
                                >
                                    {currencies.map(currency => (
                                        <option key={currency} value={currency}>{currency}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#ededed] mb-2">
                                Payment Type
                            </label>
                            <select
                                value={formData.paymentType}
                                onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] focus:border-[#888888] outline-none"
                            >
                                {paymentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#ededed] mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your product..."
                                rows={4}
                                className="w-full bg-[#1a1a1a] border border-[#404040] rounded-lg px-3 py-2 text-sm text-[#ededed] resize-none focus:border-[#888888] outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 p-6 border-t border-[#262626]">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-[#888888] hover:text-[#a1a1a1] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!formData.name || !formData.price}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-[#333333] disabled:text-[#666666] text-white text-sm rounded-lg transition-colors"
                        >
                            {product ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const addProduct = () => {
        setEditingProduct(null);
        setShowProductModal(true);
    };

    const editProduct = (product) => {
        setEditingProduct(product);
        setShowProductModal(true);
    };

    const saveProduct = (productData) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
        } else {
            setProducts([...products, { ...productData, id: Date.now() }]);
        }
    };

    const removeProduct = (productId) => {
        if (products.length > 1) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-[#0a0a0a] border border-[#262626] rounded-xl shadow-lg">
            {/* Header */}
            <div className="p-6 border-b border-[#262626]">
                <div className="flex items-start gap-4 mb-6">
                    <Building2 className="w-6 h-6 text-[#888888] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-xl font-bold text-[#ededed] mb-3">
                            <EditableField value={name} onChange={setName} fieldId="name" placeholder="Business Name" />
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-relaxed">
                            <EditableField value={description} onChange={setDescription} multiline fieldId="description" placeholder="Business description..." />
                        </div>
                    </div>
                </div>

                <div className="bg-[#111111] border border-[#333333] rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-[#888888] mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-[#ededed] text-sm mb-2">What makes us unique</div>
                            <div className="text-[#a1a1a1] text-sm leading-relaxed">
                                <EditableField value={uniqueSellingProposition} onChange={setUniqueSellingProposition} multiline fieldId="usp" placeholder="Unique value proposition..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="p-6 grid lg:grid-cols-3 gap-8 text-sm">
                {/* Contact Information */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#ededed] font-medium mb-3">
                            <MapPin className="w-4 h-4" />
                            Location
                        </div>
                        <EditableField value={location} onChange={setLocation} fieldId="location" placeholder="Business address" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-[#ededed] font-medium mb-3">
                            <Clock className="w-4 h-4" />
                            Hours
                        </div>
                        <EditableField value={hours} onChange={setHours} fieldId="hours" placeholder="Operating hours" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-[#ededed] font-medium mb-3">
                            <Mail className="w-4 h-4" />
                            Email
                        </div>
                        <EditableField value={email} onChange={setEmail} fieldId="email" placeholder="contact@business.com" />
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-[#ededed] font-medium mb-3">
                            <Phone className="w-4 h-4" />
                            Phone
                        </div>
                        <EditableField value={phone} onChange={setPhone} fieldId="phone" placeholder="(555) 123-4567" />
                    </div>
                </div>

                {/* Brand & Style */}
                <div className="space-y-6">
                    <div>
                        <div className="text-[#ededed] font-medium mb-3">Style</div>
                        <EditableField value={style} onChange={setStyle} fieldId="style" placeholder="Business style" />
                    </div>

                    <div>
                        <div className="text-[#ededed] font-medium mb-3">Brand Colors</div>
                        <ColorDisplay colors={hexColors} onChange={setHexColors} fieldId="colors" />
                    </div>
                </div>

                {/* Products */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between text-[#ededed] font-medium mb-3">
                            <span>Products ({products.length})</span>
                            <button
                                onClick={addProduct}
                                className="text-[#888888] hover:text-[#ededed] p-1 transition-colors"
                                title="Add Product"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {products.map((product) => (
                                <div key={product.id} className="bg-[#111111] border border-[#333333] rounded-lg p-4 group">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-[#ededed] text-sm mb-1 truncate">
                                                {product.name}
                                            </div>
                                            <div className="text-[#888888] text-xs mb-2">
                                                {product.currency} ${product.price} • {product.paymentType}
                                            </div>
                                            {product.description && (
                                                <div className="text-[#a1a1a1] text-xs line-clamp-2 leading-relaxed">
                                                    {product.description}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => editProduct(product)}
                                                className="text-[#888888] hover:text-[#ededed] p-1"
                                                title="Edit Product"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {products.length > 1 && (
                                                <button
                                                    onClick={() => removeProduct(product.id)}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                    title="Remove Product"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <ProductModal
                    product={editingProduct}
                    onSave={saveProduct}
                    onClose={() => setShowProductModal(false)}
                />
            )}
        </div>
    );
};

export default Summary;