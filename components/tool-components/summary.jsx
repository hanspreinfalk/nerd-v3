import React, { useState } from 'react';
import { CheckSquare, Palette, Edit2, Plus, X } from 'lucide-react';

export const Summary = ({
    projectName = "Sample Todo Project",
    description = "A comprehensive project to organize and track important tasks.",
    hexColors = ["#3B82F6", "#FFFFFF", "#6B7280"],
    style = "Modern and Clean"
}) => {
    const [name, setName] = useState(projectName);
    const [desc, setDesc] = useState(description);
    const [colors, setColors] = useState(hexColors);
    const [projectStyle, setProjectStyle] = useState(style);
    const [editingField, setEditingField] = useState(null);

    const EditableText = ({ value, onChange, fieldId, placeholder, multiline = false }) => {
        const isEditing = editingField === fieldId;

        if (isEditing) {
            return multiline ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === 'Escape' && setEditingField(null)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                    placeholder={placeholder}
                    autoFocus
                    rows={3}
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') setEditingField(null);
                    }}
                    className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                    placeholder={placeholder}
                    autoFocus
                />
            );
        }

        return (
            <div
                onClick={() => setEditingField(fieldId)}
                className="group cursor-pointer hover:bg-gray-800 rounded px-2 py-1 -mx-2 -my-1 flex items-center gap-2"
            >
                <span className="flex-1 text-white">{value}</span>
                <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100" />
            </div>
        );
    };

    const ColorEditor = () => {
        const isEditing = editingField === 'colors';

        const updateColor = (index, newColor) => {
            const newColors = [...colors];
            newColors[index] = newColor;
            setColors(newColors);
        };

        const addColor = () => setColors([...colors, "#000000"]);
        const removeColor = (index) => colors.length > 1 && setColors(colors.filter((_, i) => i !== index));

        if (isEditing) {
            return (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <button onClick={addColor} className="text-blue-400 hover:text-blue-300">
                            <Plus className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingField(null)} className="text-gray-500 hover:text-gray-400">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-1 bg-gray-800 rounded p-1">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="w-5 h-5 rounded cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => updateColor(index, e.target.value)}
                                    className="w-16 text-xs bg-transparent text-white outline-none font-mono"
                                />
                                {colors.length > 1 && (
                                    <button onClick={() => removeColor(index)} className="text-red-400 hover:text-red-300">
                                        <X className="w-3 h-3" />
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
                onClick={() => setEditingField('colors')}
                className="group cursor-pointer hover:bg-gray-800 rounded px-2 py-1 -mx-2 -my-1 flex items-center gap-2"
            >
                <div className="flex gap-1.5">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="w-6 h-6 rounded-md border border-gray-700 shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                <Edit2 className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100" />
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto border rounded-lg">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <div className="text-lg font-semibold text-white mb-2">
                            <EditableText
                                value={name}
                                onChange={setName}
                                fieldId="name"
                                placeholder="Project Name"
                            />
                        </div>
                        <div className="text-sm text-gray-400 leading-relaxed">
                            <EditableText
                                value={desc}
                                onChange={setDesc}
                                fieldId="description"
                                placeholder="Project description..."
                                multiline
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-300">Style</span>
                    </div>
                    <div className="text-sm text-gray-400">
                        <EditableText
                            value={projectStyle}
                            onChange={setProjectStyle}
                            fieldId="style"
                            placeholder="Style preference"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Colors</span>
                    <ColorEditor />
                </div>
            </div>
        </div>
    );
};