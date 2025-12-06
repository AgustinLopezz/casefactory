import { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Package, ShoppingCart, Plus, History, Trash2, DollarSign, Pencil, X } from 'lucide-react';

const CATEGORIES = ['Fundas', 'Cargadores', 'Auriculares', 'Cables', 'Otros'];

const InventoryView = () => {
  const { products, addProduct, editProduct, deleteProduct, loading } = useStore();
  const [productForm, setProductForm] = useState({ id: null, code: '', name: '', model: '', category: 'Fundas', price: '', stock: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;
    
    if (productForm.id) {
      editProduct(productForm.id, productForm);
    } else {
      addProduct(productForm);
    }
    
    setProductForm({ id: null, code: '', name: '', model: '', category: 'Fundas', price: '', stock: '' });
    setIsFormOpen(false);
  };

  const handleEdit = (product) => {
    setProductForm(product);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setProductForm({ id: null, code: '', name: '', model: '', category: 'Fundas', price: '', stock: '' });
    setIsFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
        <button 
          onClick={handleNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Nuevo Producto
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold mb-4">{productForm.id ? 'Editar Producto' : 'Agregar Producto'}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Código / PLU</label>
                <input
                  type="text"
                  placeholder="ej. 12345"
                  className="w-full border p-2 rounded"
                  value={productForm.code || ''}
                  onChange={e => setProductForm({...productForm, code: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="ej. Funda Silicona"
                  className="w-full border p-2 rounded"
                  value={productForm.name}
                  onChange={e => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  placeholder="ej. iPhone 13"
                  className="w-full border p-2 rounded"
                  value={productForm.model}
                  onChange={e => setProductForm({...productForm, model: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  className="w-full border p-2 rounded"
                  value={productForm.category}
                  onChange={e => setProductForm({...productForm, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full border p-2 rounded"
                  value={productForm.price}
                  onChange={e => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full border p-2 rounded"
                  value={productForm.stock}
                  onChange={e => setProductForm({...productForm, stock: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="bg-green-600 text-white p-3 rounded-lg font-semibold md:col-span-2 hover:bg-green-700 mt-2">
                {productForm.id ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-medium text-gray-500">Código</th>
              <th className="p-4 font-medium text-gray-500">Producto</th>
              <th className="p-4 font-medium text-gray-500 hidden md:table-cell">Categoría</th>
              <th className="p-4 font-medium text-gray-500">Precio</th>
              <th className="p-4 font-medium text-gray-500">Stock</th>
              <th className="p-4 font-medium text-gray-500 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">Cargando inventario...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">No hay productos registrados</td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="p-4 text-sm font-mono text-gray-500">{p.code || '-'}</td>
                  <td className="p-4">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{p.model}</div>
                  </td>
                  <td className="p-4 text-gray-600 hidden md:table-cell">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase tracking-wide font-semibold">
                      {p.category || 'General'}
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-medium">${p.price}</td>
                  <td className={`p-4 font-bold ${parseInt(p.stock) < 5 ? 'text-red-500' : 'text-blue-600'}`}>
                    {p.stock}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="text-blue-400 hover:text-blue-600 p-1 inline-block"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-400 hover:text-red-600 p-1 inline-block"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SalesView = () => {
  const { products, sales, addSale, loading } = useStore();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [pluCode, setPluCode] = useState('');

  const handlePluChange = (e) => {
    const code = e.target.value;
    setPluCode(code);
    const product = products.find(p => p.code === code);
    if (product) {
      setSelectedProduct(product.id);
    }
  };

  const handleSale = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;
    
    if (parseInt(product.stock) < quantity) {
      alert('No hay suficiente stock!');
      return;
    }

    addSale({
      productId: selectedProduct,
      quantity: parseInt(quantity),
      price: product.price
    });
    
    setSelectedProduct('');
    setQuantity(1);
    setPluCode('');
  };

  // Calcular ganancias del día
  const today = new Date().toDateString();
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === today);
  const todayTotal = todaySales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-6">
      {/* Resumen del día */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <DollarSign size={32} />
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium">Ganancias de Hoy</p>
            <h3 className="text-3xl font-bold">${todayTotal}</h3>
            <p className="text-xs text-green-100 mt-1">{todaySales.length} ventas realizadas hoy</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de Venta */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart size={24} className="text-blue-600" /> Nueva Venta
            </h2>
            <form onSubmit={handleSale} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por Código / PLU</label>
                <input 
                  type="text" 
                  className="w-full border p-2 rounded-lg bg-gray-50"
                  placeholder="Ingrese código..."
                  value={pluCode}
                  onChange={handlePluChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <select 
                  className="w-full border p-2 rounded-lg"
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {products.filter(p => parseInt(p.stock) > 0).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.model} (${p.price})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full border p-2 rounded-lg"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={!selectedProduct}
              >
                Registrar Venta
              </button>
            </form>
          </div>
        </div>

        {/* Historial de Ventas */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <History size={20} /> Historial de Ventas
              </h3>
              <div className="text-sm text-gray-500">
                Total Ventas: <span className="font-bold text-green-600">${sales.reduce((acc, s) => acc + s.total, 0)}</span>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 font-medium text-gray-500">Fecha</th>
                    <th className="p-3 font-medium text-gray-500">Producto</th>
                    <th className="p-3 font-medium text-gray-500">Cant.</th>
                    <th className="p-3 font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">Cargando historial...</td>
                    </tr>
                  ) : sales.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-400">No hay ventas registradas</td>
                    </tr>
                  ) : (
                    sales.map(s => (
                      <tr key={s.id} className="border-t border-gray-100">
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="p-3 font-medium">{s.productName}</td>
                        <td className="p-3">{s.quantity}</td>
                        <td className="p-3 font-bold text-green-600">${s.total}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        {/* Navbar */}
        <nav className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-black text-white p-2 rounded-lg">
                <Package size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">CaseFactory</h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Inventario
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'sales' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Ventas
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {activeTab === 'inventory' ? <InventoryView /> : <SalesView />}
        </main>
      </div>
    </StoreProvider>
  );
}

export default App;
