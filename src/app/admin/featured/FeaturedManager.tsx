'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Loader2, Plus, Search, Trash2, GripVertical, Eye, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { addToFeatured, removeFromFeatured, searchPalettes, updateFeaturedOrder, type FeaturedPalette } from './actions';

// --- Sortable Item Component ---
function SortableItem({ palette, onRemove }: { palette: FeaturedPalette; onRemove: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: palette.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white group hover:border-blue-400 transition-colors"
        >
            <div {...attributes} {...listeners} className="cursor-grab hover:text-gray-700 text-gray-400 touch-none">
                <GripVertical size={20} />
            </div>

            {/* Palette Preview */}
            <div className="flex h-10 w-20 rounded-md overflow-hidden border border-gray-100 shadow-sm shrink-0">
                {palette.colors.map((color, i) => (
                    <div key={i} style={{ backgroundColor: color }} className="h-full flex-1" />
                ))}
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{palette.name}</h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Heart size={12} /> {palette.favorites_count}</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {palette.views_count}</span>
                </div>
            </div>

            <button
                onClick={() => onRemove(palette.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Remove from featured"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}

// --- Main Manager Component ---
export default function FeaturedManager({ initialPalettes }: { initialPalettes: FeaturedPalette[] }) {
    const [palettes, setPalettes] = useState<FeaturedPalette[]>(initialPalettes);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Partial<FeaturedPalette>[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPalettes((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Trigger save in background
                handleSaveOrder(newItems);

                return newItems;
            });
        }
    }

    async function handleSaveOrder(items: FeaturedPalette[]) {
        setIsSaving(true);
        try {
            const updates = items.map((item, index) => ({
                id: item.id,
                featured_order: index + 1
            }));
            await updateFeaturedOrder(updates);
            // toast.success('Order updated'); 
        } catch (error) {
            toast.error('Failed to update order');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleRemove(id: string) {
        if (!confirm('Are you sure you want to remove this palette from featured?')) return;

        const original = [...palettes];
        setPalettes(palettes.filter(p => p.id !== id)); // Optimistic

        try {
            await removeFromFeatured(id);
            toast.success('Removed from featured');
        } catch (error) {
            setPalettes(original);
            toast.error('Failed to remove');
            console.error(error);
        }
    }

    async function performSearch(query: string) {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // Debounce could be good, but direct simple implementation for now
            const results = await searchPalettes(query);
            // Filter out already featured
            const existingIds = new Set(palettes.map(p => p.id));
            setSearchResults(results.filter((r: any) => !existingIds.has(r.id)));
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    }

    async function handleAdd(paletteId: string) {
        try {
            await addToFeatured(paletteId);
            toast.success('Added to featured');
            setShowAddModal(false);
            setSearchQuery('');
            setSearchResults([]);

            // We need to refresh the list from server ideally or assume success
            // For simplicity, we trigger a page reload or router refresh in the parent, 
            // but since we are client side, simplest is to wait for the real data or refetch.
            // But we can't easily refetch server props here without router.refresh() 
            // inside 'addToFeatured' (which has revalidatePath). 
            // However, the client state won't update automatically unless we receive the new item.
            // Let's just reload the page for now or force a refresh.
            window.location.reload();
        } catch (error) {
            toast.error('Failed to add palette');
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Featured Items ({palettes.length}/6)</h2>
                        <p className="text-sm text-gray-500">Drag items to reorder. Maximum 6 items recommended.</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
                    >
                        <Plus size={16} /> Add Palette
                    </button>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={palettes.map(p => p.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {palettes.map((palette) => (
                                <SortableItem
                                    key={palette.id}
                                    palette={palette}
                                    onRemove={handleRemove}
                                />
                            ))}

                            {palettes.length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                    <p className="text-gray-500">No featured palettes yet.</p>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="text-blue-600 font-medium hover:underline mt-2"
                                    >
                                        Add one now
                                    </button>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <Search className="text-gray-400" size={20} />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search by palette name..."
                                className="flex-1 outline-none text-gray-900 placeholder:text-gray-400"
                                value={searchQuery}
                                onChange={(e) => performSearch(e.target.value)}
                            />
                            <div onClick={() => setShowAddModal(false)} className="cursor-pointer text-gray-400 hover:text-gray-600 text-sm font-medium p-2">
                                Close
                            </div>
                        </div>

                        <div className="overflow-y-auto p-2 space-y-1 flex-1 min-h-[300px]">
                            {isSearching ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-gray-400" /></div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((result: any) => (
                                    <div key={result.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group">
                                        <div className="flex h-8 w-16 rounded overflow-hidden shrink-0 border border-gray-100">
                                            {result.colors.map((c: string, i: number) => (
                                                <div key={i} style={{ backgroundColor: c }} className="flex-1" />
                                            ))}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="font-medium text-gray-900 truncate">{result.name}</div>
                                            <div className="text-xs text-gray-500 flex gap-2">
                                                <span>❤️ {result.favorites_count}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAdd(result.id)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-bold hover:bg-blue-100"
                                        >
                                            ADD
                                        </button>
                                    </div>
                                ))
                            ) : searchQuery.length > 1 ? (
                                <p className="text-center text-gray-500 py-8">No results found.</p>
                            ) : (
                                <p className="text-center text-gray-400 py-8 text-sm">Type to search for published palettes...</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
