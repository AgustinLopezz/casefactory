import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Swal from 'sweetalert2';

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
      // Generamos un UUID en el frontend para asegurar que el producto tenga ID
      const newProduct = {
        ...product,
        id: self.crypto.randomUUID(),
        price: parseFloat(product.price),
        stock: parseInt(product.stock)
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) throw error;

      if (data) {
        setProducts([data[0], ...products]);
        Swal.fire({
          title: '¡Producto Agregado!',
          text: 'El producto se ha guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      console.error('Error agregando producto:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo agregar el producto: ' + error.message,
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
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
      
      Swal.fire({
        title: '¡Actualizado!',
        text: 'El producto ha sido actualizado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error actualizando producto:', error.message);
      Swal.fire('Error', 'No se pudo actualizar: ' + error.message, 'error');
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== id));
      Swal.fire(
        '¡Eliminado!',
        'El producto ha sido eliminado.',
        'success'
      );
    } catch (error) {
      console.error('Error eliminando producto:', error.message);
      Swal.fire('Error', 'No se pudo eliminar: ' + error.message, 'error');
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
        Swal.fire('Stock Insuficiente', 'No hay suficientes unidades para esta venta.', 'warning');
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
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Venta registrada',
        showConfirmButton: false,
        timer: 1500
      });

    } catch (error) {
      console.error('Error procesando venta:', error.message);
      Swal.fire('Error', 'Error al procesar la venta: ' + error.message, 'error');
    }
  };

  return (
    <StoreContext.Provider value={{ products, sales, loading, addProduct, editProduct, addSale, deleteProduct }}>
      {children}
    </StoreContext.Provider>
  );
};
