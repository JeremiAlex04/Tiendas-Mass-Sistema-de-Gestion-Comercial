package com.example.TiendaMas;

import com.example.TiendaMas.entity.Empleado;
import com.example.TiendaMas.entity.Sucursal;
import com.example.TiendaMas.entity.Categoria;
import com.example.TiendaMas.entity.Proveedor;
import com.example.TiendaMas.entity.Producto;
import com.example.TiendaMas.entity.Inventario;
import com.example.TiendaMas.repository.EmpleadoRepository;
import com.example.TiendaMas.repository.SucursalRepository;
import com.example.TiendaMas.repository.CategoriaRepository;
import com.example.TiendaMas.repository.ProveedorRepository;
import com.example.TiendaMas.repository.ProductoRepository;
import com.example.TiendaMas.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private InventarioRepository inventarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Fix existing null states
        try {
            empleadoRepository.updateNullEstados();
        } catch (Exception e) {
            // Ignore
        }

        // Create Default Sucursal
        Sucursal sucursal = sucursalRepository.findById(1L).orElse(null);
        if (sucursal == null) {
            sucursal = new Sucursal();
            sucursal.setNombre("Sucursal Central");
            sucursal.setDireccion("Av. Principal 123");
            sucursal.setResponsable("Gerente General");
            sucursal = sucursalRepository.save(sucursal);
        }

        // Create Employees
        createEmployeeIfMissing("admin", "ADMINISTRADOR", "Administrador", "Sistema", "admin@tiendamass.com", sucursal);
        createEmployeeIfMissing("cajero", "CAJERO", "Cajero", "Principal", "cajero@tiendamass.com", sucursal);
        createEmployeeIfMissing("almacen", "ALMACENERO", "Almacenero", "Principal", "almacen@tiendamass.com", sucursal);

        // Seed Realistic Data if Products are empty
        if (productoRepository.count() == 0) {
            System.out.println("Iniciando carga masiva de datos realistas...");
            seedRealisticData();
            System.out.println("Carga de datos completada.");
        }

        // Seed Initial Stock (if missing)
        seedInitialStock(sucursal);
    }

    private void createEmployeeIfMissing(String username, String role, String name, String lastname, String email,
            Sucursal sucursal) {
        if (empleadoRepository.findByUsuario(username).isEmpty()) {
            Empleado emp = new Empleado();
            emp.setSucursal(sucursal);
            emp.setRol(role);
            emp.setUsuario(username);
            emp.setPassword(passwordEncoder.encode(username + "123"));
            emp.setFechaIngreso(LocalDate.now());
            emp.setEstado("ACTIVO");
            emp.setNombres(name);
            emp.setApellidos(lastname);
            emp.setEmail(email);
            empleadoRepository.save(emp);
            System.out.println("Empleado creado: " + username);
        }
    }

    private void seedInitialStock(Sucursal sucursal) {
        List<Producto> productos = productoRepository.findAll();
        int stockCount = 0;
        for (Producto p : productos) {
            if (inventarioRepository.findByProductoAndSucursal(p, sucursal).isEmpty()) {
                Inventario inv = new Inventario();
                inv.setProducto(p);
                inv.setSucursal(sucursal);
                inv.setCantidad(50); // Initial stock of 50
                inv.setUbicacion("Almacén General");
                inventarioRepository.save(inv);
                stockCount++;
            }
        }
        if (stockCount > 0) {
            System.out.println("Stock inicial asignado para " + stockCount + " productos.");
        }
    }

    private void seedRealisticData() {
        // 1. Create Suppliers
        List<Proveedor> proveedores = new ArrayList<>();
        proveedores.add(createProveedor("Alicorp S.A.A.", "20100055237", "01-555-1234", "ventas@alicorp.com.pe"));
        proveedores.add(createProveedor("Gloria S.A.", "20100190797", "01-555-5678", "contacto@gloria.com.pe"));
        proveedores.add(createProveedor("Backus y Johnston", "20100113610", "01-555-9012", "ventas@backus.pe"));
        proveedores.add(createProveedor("Nestlé Perú S.A.", "20263322496", "01-555-3456", "servicio@nestle.pe"));
        proveedores.add(createProveedor("Procter & Gamble Perú", "20100127157", "01-555-7890", "contacto@pg.com"));
        proveedores.add(createProveedor("Kimberly-Clark Perú", "20100152941", "01-555-2345", "ventas@kcc.com"));
        proveedores.add(createProveedor("Coca-Cola Servicios", "20415932376", "01-555-6789", "contacto@coca-cola.com"));
        proveedores.add(createProveedor("San Fernando S.A.", "20100154308", "01-555-0123", "ventas@sanfernando.pe"));

        // 2. Create Categories and Products
        createCategoryWithProducts("Abarrotes", "Productos de primera necesidad", proveedores.get(0), Arrays.asList(
                new ProductData("7750243002220", "Aceite Primor Premium 1L", "Aceite vegetal puro", 12.50, 9.80),
                new ProductData("7750243026884", "Fideos Don Vittorio 500g", "Spaghetti", 4.20, 3.10),
                new ProductData("7750243058885", "Salsa Roja Don Vittorio 200g", "Salsa de tomate lista", 3.50, 2.40),
                new ProductData("7750243015560", "Harina Blanca Flor 1Kg", "Harina preparada", 7.80, 5.90),
                new ProductData("7750243034995", "Atún Primor Filete 170g", "Filete de atún en aceite", 6.50, 4.80)));

        createCategoryWithProducts("Lácteos", "Leches, yogures y derivados", proveedores.get(1), Arrays.asList(
                new ProductData("7750036000109", "Leche Evaporada Gloria 400g", "Leche entera etiqueta azul", 4.00,
                        3.15),
                new ProductData("7750036002660", "Yogurt Gloria Fresa 1L", "Yogurt bebible frutado", 6.90, 4.90),
                new ProductData("7750036001550", "Mantequilla Gloria 200g", "Mantequilla con sal", 8.50, 6.20),
                new ProductData("7750036004990", "Queso Edam Gloria 250g", "Queso en láminas", 14.50, 10.50),
                new ProductData("7750036003220", "Leche Condensada Gloria 390g", "Leche condensada azucarada", 5.50,
                        4.10)));

        createCategoryWithProducts("Bebidas", "Gaseosas, aguas y rehidratantes", proveedores.get(6), Arrays.asList(
                new ProductData("7750241001100", "Coca Cola 3L", "Gaseosa sabor original", 11.50, 8.50),
                new ProductData("7750241002200", "Inca Kola 3L", "La bebida del Perú", 11.50, 8.50),
                new ProductData("7750241003300", "Agua San Luis 2.5L", "Agua sin gas", 4.50, 2.90),
                new ProductData("7750241004400", "Powerade 500ml", "Bebida rehidratante", 2.50, 1.80),
                new ProductData("7750241005500", "Fanta Naranja 500ml", "Gaseosa sabor naranja", 2.20, 1.50)));

        createCategoryWithProducts("Limpieza", "Detergentes, jabones y lejías", proveedores.get(4), Arrays.asList(
                new ProductData("7500435136880", "Detergente Ariel 1Kg", "Detergente en polvo", 14.00, 10.50),
                new ProductData("7500435123440", "Ayudín Líquido Limón 900ml", "Lavavajillas líquido", 9.50, 6.80),
                new ProductData("7500435155660", "Suavizante Downy 800ml", "Suavizante concentrado", 12.00, 8.90),
                new ProductData("7750186001220", "Lejía Clorox 1L", "Desinfectante tradicional", 4.00, 2.80),
                new ProductData("7750186004330", "Limpiatodo Poett 1.8L", "Limpiador perfumado", 8.50, 6.10)));

        createCategoryWithProducts("Cuidado Personal", "Shampoo, jabones, higiene", proveedores.get(5), Arrays.asList(
                new ProductData("7750075001230", "Papel Hig. Suave 4 Rollos", "Doble hoja", 3.50, 2.20),
                new ProductData("7750075004560", "Pañales Huggies G x50", "Pañales para bebé", 45.00, 32.00),
                new ProductData("7702018956220", "Shampoo Head & Shoulders 375ml", "Control caspa", 18.50, 13.90),
                new ProductData("7750621004410", "Jabón Protex Avena x3", "Jabón antibacterial", 7.00, 4.80),
                new ProductData("7501031111990", "Pasta Dental Colgate Total 12", "Crema dental 150ml", 8.90, 6.20)));

        createCategoryWithProducts("Embutidos", "Jamonadas, hotdogs y congelados", proveedores.get(7), Arrays.asList(
                new ProductData("7750123001110", "Hot Dog Pollo San Fernando 1Kg", "Salchicha de pollo", 14.00, 10.20),
                new ProductData("7750123002220", "Jamonada de Pollo 250g", "Jamonada loncheada", 5.50, 3.80),
                new ProductData("7750123003330", "Nuggets de Pollo x20", "Nuggets congelados", 12.50, 9.00),
                new ProductData("7750123004440", "Chorizo Parrillero x4", "Chorizo precocido", 11.00, 8.10),
                new ProductData("7750123005550", "Paté de Hígado 100g", "Paté suave", 3.00, 1.90)));

        createCategoryWithProducts("Golosinas", "Chocolates, galletas y dulces", proveedores.get(3), Arrays.asList(
                new ProductData("7613035384440", "Chocolate Sublime 30g", "Chocolate con maní", 1.50, 0.90),
                new ProductData("7613035391110", "Galletas Morochas x6", "Galletas bañadas", 3.50, 2.40),
                new ProductData("7750243011220", "Galletas Casino Menta x6", "Galletas rellenas", 3.00, 2.10),
                new ProductData("7613034005550", "Lentejas 30g", "Grageas de chocolate", 1.50, 0.85),
                new ProductData("7613038006660", "Helado Sin Parar", "Helado chocolate", 6.50, 4.20)));

        createCategoryWithProducts("Licores", "Cervezas, vinos y licores", proveedores.get(2), Arrays.asList(
                new ProductData("7750011001234", "Cerveza Cristal 650ml", "Cerveza rubia", 6.50, 4.80),
                new ProductData("7750011005678", "Cerveza Pilsen 650ml", "Cerveza rubia", 7.00, 5.10),
                new ProductData("7750011009012", "Cerveza Cusqueña Trigo", "Cerveza de trigo", 7.50, 5.40),
                new ProductData("7751234008880", "Vino Tabernero Borgoña 750ml", "Vino semi seco", 22.00, 15.50),
                new ProductData("7750058004440", "Pisco Portón Mosto Verde", "Pisco 750ml", 85.00, 62.00)));
    }

    private Proveedor createProveedor(String razonSocial, String ruc, String telefono, String email) {
        return proveedorRepository.findByRuc(ruc).orElseGet(() -> {
            Proveedor p = new Proveedor();
            p.setRazonSocial(razonSocial);
            p.setRuc(ruc);
            p.setTelefono(telefono);
            p.setEmail(email);
            return proveedorRepository.save(p);
        });
    }

    private void createCategoryWithProducts(String catName, String desc, Proveedor defaultProv,
            List<ProductData> products) {
        // Create or get Category
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getNombre().equals(catName))
                .findFirst()
                .orElseGet(() -> {
                    Categoria c = new Categoria();
                    c.setNombre(catName);
                    c.setDescripcion(desc);
                    return categoriaRepository.save(c);
                });

        // Create Products
        for (ProductData pd : products) {
            if (productoRepository.findByCodigoBarras(pd.codigo).isEmpty()) {
                Producto p = new Producto();
                p.setCodigoBarras(pd.codigo);
                p.setNombre(pd.nombre);
                p.setDescripcion(pd.desc);
                p.setPrecioVenta(BigDecimal.valueOf(pd.precioVenta));
                p.setPrecioCompra(BigDecimal.valueOf(pd.precioCompra));
                p.setStockMinimo(10);
                p.setEstado("ACTIVO");
                p.setCategoria(cat);
                p.setProveedor(defaultProv);
                p.setSku(pd.codigo);
                p.setPrecioCosto(BigDecimal.valueOf(pd.precioCompra));
                productoRepository.save(p);
            }
        }
        System.out.println("Categoría cargada: " + catName);
    }

    private static class ProductData {
        String codigo;
        String nombre;
        String desc;
        double precioVenta;
        double precioCompra;

        public ProductData(String c, String n, String d, double pv, double pc) {
            this.codigo = c;
            this.nombre = n;
            this.desc = d;
            this.precioVenta = pv;
            this.precioCompra = pc;
        }
    }
}
