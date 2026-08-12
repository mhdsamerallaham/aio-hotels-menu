import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Coffee, Upload, Image as ImageIcon, Sparkles, Milk, Droplets, Zap } from 'lucide-react';
import useMenuStore from '../../store/menuStore';

export default function ProductEditorModal({ product, isOpen, onClose }) {
  const categories = useMenuStore((s) => s.categories);
  const addProduct = useMenuStore((s) => s.addProduct);
  const updateProduct = useMenuStore((s) => s.updateProduct);

  const [nameTr, setNameTr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descTr, setDescTr] = useState('');
  const [descEn, setDescEn] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'coffee-rituals');
  const [image, setImage] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [popular, setPopular] = useState(false);
  const [location, setLocation] = useState('Şişli');

  // Dynamic Lists for 4 Separate Option Groups
  const [sizes, setSizes] = useState([]);
  const [milks, setMilks] = useState([]);
  const [syrups, setSyrups] = useState([]);
  const [shots, setShots] = useState([]);
  const [extras, setExtras] = useState([]);

  // Draft inputs for adding new items to each group
  const [newSizeTr, setNewSizeTr] = useState('');
  const [newSizeEn, setNewSizeEn] = useState('');
  const [newSizePrice, setNewSizePrice] = useState(0);

  const [newMilkTr, setNewMilkTr] = useState('');
  const [newMilkEn, setNewMilkEn] = useState('');
  const [newMilkPrice, setNewMilkPrice] = useState(0);

  const [newSyrupTr, setNewSyrupTr] = useState('');
  const [newSyrupEn, setNewSyrupEn] = useState('');
  const [newSyrupPrice, setNewSyrupPrice] = useState(0);

  const [newShotTr, setNewShotTr] = useState('');
  const [newShotEn, setNewShotEn] = useState('');
  const [newShotPrice, setNewShotPrice] = useState(0);

  const [newExtraTr, setNewExtraTr] = useState('');
  const [newExtraEn, setNewExtraEn] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState(0);

  useEffect(() => {
    if (product) {
      setNameTr(typeof product.name === 'object' ? product.name.tr : product.name || '');
      setNameEn(typeof product.name === 'object' ? product.name.en : product.name || '');
      setDescTr(typeof product.description === 'object' ? product.description.tr : product.description || '');
      setDescEn(typeof product.description === 'object' ? product.description.en : product.description || '');
      setCategory(product.category || categories[0]?.id || 'coffee-rituals');
      setImage(product.image || '');
      setBasePrice(product.basePrice || 0);
      setPopular(Boolean(product.popular));
      setLocation(product.location || 'Şişli');

      // Normalize sizes
      setSizes(
        (product.sizes || []).map((s) => ({
          tr: typeof s.name === 'object' ? s.name.tr : s.name,
          en: typeof s.name === 'object' ? s.name.en : s.name,
          price: Number(s.price) || 0,
        }))
      );

      // Categorize explicit or legacy option groups
      const allExtras = product.extras || [];
      const expMilks = product.milks || [];
      const expSyrups = product.syrups || [];
      const expShots = product.shots || [];

      if (expMilks.length > 0 || expSyrups.length > 0 || expShots.length > 0) {
        setMilks(expMilks.map((m) => ({ tr: typeof m.name === 'object' ? m.name.tr : m.name, en: typeof m.name === 'object' ? m.name.en : m.name, price: Number(m.price) || 0 })));
        setSyrups(expSyrups.map((s) => ({ tr: typeof s.name === 'object' ? s.name.tr : s.name, en: typeof s.name === 'object' ? s.name.en : s.name, price: Number(s.price) || 0 })));
        setShots(expShots.map((s) => ({ tr: typeof s.name === 'object' ? s.name.tr : s.name, en: typeof s.name === 'object' ? s.name.en : s.name, price: Number(s.price) || 0 })));
        setExtras(allExtras.map((e) => ({ tr: typeof e.name === 'object' ? e.name.tr : e.name, en: typeof e.name === 'object' ? e.name.en : e.name, price: Number(e.price) || 0 })));
      } else {
        // Auto-split allExtras
        const mList = [];
        const sList = [];
        const shList = [];
        const eList = [];

        allExtras.forEach((item) => {
          const itemTr = typeof item.name === 'object' ? item.name.tr : String(item.name);
          const itemEn = typeof item.name === 'object' ? item.name.en : itemTr;
          const lower = (itemTr + ' ' + itemEn).toLowerCase();
          const p = Number(item.price) || 0;

          if (lower.includes('süt') || lower.includes('milk')) {
            mList.push({ tr: itemTr, en: itemEn, price: p });
          } else if (lower.includes('şurup') || lower.includes('syrup')) {
            sList.push({ tr: itemTr, en: itemEn, price: p });
          } else if (lower.includes('shot') || lower.includes('espresso')) {
            shList.push({ tr: itemTr, en: itemEn, price: p });
          } else {
            eList.push({ tr: itemTr, en: itemEn, price: p });
          }
        });

        // Default milk options if none specified for coffee drinks
        if (mList.length === 0 && (product.category === 'coffee-rituals' || product.category === 'iced-coffee' || product.category === 'matcha-lounge')) {
          mList.push(
            { tr: 'Standart Süt', en: 'Standard Milk', price: 0 },
            { tr: 'Yulaf Sütü', en: 'Oat Milk', price: 20 },
            { tr: 'Badem Sütü', en: 'Almond Milk', price: 20 },
            { tr: 'Laktozsuz Süt', en: 'Lactose-Free Milk', price: 15 }
          );
        }

        setMilks(mList);
        setSyrups(sList);
        setShots(shList);
        setExtras(eList);
      }
    } else {
      setNameTr('');
      setNameEn('');
      setDescTr('');
      setDescEn('');
      setCategory(categories[0]?.id || 'coffee-rituals');
      setImage('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop');
      setBasePrice(120);
      setPopular(false);
      setLocation('Şişli');
      setSizes([
        { tr: 'Küçük', en: 'Small', price: 0 },
        { tr: 'Orta', en: 'Medium', price: 15 },
        { tr: 'Büyük', en: 'Large', price: 30 },
      ]);
      setMilks([
        { tr: 'Standart Süt', en: 'Standard Milk', price: 0 },
        { tr: 'Yulaf Sütü', en: 'Oat Milk', price: 20 },
        { tr: 'Badem Sütü', en: 'Almond Milk', price: 20 },
        { tr: 'Laktozsuz Süt', en: 'Lactose-Free Milk', price: 15 },
      ]);
      setSyrups([
        { tr: 'Vanilya Şurubu', en: 'Vanilla Syrup', price: 20 },
        { tr: 'Karamel Şurubu', en: 'Caramel Syrup', price: 20 },
        { tr: 'Fındık Şurubu', en: 'Hazelnut Syrup', price: 20 },
      ]);
      setShots([
        { tr: 'Ekstra Espresso Shot', en: 'Extra Espresso Shot', price: 25 },
        { tr: 'Double Shot Espresso', en: 'Double Shot Espresso', price: 40 },
      ]);
      setExtras([]);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  // Device file upload
  const handleDeviceImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Helper CRUD generators
  const createCrudHandlers = (list, setList, draftTr, draftEn, draftPrice, setDraftTr, setDraftEn, setDraftPrice) => ({
    add: () => {
      if (!draftTr.trim()) return;
      setList([...list, { tr: draftTr.trim(), en: draftEn.trim() || draftTr.trim(), price: Number(draftPrice) || 0 }]);
      setDraftTr('');
      setDraftEn('');
      setDraftPrice(0);
    },
    update: (index, field, value) => {
      const updated = [...list];
      updated[index][field] = field === 'price' ? Number(value) || 0 : value;
      setList(updated);
    },
    remove: (index) => {
      setList(list.filter((_, i) => i !== index));
    },
  });

  const sizeHandlers = createCrudHandlers(sizes, setSizes, newSizeTr, newSizeEn, newSizePrice, setNewSizeTr, setNewSizeEn, setNewSizePrice);
  const milkHandlers = createCrudHandlers(milks, setMilks, newMilkTr, newMilkEn, newMilkPrice, setNewMilkTr, setNewMilkEn, setNewMilkPrice);
  const syrupHandlers = createCrudHandlers(syrups, setSyrups, newSyrupTr, newSyrupEn, newSyrupPrice, setNewSyrupTr, setNewSyrupEn, setNewSyrupPrice);
  const shotHandlers = createCrudHandlers(shots, setShots, newShotTr, newShotEn, newShotPrice, setNewShotTr, setNewShotEn, setNewShotPrice);
  const extraHandlers = createCrudHandlers(extras, setExtras, newExtraTr, newExtraEn, newExtraPrice, setNewExtraTr, setNewExtraEn, setNewExtraPrice);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formatted = (arr) => arr.map((item) => ({ name: { tr: item.tr, en: item.en }, price: item.price }));

    const productPayload = {
      name: { tr: nameTr || 'Yeni İçecek', en: nameEn || nameTr || 'New Drink' },
      description: { tr: descTr || '', en: descEn || descTr || '' },
      category,
      image,
      basePrice: Number(basePrice) || 0,
      popular,
      location,
      sizes: formatted(sizes),
      milks: formatted(milks),
      syrups: formatted(syrups),
      shots: formatted(shots),
      extras: formatted(extras),
      display: true,
    };

    if (product?.id) {
      updateProduct(product.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-stone-200 flex items-center justify-between bg-[#4A1525] text-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold border border-white/20">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white" style={{ color: '#FFFFFF' }}>
                {product ? 'Ürün ve Seçenekleri Düzenle' : 'Yeni Ürün & Seçenek Ekle'}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-rose-200 mt-0.5">
                Süt (Tek Seçim), Şurup, Shot ve Boyut seçeneklerini ayrı gruplarda yönetin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-rose-200 hover:text-white rounded-full cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body with Generous Spacing */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-9 space-y-8 sm:space-y-9 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Photo Section */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <h3 className="text-sm sm:text-base font-extrabold text-[#4A1525] uppercase tracking-wider font-heading flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-[#4A1525]" />
              <span>Ürün Fotoğrafı (Aygıttan Yükle veya Web Linki)</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-stone-300 bg-white overflow-hidden shrink-0 flex items-center justify-center relative shadow-xs">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-stone-300" />
                )}
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="px-5 py-3 bg-[#4A1525] hover:bg-[#360F1B] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-4 h-4 text-white" />
                    <span>Aygıttan Fotoğraf Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDeviceImageUpload}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="px-4 py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Fotoğrafı Kaldır
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-600">Veya Web Görsel Linki (URL):</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 focus:outline-none focus:border-[#4A1525]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-5 border-t border-stone-100 pt-6">
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading">
              Temel İçecek Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Ürün Adı (Türkçe 🇹🇷)</label>
                <input
                  type="text"
                  value={nameTr}
                  onChange={(e) => setNameTr(e.target.value)}
                  placeholder="Örn: Cold Brew Ritual"
                  required
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-stone-900 focus:outline-none focus:border-[#4A1525]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Ürün Adı (İngilizce 🇬🇧)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Cold Brew Ritual"
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-stone-900 focus:outline-none focus:border-[#4A1525]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Açıklama (TR 🇹🇷)</label>
                <textarea
                  value={descTr}
                  onChange={(e) => setDescTr(e.target.value)}
                  rows={2}
                  placeholder="Demleme ve lezzet notları..."
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl p-4 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1525]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Açıklama (EN 🇬🇧)</label>
                <textarea
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                  rows={2}
                  placeholder="Craft brew description..."
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl p-4 text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-[#4A1525]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl px-4 py-3 text-sm sm:text-base font-bold text-stone-900 focus:outline-none focus:border-[#4A1525] cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {typeof c.name === 'object' ? c.name.tr : c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800">Taban Fiyat (₺)</label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                  className="w-full bg-white border-2 border-stone-200 rounded-2xl px-4 py-3 text-lg font-black text-[#4A1525] focus:outline-none focus:border-[#4A1525]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="popular-check"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="w-5 h-5 rounded-lg text-[#4A1525] focus:ring-0 cursor-pointer accent-[#4A1525]"
              />
              <label htmlFor="popular-check" className="text-xs sm:text-sm font-extrabold text-stone-800 cursor-pointer select-none">
                Favori Ürün Olarak Etiketle (Öne Çıkar)
              </label>
            </div>
          </div>

          {/* Group 1: Boy Seçenekleri (Sizes) */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading flex items-center gap-2.5">
                <Coffee className="w-5 h-5 text-[#4A1525]" />
                <span>1. Boy Seçenekleri (Sizes)</span>
              </h3>
              <span className="text-xs font-bold text-stone-500">{sizes.length} tanımlı</span>
            </div>

            <div className="space-y-3">
              {sizes.map((s, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <input
                    type="text"
                    value={s.tr}
                    onChange={(e) => sizeHandlers.update(idx, 'tr', e.target.value)}
                    placeholder="Boyut Adı (TR)"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={s.en}
                    onChange={(e) => sizeHandlers.update(idx, 'en', e.target.value)}
                    placeholder="Size (EN)"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-600">+₺</span>
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => sizeHandlers.update(idx, 'price', e.target.value)}
                      className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-black text-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => sizeHandlers.remove(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200/80">
              <input
                type="text"
                value={newSizeTr}
                onChange={(e) => setNewSizeTr(e.target.value)}
                placeholder="Yeni Boyut (TR) Örn: Büyük"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <input
                type="text"
                value={newSizeEn}
                onChange={(e) => setNewSizeEn(e.target.value)}
                placeholder="Size (EN) e.g. Large"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  value={newSizePrice}
                  onChange={(e) => setNewSizePrice(e.target.value)}
                  placeholder="+₺ Fark"
                  className="w-24 bg-white border border-stone-300 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={sizeHandlers.add}
                  className="px-4 py-2.5 bg-[#4A1525] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-[#360F1B] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Ekle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group 2: Süt Seçenekleri (Milks — Single Select Radio) */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading flex items-center gap-2.5">
                  <Milk className="w-5 h-5 text-[#4A1525]" />
                  <span>2. Süt Seçimi (Sadece Tek Seçim / Radio)</span>
                </h3>
                <p className="text-xs text-stone-500 font-medium">Müşteri siparişte sadece 1 süt tercihi yapabilir</p>
              </div>
              <span className="text-xs font-bold text-stone-500">{milks.length} süt seçeneği</span>
            </div>

            <div className="space-y-3">
              {milks.map((m, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <input
                    type="text"
                    value={m.tr}
                    onChange={(e) => milkHandlers.update(idx, 'tr', e.target.value)}
                    placeholder="Süt Adı (TR) Örn: Yulaf Sütü"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={m.en}
                    onChange={(e) => milkHandlers.update(idx, 'en', e.target.value)}
                    placeholder="Milk Name (EN) e.g. Oat Milk"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-600">+₺</span>
                    <input
                      type="number"
                      value={m.price}
                      onChange={(e) => milkHandlers.update(idx, 'price', e.target.value)}
                      className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-black text-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => milkHandlers.remove(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200/80">
              <input
                type="text"
                value={newMilkTr}
                onChange={(e) => setNewMilkTr(e.target.value)}
                placeholder="Yeni Süt Seçeneği (TR) Örn: Badem Sütü"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <input
                type="text"
                value={newMilkEn}
                onChange={(e) => setNewMilkEn(e.target.value)}
                placeholder="Milk (EN) e.g. Almond Milk"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  value={newMilkPrice}
                  onChange={(e) => setNewMilkPrice(e.target.value)}
                  placeholder="+₺ Fark"
                  className="w-24 bg-white border border-stone-300 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={milkHandlers.add}
                  className="px-4 py-2.5 bg-[#4A1525] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-[#360F1B] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Süt Ekle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group 3: Şurup Seçenekleri (Syrups) */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading flex items-center gap-2.5">
                <Droplets className="w-5 h-5 text-[#4A1525]" />
                <span>3. Şurup Seçenekleri (Syrups)</span>
              </h3>
              <span className="text-xs font-bold text-stone-500">{syrups.length} şurup tanımlı</span>
            </div>

            <div className="space-y-3">
              {syrups.map((s, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <input
                    type="text"
                    value={s.tr}
                    onChange={(e) => syrupHandlers.update(idx, 'tr', e.target.value)}
                    placeholder="Şurup Adı (TR) Örn: Vanilya Şurubu"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={s.en}
                    onChange={(e) => syrupHandlers.update(idx, 'en', e.target.value)}
                    placeholder="Syrup (EN) e.g. Vanilla Syrup"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-600">+₺</span>
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => syrupHandlers.update(idx, 'price', e.target.value)}
                      className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-black text-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => syrupHandlers.remove(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200/80">
              <input
                type="text"
                value={newSyrupTr}
                onChange={(e) => setNewSyrupTr(e.target.value)}
                placeholder="Yeni Şurup (TR) Örn: Karamel Şurubu"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <input
                type="text"
                value={newSyrupEn}
                onChange={(e) => setNewSyrupEn(e.target.value)}
                placeholder="Syrup (EN) e.g. Caramel Syrup"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  value={newSyrupPrice}
                  onChange={(e) => setNewSyrupPrice(e.target.value)}
                  placeholder="+₺ Fark"
                  className="w-24 bg-white border border-stone-300 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={syrupHandlers.add}
                  className="px-4 py-2.5 bg-[#4A1525] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-[#360F1B] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Şurup Ekle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group 4: Ekstra Shot Seçenekleri (Espresso Shots) */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#4A1525]" />
                <span>4. Ekstra Shot Seçenekleri (Espresso Shots)</span>
              </h3>
              <span className="text-xs font-bold text-stone-500">{shots.length} shot seçeneği</span>
            </div>

            <div className="space-y-3">
              {shots.map((sh, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <input
                    type="text"
                    value={sh.tr}
                    onChange={(e) => shotHandlers.update(idx, 'tr', e.target.value)}
                    placeholder="Shot Adı (TR) Örn: Ekstra Shot Espresso"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={sh.en}
                    onChange={(e) => shotHandlers.update(idx, 'en', e.target.value)}
                    placeholder="Shot Name (EN) e.g. Extra Espresso Shot"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-600">+₺</span>
                    <input
                      type="number"
                      value={sh.price}
                      onChange={(e) => shotHandlers.update(idx, 'price', e.target.value)}
                      className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-black text-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => shotHandlers.remove(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200/80">
              <input
                type="text"
                value={newShotTr}
                onChange={(e) => setNewShotTr(e.target.value)}
                placeholder="Yeni Shot (TR) Örn: Double Shot Espresso"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <input
                type="text"
                value={newShotEn}
                onChange={(e) => setNewShotEn(e.target.value)}
                placeholder="Shot (EN) e.g. Double Shot"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  value={newShotPrice}
                  onChange={(e) => setNewShotPrice(e.target.value)}
                  placeholder="+₺ Fark"
                  className="w-24 bg-white border border-stone-300 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={shotHandlers.add}
                  className="px-4 py-2.5 bg-[#4A1525] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-[#360F1B] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Shot Ekle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Group 5: Diğer Ekstralar (Other Extras) */}
          <div className="bg-stone-50 p-6 sm:p-7 rounded-3xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wider font-heading flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#4A1525]" />
                <span>5. Diğer Ekstralar & Özel İstekler</span>
              </h3>
              <span className="text-xs font-bold text-stone-500">{extras.length} diğer ekstra tanımlı</span>
            </div>

            <div className="space-y-3">
              {extras.map((ex, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <input
                    type="text"
                    value={ex.tr}
                    onChange={(e) => extraHandlers.update(idx, 'tr', e.target.value)}
                    placeholder="Ekstra Adı (TR) Örn: Isıtılsın"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={ex.en}
                    onChange={(e) => extraHandlers.update(idx, 'en', e.target.value)}
                    placeholder="Extra (EN) e.g. Warmed Up"
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-900"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-stone-600">+₺</span>
                    <input
                      type="number"
                      value={ex.price}
                      onChange={(e) => extraHandlers.update(idx, 'price', e.target.value)}
                      className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-black text-[#4A1525]"
                    />
                    <button
                      type="button"
                      onClick={() => extraHandlers.remove(idx)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-xl transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200/80">
              <input
                type="text"
                value={newExtraTr}
                onChange={(e) => setNewExtraTr(e.target.value)}
                placeholder="Diğer Ekstra (TR) Örn: Ekstra Kremalı"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <input
                type="text"
                value={newExtraEn}
                onChange={(e) => setNewExtraEn(e.target.value)}
                placeholder="Extra (EN) e.g. Extra Cream"
                className="w-full sm:flex-1 bg-white border border-stone-300 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  value={newExtraPrice}
                  onChange={(e) => setNewExtraPrice(e.target.value)}
                  placeholder="+₺ Fark"
                  className="w-24 bg-white border border-stone-300 rounded-2xl px-3 py-2.5 text-xs sm:text-sm font-bold"
                />
                <button
                  type="button"
                  onClick={extraHandlers.add}
                  className="px-4 py-2.5 bg-[#4A1525] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 hover:bg-[#360F1B] cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Ekle</span>
                </button>
              </div>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-6 sm:p-7 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer transition-colors"
          >
            İptal
          </button>

          <button
            onClick={handleSubmit}
            className="px-9 py-3.5 bg-[#4A1525] hover:bg-[#360F1B] text-white rounded-2xl font-extrabold font-heading text-xs sm:text-sm shadow-md shadow-[#4A1525]/20 cursor-pointer transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            Tüm Değişiklikleri Kaydet
          </button>
        </div>

      </div>
    </div>
  );
}
