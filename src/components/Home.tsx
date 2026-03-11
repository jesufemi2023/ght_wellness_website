import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Award, 
  Users, 
  ChevronRight,
  ChevronLeft,
  Activity,
  Heart,
  Zap,
  Coffee,
  ShoppingBag,
  Stethoscope,
  MessageSquare,
  ClipboardList,
  Sparkles,
  Globe,
  Truck
} from 'lucide-react';
import { Product, PackageData, BlogPost } from '../types';
import { ProductCard } from './ProductCard';
import { PackageCard } from './PackageCard';
import { ComboCard } from './ComboCard';

// Hero images are served from the public folder
const HERO_IMAGES = [
  '/hero1.jpg',
  '/hero2.jpg',
  '/hero3.jpg',
  '/hero4.jpg',
  '/hero5.jpg',
  '/hero6.jpg',
  '/hero7.jpg',
  '/hero8.jpg'
];

// Sub-component for individual slides to handle loading and animation
const HeroSlide = ({ src, isActive, index }: { src: string; isActive: boolean; index: number }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1.1 : 1,
      }}
      transition={{ 
        opacity: { duration: 1.5, ease: "easeInOut" },
        scale: { duration: 10, ease: "linear" } // Ken Burns effect
      }}
    >
      <img
        src={src}
        alt={`GHT Wellness Hero ${index + 1}`}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        loading={index === 0 ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        </div>
      )}
      {/* Gradient Overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
    </motion.div>
  );
};

interface HomeProps {
  products: Product[];
  comboPackages: PackageData[];
  recommendedPackages?: PackageData[];
  onNavigate: (tab: string) => void;
  onOrderProduct: (product: Product) => void;
  onOrderPackage: (pkg: PackageData) => void;
  onOrderComboItem?: (item: any, type: 'package' | 'product', qty: number) => void;
  onViewProduct: (product: Product) => void;
  onSelectBlog: (id: string) => void;
  onOpenChat: () => void;
}

export function Home({ 
  products, 
  comboPackages, 
  recommendedPackages = [],
  onNavigate, 
  onOrderProduct, 
  onOrderPackage, 
  onOrderComboItem,
  onViewProduct,
  onSelectBlog,
  onOpenChat
}: HomeProps) {
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const recScrollRef = useRef<HTMLDivElement>(null);
  const comboScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          setRecentBlogs(data.slice(0, 3));
        }
      } catch (e) {
        console.error("Failed to fetch blogs", e);
      }
    };
    fetchBlogs();
  }, []);

  // Auto-scroll for Recommended Packages
  useEffect(() => {
    if (recommendedPackages.length <= 1) return;
    const timer = setInterval(() => {
      if (recScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = recScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          recScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          recScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [recommendedPackages.length]);

  // Auto-scroll for Combo Packages
  useEffect(() => {
    if (comboPackages.length <= 1) return;
    const timer = setInterval(() => {
      if (comboScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = comboScrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          comboScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          comboScrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [comboPackages.length]);

  const scrollPrev = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollNext = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  // Get top 4 products for bestsellers
  const bestSellers = products.slice(0, 4);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Preload next image in sequence
  useEffect(() => {
    const nextIndex = (currentHeroIndex + 1) % HERO_IMAGES.length;
    const img = new Image();
    img.src = HERO_IMAGES[nextIndex];
  }, [currentHeroIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      
      {/* 1. Hero Section - Full Screen Display */}
      <section className="relative h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full overflow-hidden bg-slate-950 group">
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, index) => (
            <HeroSlide 
              key={src} 
              src={src} 
              isActive={index === currentHeroIndex} 
              index={index} 
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 z-30 flex gap-1 px-4 py-2">
          {HERO_IMAGES.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
              {index === currentHeroIndex && (
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  key={currentHeroIndex}
                />
              )}
              {index < currentHeroIndex && <div className="h-full w-full bg-emerald-500/40" />}
            </div>
          ))}
        </div>

        <div className="relative z-10 h-full flex flex-col items-center md:items-end justify-center md:justify-end p-6 md:p-16 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pointer-events-auto text-center md:text-right max-w-2xl"
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
              Your Journey to <br />
              <span className="text-emerald-400">Optimal Health</span>
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 font-medium drop-shadow-lg hidden md:block">
              Discover the power of nature combined with modern science. <br />
              Premium herbal solutions for a vibrant life.
            </p>
            <button 
              onClick={() => onNavigate('products')}
              className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-emerald-500 transition-all duration-300 shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto md:mr-0"
            >
              Start Shopping <ShoppingBag size={24} />
            </button>
          </motion.div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-20">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentHeroIndex ? "bg-emerald-400 w-12" : "bg-white/30 w-6 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Carousel Controls */}
        <div className="hidden md:block">
          <button 
            onClick={() => setCurrentHeroIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900 z-20"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length)}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-slate-900 z-20"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </section>

      {/* 2. Authority Bar */}
      <section className="bg-white py-8 md:py-12 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Globe, title: "Free Delivery", desc: "Across all parts of Nigeria", highlight: true },
              { icon: Truck, title: "Worldwide Shipping", desc: "We deliver to any country", highlight: true },
              { icon: Leaf, title: "100% Organic", desc: "Pure herbal ingredients" },
              { icon: Award, title: "Expert Formulated", desc: "Backed by science" }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${item.highlight ? 'bg-emerald-600 text-white shadow-lg scale-105' : 'bg-emerald-50 text-emerald-600'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.highlight ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                  <item.icon size={28} />
                </div>
                <div className="text-left">
                  <h4 className={`font-black text-base uppercase tracking-tight leading-none mb-1 ${item.highlight ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                  <p className={`text-[10px] font-bold ${item.highlight ? 'text-emerald-100' : 'text-slate-500'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Support Center - Differentiating AI vs Expert */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Smart Health Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-emerald-50 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between border-2 border-emerald-100 shadow-sm"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <MessageSquare size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Instant Health Chat</h3>
                <p className="text-emerald-700 font-bold text-sm uppercase tracking-widest">Response: Immediate</p>
              </div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Best for quick questions about herbs, symptoms, or general health advice. Get answers in seconds from our Virtual Guide.
              </p>
            </div>
            <button 
              onClick={onOpenChat}
              className="mt-10 w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-200"
            >
              Chat with Virtual Guide <Sparkles size={20} />
            </button>
          </motion.div>

          {/* Expert Consultation Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-slate-50 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between border-2 border-slate-200 shadow-sm"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <ClipboardList size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Expert Assessment</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">Response: Professional Review</p>
              </div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Best for chronic conditions, detailed history, and getting a personalized herbal routine reviewed by experts.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('consultation')}
              className="mt-10 w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
            >
              Start Health Assessment <Stethoscope size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 4. Individual Products */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Trending Now</h2>
            <div className="h-2 w-24 bg-emerald-500 rounded-full"></div>
          </div>
          <button onClick={() => onNavigate('products')} className="hidden md:flex text-emerald-600 font-black text-lg items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest">
            View All <ArrowRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onQuickView={onViewProduct}
              onOrder={() => onOrderProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* 4. Expert Recommended Packages */}
      {recommendedPackages.length > 0 && (
        <section className="bg-slate-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Health Solutions</h2>
                <p className="text-xl text-slate-500 font-bold">Curated packages for specific health needs.</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => scrollPrev(recScrollRef)}
                  className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button 
                  onClick={() => scrollNext(recScrollRef)}
                  className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </div>
            </div>
            <div 
              ref={recScrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar gap-8 pb-8"
            >
              {recommendedPackages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className="snap-start flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3333%-1.5rem)]"
                >
                  <PackageCard 
                    data={pkg} 
                    allPackages={recommendedPackages} 
                    onOrder={() => onOrderPackage(pkg)} 
                    onViewProduct={onViewProduct} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Combo Packs - Elderly Accessible Design */}
      {comboPackages.length > 0 && (
        <section className="bg-emerald-950 py-16 md:py-20 rounded-[3rem] mx-4 md:mx-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                Ultimate <span className="text-emerald-400">Combo Packs</span>
              </h2>
              <p className="text-2xl md:text-3xl text-emerald-100/80 max-w-4xl mx-auto font-bold leading-relaxed">
                Maximum value bundles designed for complete body restoration. Perfect for long-term wellness.
              </p>
              <div className="h-1.5 w-48 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
              {comboPackages.map(pkg => (
                <div key={pkg.id} className="w-full">
                  <ComboCard 
                    data={pkg} 
                    onOrder={onOrderComboItem || ((item) => onOrderPackage(item))} 
                    onProductClick={onViewProduct} 
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <button 
                onClick={() => onNavigate('combo')} 
                className="bg-emerald-500 text-white px-16 py-6 rounded-full font-black text-2xl hover:bg-emerald-400 transition-all shadow-3xl shadow-emerald-900/50 uppercase tracking-widest"
              >
                View All Master Kits
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 7. Ask Virtual Guide Teaser */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="bg-white rounded-[3rem] p-12 md:p-24 text-center border-4 border-emerald-100 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-300 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl text-white mb-8 rotate-3">
              <Sparkles size={48} />
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Instant <span className="text-emerald-600">Health Chat</span>
            </h2>
            <p className="text-2xl md:text-3xl text-slate-600 font-bold leading-relaxed">
              Have a quick question? Our Virtual Health Guide is available 24/7 for immediate guidance.
            </p>
            <div className="pt-6">
              <button 
                onClick={onOpenChat}
                className="bg-emerald-600 text-white px-16 py-6 rounded-full font-black text-2xl hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 uppercase tracking-widest flex items-center justify-center gap-4 mx-auto"
              >
                Chat with Virtual Guide <MessageSquare size={32} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Education & Lifestyle (Blog) */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Latest Health Insights</h2>
            <button onClick={() => onNavigate('blog')} className="text-emerald-600 font-bold flex items-center gap-1 hover:text-emerald-700 transition-colors">
              Read Journal <ChevronRight size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {recentBlogs.map((post) => (
              <div 
                key={post.id} 
                className="group cursor-pointer"
                onClick={() => onSelectBlog(post.id)}
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-4 relative">
                  <img 
                    src={post.image_url || 'https://picsum.photos/seed/health/600/400'} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                      {post.category}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 font-medium">
                  {post.meta_description || post.content.substring(0, 100).replace(/[#*`]/g, '') + '...'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
