import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos desde Supabase al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cargar productos
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Cargar ventas
        const { data: salesData, error: salesError } = await supabase
          .from('sales')
          .select('*')
          .order('date', { ascending: false });

        if (salesError) throw salesError;
        setSales(salesData || []);

      } catch (error) {
        console.error('Error cargando datos:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;

      if (data) {
        setProducts([data[0], ...products]);
      }
    } catch (error) {
      console.error('Error agregando producto:', error.message);
      alert('Error al agregar producto: ' + error.message);
    }
  };

  const editProduct = async (id, updatedProduct) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id);

      if (error) throw error;

      setProducts(products.map(p => (p.id === id ? { ...p, ...updatedProduct } : p)));
    } catch (error) {
      console.error('Error actualizando producto:', error.message);
      alert('Error al actualizar: ' + error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error eliminando producto:', error.message);
      alert('Error al eliminar: ' + error.message);
    }
  };

  const addSale = async (saleItem) => {
    // saleItem: { productId, quantity, price, date }
    const product = products.find(p => p.id === saleItem.productId);
    if (!product) return;

    try {
      // 1. Calcular nuevo stock
      const newStock = parseInt(product.stock) - parseInt(saleItem.quantity);
      if (newStock < 0) {
        alert('No hay suficiente stock');
        return;
      }

      // 2. Registrar la venta
      const saleData = {
        product_id: saleItem.productId,
        product_name: product.name,
        quantity: parseInt(saleItem.quantity),
        total: saleItem.quantity * saleItem.price,
        date: new Date().toISOString() // O usar la fecha provista si viene en saleItem
      };

      const { data: newSaleData, error: saleError } = await supabase
        .from('sales')
        .insert([saleData])
        .select();

      if (saleError) throw saleError;

      // 3. Actualizar el stock del producto
      const { error: productError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', saleItem.productId);

      if (productError) throw productError;

      // 4. Actualizar estado local
      setSales([newSaleData[0], ...sales]);
      setProducts(products.map(p => 
        p.id === saleItem.productId ? { ...p, stock: newStock } : p
      ));

    } catch (error) {
      console.error('Error procesando venta:', error.message);
      alert('Error al procesar la venta: ' + error.message);
    }
  };

  return (
    <StoreContext.Provider value={{ products, sales, loading, addProduct, editProduct, addSale, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};
