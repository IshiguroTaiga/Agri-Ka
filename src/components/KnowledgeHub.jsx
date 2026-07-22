import React, { useState } from 'react';
import { 
  BookOpen, Wrench, Sprout, Volume2, Plus, 
  Leaf, ChevronRight, Lock, Edit3, Trash2, X, Check
} from 'lucide-react';
import MediaInput from './MediaInput';
import MediaDisplay from './MediaDisplay';

export default function KnowledgeHub({ 
  knowledgeItems, 
  seasonalGuides, 
  searchQuery, 
  onSpeakText,
  onAddGuide,
  onUpdateGuide,
  onDeleteGuide,
  isGuest,
  onOpenLoginModal
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state for adding/editing guide
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('tech');
  const [formSummary, setFormSummary] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSeason, setFormSeason] = useState('Year-Round');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [formMediaType, setFormMediaType] = useState('image');

  const filteredItems = knowledgeItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('tech');
    setFormSummary('');
    setFormDescription('');
    setFormSeason('Year-Round');
    setFormMediaUrl('');
    setFormMediaType('image');
    setEditingItem(null);
  };

  const handleOpenAddModal = () => {
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item, e) => {
    e?.stopPropagation();
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category || 'tech');
    setFormSummary(item.summary || '');
    setFormDescription(item.description || item.summary || '');
    setFormSeason(item.season || 'Year-Round');
    setFormMediaUrl(item.mediaUrl || item.image || '');
    setFormMediaType(item.mediaType || 'image');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formTitle || !formSummary) return;

    const payload = {
      id: editingItem ? editingItem.id : `kb-${Date.now()}`,
      category: formCategory,
      title: formTitle,
      tags: [formCategory, 'Guide'],
      season: formSeason,
      summary: formSummary,
      description: formDescription || formSummary,
      mediaUrl: formMediaUrl,
      mediaType: formMediaType,
      image: formMediaUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80'
    };

    if (editingItem) {
      onUpdateGuide(payload);
    } else {
      onAddGuide(payload);
    }

    resetForm();
    setShowAddModal(false);
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    if (isGuest) {
      onOpenLoginModal();
      return;
    }
    if (window.confirm('Are you sure you want to delete this guide?')) {
      onDeleteGuide(id);
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>All Farm Guides ({knowledgeItems.length})</span>
          </button>

          <button
            onClick={() => setActiveCategory('tech')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeCategory === 'tech'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Technologies & Tools</span>
          </button>

          <button
            onClick={() => setActiveCategory('knowledge')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeCategory === 'knowledge'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Farming Techniques</span>
          </button>

          <button
            onClick={() => setActiveCategory('crops')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeCategory === 'crops'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Crops & Livestock</span>
          </button>
        </div>

        <button
          onClick={handleOpenAddModal}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-md cursor-pointer ${
            isGuest 
              ? 'bg-slate-700 hover:bg-slate-800 text-slate-200' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isGuest ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-4 h-4" />}
          <span>{isGuest ? 'Login to Add Guide' : 'Add Guide'}</span>
        </button>
      </div>

      {/* Main Knowledge Base Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
            📖
          </div>
          <h3 className="text-xl font-bold text-slate-900">Knowledge Hub is Empty</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click <span className="font-bold text-emerald-700">"Add Guide"</span> to create a farm entry. Attach photos or video clips!
          </p>
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isGuest ? 'Login to Add Guide' : 'Create First Guide'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <MediaDisplay
                    mediaUrl={item.mediaUrl || item.image}
                    mediaType={item.mediaType}
                    altTitle={item.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

                  <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                    {item.category}
                  </span>

                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                    <button
                      onClick={() => onSpeakText(`${item.title}. ${item.summary}`)}
                      title="Listen"
                      className="bg-purple-900/90 hover:bg-purple-800 text-purple-200 p-1.5 rounded-full border border-purple-400/40 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                    </button>
                    {!isGuest && (
                      <>
                        <button
                          onClick={(e) => handleOpenEditModal(item, e)}
                          title="Edit Guide"
                          className="bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 p-1.5 rounded-full border border-emerald-400/40 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Delete Guide"
                          className="bg-red-900/90 hover:bg-red-800 text-red-200 p-1.5 rounded-full border border-red-400/40 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-300" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 gap-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Read Guide</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal View */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-emerald-200 shadow-2xl overflow-hidden my-8">
            <div className="relative h-72 bg-slate-900">
              <MediaDisplay
                mediaUrl={selectedItem.mediaUrl || selectedItem.image}
                mediaType={selectedItem.mediaType}
                altTitle={selectedItem.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
              
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-slate-900/80 text-white hover:bg-slate-800 rounded-full w-9 h-9 flex items-center justify-center text-sm font-bold border border-slate-700 cursor-pointer z-10"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white pointer-events-none">
                <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
                  {selectedItem.category} Guide
                </span>
                <h2 className="text-xl sm:text-2xl font-black">{selectedItem.title}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6 text-slate-800 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div>
                  <div className="text-xs text-emerald-800 font-bold uppercase">Target Season</div>
                  <div className="text-sm font-bold text-slate-900">{selectedItem.season || 'Year-Round'}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSpeakText(`${selectedItem.title}. ${selectedItem.summary}. ${selectedItem.description}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Speech</span>
                  </button>

                  {!isGuest && (
                    <>
                      <button
                        onClick={(e) => {
                          const itm = selectedItem;
                          setSelectedItem(null);
                          handleOpenEditModal(itm, e);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => handleDelete(selectedItem.id, e)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-md cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Summary Overview</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {selectedItem.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Instructions</h4>
                <div className="whitespace-pre-line text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedItem.description}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Guide Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl p-6 max-w-lg w-full border border-emerald-200 shadow-2xl space-y-4 my-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <span>{editingItem ? 'Edit Knowledge Guide' : 'Add Knowledge Guide'}</span>
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title</label>
              <input 
                type="text" 
                required 
                value={formTitle} 
                onChange={e => setFormTitle(e.target.value)} 
                placeholder="e.g. Solar Drip Setup Guide" 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <select 
                  value={formCategory} 
                  onChange={e => setFormCategory(e.target.value)} 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none font-semibold"
                >
                  <option value="tech">Technologies & Tools</option>
                  <option value="knowledge">Farming Techniques</option>
                  <option value="crops">Crops & Livestock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Season</label>
                <input 
                  type="text" 
                  value={formSeason} 
                  onChange={e => setFormSeason(e.target.value)} 
                  placeholder="e.g. Wet Season, Year-Round" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Summary</label>
              <textarea 
                rows={2} 
                required 
                value={formSummary} 
                onChange={e => setFormSummary(e.target.value)} 
                placeholder="Brief summary..." 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detailed Instructions / Content</label>
              <textarea 
                rows={3} 
                value={formDescription} 
                onChange={e => setFormDescription(e.target.value)} 
                placeholder="Step by step instructions..." 
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
              />
            </div>

            {/* Media Attachment Component */}
            <MediaInput
              mediaUrl={formMediaUrl}
              setMediaUrl={setFormMediaUrl}
              mediaType={formMediaType}
              setMediaType={setFormMediaType}
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)} 
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingItem ? 'Update Guide' : 'Save Guide'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
