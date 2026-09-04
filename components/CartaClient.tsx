"use client";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';

const CATEGORIES = [
  "Todos", 
  "Pollos a la Leña", 
  "Pechugas", 
  "Ensaladas", 
  "Parrillas", 
  "Anticuchos", 
  "Carnes", 
  "Piqueos", 
  "Alitas", 
  "Criollos", 
  "Pastas", 
  "Bebidas"
];
const PRODUCTS = [
  { id: 101, name: "1 Pollo a la Leña", desc: "+ papas crocantes + ensalada clásica", price: 64.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 102, name: "1 Pollo + Bebida 1 Lt.", desc: "Limonada, Maracuyá, Durazno o Naranjada + papas crocantes + ensalada", price: 74.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 103, name: "1 Pollo + Gaseosa 1.5 Lt.", desc: "+ papas crocantes + ensalada clásica", price: 74.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 104, name: "1/2 Pollo", desc: "+ papas crocantes + ensalada clásica", price: 39.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 105, name: "1/4 Pollo", desc: "+ papas crocantes + ensalada clásica", price: 20.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 106, name: "1/4 Pollo + Refresco", desc: "Limonada, Maracuyá, Durazno o Naranjada + papas crocantes + ensalada", price: 25.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 107, name: "1/4 Pollo + Anticucho de Res", desc: "+ papas crocantes + ensalada clásica", price: 26.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 108, name: "Pollichaufa", desc: "1/4 Pollo + papas + ensalada + arroz chaufa", price: 25.00, category: "Pollos a la Leña", image: "/carta menu/pollo.webp" },
  { id: 201, name: "Pechuga Light", desc: "Jugosa pechuga a la plancha.", price: 26.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 202, name: "Pechuga al Orégano", desc: "Con un toque especial de orégano.", price: 25.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 203, name: "Pechuga al Limón", desc: "Con un sutil toque cítrico.", price: 25.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 204, name: "Pechuga Dais", desc: "Tocino, jamón, queso y champiñones.", price: 26.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 205, name: "Filete de Pierna a la Parrilla", desc: "Puro sabor a brasas.", price: 22.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 206, name: "Filete de Pierna al Orégano", desc: "Sazonado en su punto.", price: 22.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 207, name: "Filete de Pierna al Limón", desc: "Jugoso y con toque cítrico.", price: 22.00, category: "Pechugas", image: "/carta menu/pechugas.webp" },
  { id: 208, name: "Ensalada Dais", desc: "Lechuga + Palta + Tomate + Queso + Choclo.", price: 20.00, category: "Ensaladas", image: "/carta menu/ensaladas.webp" },
  { id: 209, name: "Ensalada Parrillera", desc: "Lechuga orgánica + Tomate + Pechuga a la Plancha + Cebolla + Champiñones.", price: 20.00, category: "Ensaladas", image: "/carta menu/ensaladas.webp" },
  { id: 210, name: "Ensalada de Palta", desc: "Clásica y fresca.", price: 14.00, category: "Ensaladas", image: "/carta menu/ensaladas.webp" },
  { id: 211, name: "Ensalada Cocida", desc: "Brocoli + Zanahoria + Beterraga + Cholo.", price: 14.00, category: "Ensaladas", image: "/carta menu/ensaladas.webp" },
  { id: 301, name: "Parrilla Personal", desc: "1/4 de pollo + 2 chorizos + chuleta de cerdo + papas + ensalada.", price: 50.00, category: "Parrillas", image: "/carta menu/parrillas.webp" },
  { id: 302, name: "Parrilla Leños", desc: "Baby Bife + Anticuchos + Chorizos + Mollejas + 1/4 Pollo + papas + ensalada.", price: 75.00, category: "Parrillas", image: "/carta menu/parrillas.webp" },
  { id: 303, name: "Parrilla Familiar", desc: "Lomo + Pechuga + 1/2 Pollo + Chorizos + Cerdo + Anticuchos + Gaseosa + papas + ens.", price: 100.00, category: "Parrillas", image: "/carta menu/parrillas.webp" },
  { id: 304, name: "Anticucho de Res (3 und.)", desc: "Clásicos anticuchos peruanos.", price: 24.00, category: "Anticuchos", image: "/carta menu/anticuchos.webp" },
  { id: 305, name: "Brocheta de Pollo (2 und.)", desc: "Con los mejores cortes.", price: 24.00, category: "Anticuchos", image: "/carta menu/anticuchos.webp" },
  { id: 306, name: "Anticucho de Mollejas", desc: "Sabor de antaño.", price: 18.00, category: "Anticuchos", image: "/carta menu/anticuchos.webp" },
  { id: 307, name: "Chorizo (2 und.)", desc: "A la parrilla.", price: 17.00, category: "Anticuchos", image: "/carta menu/anticuchos.webp" },
  { id: 308, name: "Chorizo Artesanal", desc: "Selección de la casa.", price: 18.00, category: "Anticuchos", image: "/carta menu/anticuchos.webp" },
  { id: 401, name: "Lomo Fino 250gr", desc: "Corte premium a la parrilla.", price: 35.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 402, name: "Baby Bife 250gr", desc: "Corte jugoso y tierno.", price: 35.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 403, name: "Churrasco", desc: "El clásico de siempre.", price: 22.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 404, name: "Chuleta de Cerdo", desc: "Parrillera y deliciosa.", price: 22.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 405, name: "Churrasco a lo pobre c/ chaufa", desc: "Una combinación contundente.", price: 29.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 406, name: "Lomo Fino Saltado", desc: "Con el jugo exacto.", price: 36.00, category: "Carnes", image: "/carta menu/carnes.webp" },
  { id: 407, name: "Piqueos de la Casa", desc: "2 Brochetas + 2 Anticuchos + Chicharrón Pollo + Yuquitas.", price: 40.00, category: "Piqueos", image: "/carta menu/piqueos.webp" },
  { id: 408, name: "Yuquitas Fritas", desc: "Doradas y crujientes.", price: 15.00, category: "Piqueos", image: "/carta menu/piqueos.webp" },
  { id: 409, name: "Tequeños Rellenos", desc: "Con salsa Huacamole.", price: 15.00, category: "Piqueos", image: "/carta menu/piqueos.webp" },
  { id: 501, name: "Alitas BBQ (6 und.)", desc: "Incluye papas fritas y cremas.", price: 17.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 502, name: "Alitas BBQ (12 und.)", desc: "Incluye papas fritas y cremas.", price: 33.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 503, name: "Alitas Acevichadas (6 und.)", desc: "Incluye papas fritas y cremas.", price: 17.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 504, name: "Alitas Acevichadas (12 und.)", desc: "Incluye papas fritas y cremas.", price: 33.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 505, name: "Alitas Picantes (6 und.)", desc: "Incluye papas fritas y cremas.", price: 17.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 506, name: "Alitas Picantes (12 und.)", desc: "Incluye papas fritas y cremas.", price: 33.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 507, name: "Alitas Broasters (6 und.)", desc: "Incluye papas fritas y cremas.", price: 17.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 508, name: "Alitas Broasters (12 und.)", desc: "Incluye papas fritas y cremas.", price: 33.00, category: "Alitas", image: "/carta menu/alitas.webp" },
  { id: 601, name: "Lomo Saltado", desc: "Clásico plato peruano.", price: 24.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 602, name: "Saltado de Pollo", desc: "Pechuga flameada con verduras.", price: 24.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 603, name: "Lomo Saltado a lo Pobre", desc: "Con huevo, plátano y papas.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 604, name: "Tallarín Saltado de Pollo o Carne", desc: "Sabor oriental-peruano.", price: 24.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 605, name: "Bistec a lo Pobre", desc: "Contundente y delicioso.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 606, name: "Bistec Apanado", desc: "Crocante por fuera, suave por dentro.", price: 25.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 607, name: "Bistec Apanado a lo Pobre", desc: "La mejor combinación.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 608, name: "Bistec", desc: "Con arroz y papas.", price: 25.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 609, name: "Bistec a la Chorrillana", desc: "Con encebollado de la casa.", price: 25.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 610, name: "Milanesa de Pollo", desc: "Doradita con sus guarniciones.", price: 25.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 611, name: "Milanesa a lo Pobre", desc: "Con todas las creces.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 612, name: "Pechuga a lo Pobre", desc: "Proteína y mucho sabor.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 613, name: "Pechuga con Champiñones", desc: "Salsa cremosa de champiñones.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 614, name: "Chicharrón de Pollo", desc: "Trozos crocantes y dorados.", price: 22.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 615, name: "Tortilla de Verduras (Arroz)", desc: "Saludable y ligera.", price: 20.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 616, name: "Arroz Chaufa (Pollo - Carne)", desc: "Sabor a chifa.", price: 21.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 617, name: "Arroz Chaufa Mixto", desc: "Pollo y carne juntos.", price: 27.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 618, name: "Tacu Tacu c/ bistec a lo pobre", desc: "Mezcla perfecta criolla.", price: 29.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 619, name: "Tacu Tacu c/ lomo saltado", desc: "Jugo y crocancia en uno solo.", price: 28.00, category: "Criollos", image: "/carta menu/criollos.webp" },
  { id: 701, name: "Tallarín Alfredo con Pechuga", desc: "Salsa blanca y cremosa.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 702, name: "Tallarín Alfredo con Bistec", desc: "Clásica pasta con carne.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 703, name: "Tallarín Alfredo con 2 Anticuchos", desc: "Fusión espectacular.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 704, name: "Tallarín al Pesto con Bistec", desc: "Pesto de albahaca fresca.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 705, name: "Tallarín al Pesto con Pechuga", desc: "Ligero y lleno de sabor.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 706, name: "Tallarín al Pesto con 2 Anticuchos", desc: "Nuestra recomendación verde.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 707, name: "Tallarín a la Huancaina con Lomito", desc: "Pasta amarilla y jugoso lomo.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 708, name: "Tallarín a la Huancaina con Pechuga", desc: "Crema de ají amarillo.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 709, name: "Tallarín a la Huancaina con 2 Antic.", desc: "Puro sabor nacional.", price: 26.00, category: "Pastas", image: "/carta menu/pastas.webp" },
  { id: 801, name: "Limonada", desc: "Fresca y natural.", price: 13.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 802, name: "Limonada Frozen", desc: "Heladita.", price: 15.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 803, name: "Maracuya", desc: "Jugo natural.", price: 14.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 804, name: "Maracuya Frozen", desc: "Frappe de maracuya.", price: 15.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 805, name: "Naranjada", desc: "Naranjas exprimidas.", price: 14.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 806, name: "Naranjada Frozen", desc: "Bien helada.", price: 16.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 807, name: "Durazno", desc: "Jugo de durazno.", price: 16.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 808, name: "Durazno Frozen", desc: "Frappe frutal.", price: 18.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 809, name: "Infusiones", desc: "Té, anís, manzanilla.", price: 3.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 810, name: "Gaseosa de 1.5 lt.", desc: "Para compartir.", price: 12.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 811, name: "Gaseosa 1/2 lt.", desc: "Personal.", price: 4.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
  { id: 812, name: "Agua mineral", desc: "Sin o con gas.", price: 3.00, category: "Bebidas", image: "/carta menu/bebidas.webp" },
];

export default function CartaClient() {
  const addToCart = useCartStore(state => state.addToCart);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(9);

  const filteredProducts = PRODUCTS.filter(p => {
    return activeCategory === "Todos" || p.category === activeCategory;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="bg-pattern pb-0">
      <div 
        className="pt-28 pb-16 px-4 text-center shadow-sm relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/cartaportada.webp')" }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
        
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-xl relative z-10">
          Nuestra Carta
        </h1>
        <p className="text-dais-cream font-bold mt-2 text-base md:text-lg relative z-10 drop-shadow-md">
          Elige tus favoritos y nosotros nos encargamos del resto
        </p>

        <div className="absolute bottom-0 left-0 w-full leading-none z-20">
          <svg className="relative block w-full h-[30px] md:h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,120 C600,0 1200,120 1200,120 Z" fill="#F8F9FA" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 mb-14 flex flex-col md:flex-row gap-8 relative z-10">
        <div className="md:w-1/4 relative z-30">
          <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 sticky top-28 border border-gray-100 md:max-h-[calc(100vh-120px)] md:overflow-y-auto">
            <div 
              className="flex justify-between items-center md:hidden cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <h3 className="font-black text-lg uppercase text-dais-dark">Menú: <span className="text-dais-red">{activeCategory}</span></h3>
              <span className="text-dais-red font-black text-2xl leading-none">{isMenuOpen ? '-' : '+'}</span>
            </div>

            {/* Backdrop para cerrar el menú al tocar fuera (solo móvil) */}
            {isMenuOpen && (
              <div 
                className="fixed inset-0 z-30 md:hidden"
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
              />
            )}

            <h3 className="hidden md:block font-black text-xl uppercase text-dais-dark mb-4 border-b border-gray-100 pb-4">Menú</h3>
            <ul className={`
              ${isMenuOpen ? 'absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 block max-h-[60vh] overflow-y-auto' : 'hidden'} 
              md:relative md:block md:bg-transparent md:shadow-none md:border-none md:p-0 md:mt-0 md:max-h-none space-y-2 z-40
            `}>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <button 
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsMenuOpen(false);
                      setVisibleCount(9);
                    }}
                    className={`w-full text-left px-5 py-3.5 rounded-xl font-bold uppercase text-sm transition-all ${
                      activeCategory === cat 
                      ? 'bg-dais-red text-white shadow-md' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-dais-dark'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:w-3/4">
          <div className="pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group relative cursor-pointer"
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
              >
                <div className="h-44 bg-gray-100 relative overflow-hidden rounded-t-3xl">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform transform-gpu"
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-1 relative bg-white">
                  <h3 className="font-black text-lg text-dais-dark uppercase leading-tight mb-2 group-hover:text-dais-red transition-colors">{product.name}</h3>
                  <p className="text-gray-500 text-xs font-medium uppercase leading-relaxed flex-1 mb-5">{product.desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span className="font-black text-xl text-dais-red">S/ {product.price.toFixed(2)}</span>
                    <button type="button" className="bg-dais-dark hover:bg-black text-white w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-lg">
                      <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            
            {/* Botón Ver Más */}
            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-10">
                <button 
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="bg-dais-dark hover:bg-black text-white font-black uppercase tracking-widest py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md"
                >
                  Cargar más productos
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Aún no hay platos aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
