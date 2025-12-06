-- Copia y pega esto en el 'SQL Editor' de tu proyecto en Supabase para crear las tablas

-- 1. Tabla de Productos
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    code TEXT,
    name TEXT NOT NULL,
    model TEXT,
    category TEXT DEFAULT 'Otros',
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0
);

-- 2. Tabla de Ventas
CREATE TABLE sales (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    product_id UUID REFERENCES products(id),
    product_name TEXT, -- Guardamos el nombre por si se borra el producto
    quantity INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar seguridad (opcional para empezar, pero recomendado)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Política simple: Permitir todo a todos (para empezar rápido, luego se puede restringir)
CREATE POLICY "Acceso total a productos" ON products FOR ALL USING (true);
CREATE POLICY "Acceso total a ventas" ON sales FOR ALL USING (true);
