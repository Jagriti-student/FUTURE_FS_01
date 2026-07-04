import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ChevronUp,
  Menu,
  X,
  Star,
  Quote,
  ArrowRight,
  MessageCircle,
  Utensils,
  Leaf,
  Award,
  Heart,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["Home", "About", "Menu", "Gallery", "Reviews", "Reservation", "Contact"];

const MENU_CATEGORIES = ["Starters", "Main Course", "Desserts", "Drinks"] as const;
type MenuCategory = (typeof MENU_CATEGORIES)[number];

const MENU_ITEMS: Record<MenuCategory, { name: string; desc: string; price: string; img: string }[]> = {
  Starters: [
    {
      name: "Crispy Paneer Bites",
      desc: "House-spiced cottage cheese, tamarind glaze, micro cilantro",
      price: "$12",
      img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Classic Bruschetta",
      desc: "Heirloom tomatoes, fresh basil, aged balsamic, grilled sourdough",
      price: "$10",
      img: "https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Garden Fresh Salad",
      desc: "Seasonal greens, candied walnuts, citrus vinaigrette, edible flowers",
      price: "$14",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=360&fit=crop&auto=format",
    },
  ],
  "Main Course": [
    {
      name: "Signature Pasta",
      desc: "Hand-rolled pappardelle, slow-braised short rib, truffle butter, Parmigiano",
      price: "$28",
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Royal Indian Curry",
      desc: "Chef's secret spice blend, saffron-infused sauce, aromatic basmati",
      price: "$26",
      img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Grilled Special Platter",
      desc: "Prime cuts, seasonal roasted vegetables, chimichurri, smoked butter",
      price: "$38",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=480&h=360&fit=crop&auto=format",
    },
  ],
  Desserts: [
    {
      name: "Chocolate Lava Cake",
      desc: "Valrhona dark chocolate, molten center, vanilla bean ice cream",
      price: "$12",
      img: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Premium Cheesecake",
      desc: "New York style, berry coulis, candied lemon zest, almond crust",
      price: "$11",
      img: "https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Seasonal Special",
      desc: "Chef's daily creation — ask your server for today's inspiration",
      price: "$14",
      img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=480&h=360&fit=crop&auto=format",
    },
  ],
  Drinks: [
    {
      name: "Signature Mocktails",
      desc: "House botanical blends — Ember Sunrise, Forest Dew, Spiced Pomegranate",
      price: "$9",
      img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Fresh Juices",
      desc: "Cold-pressed daily: carrot-ginger, green goddess, watermelon-mint",
      price: "$7",
      img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=480&h=360&fit=crop&auto=format",
    },
    {
      name: "Specialty Coffee",
      desc: "Single-origin beans, pour-over, espresso, or our house ember blend",
      price: "$6",
      img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=480&h=360&fit=crop&auto=format",
    },
  ],
};

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&auto=format",
    alt: "Elegant dining room with warm amber lighting",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65ce?w=500&h=400&fit=crop&auto=format",
    alt: "Artfully plated fine dining dish",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1550966871-3ed3cfd6fce3?w=500&h=400&fit=crop&auto=format",
    alt: "Chef preparing signature dishes in open kitchen",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format",
    alt: "Restaurant interior with candlelit tables",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&auto=format",
    alt: "Intimate dining experience with warm ambiance",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=500&fit=crop&auto=format",
    alt: "Beautifully presented gourmet plate",
    span: "col-span-2",
  },
];

const REVIEWS = [
  {
    name: "Sophia Laurent",
    role: "Food Critic",
    text: "Beautiful ambience, delicious food, and excellent service. The Ember Table has redefined what fine dining means in this city — every dish tells a story.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
  },
  {
    name: "Marcus Chen",
    role: "Regular Guest",
    text: "One of the best dining experiences I have ever had. Highly recommended. We celebrated our anniversary here and the staff made it truly unforgettable.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
  },
  {
    name: "Priya Mehta",
    role: "Event Planner",
    text: "Perfect place for family dinners and celebrations. I have organized three corporate events here — the food, service, and atmosphere are consistently spectacular.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
  },
];

const VALUES = [
  { icon: Leaf, title: "Farm-Fresh Ingredients", desc: "Sourced daily from local farms and trusted suppliers within a 50-mile radius." },
  { icon: Award, title: "Authentic Flavors", desc: "Recipes refined over decades, honoring culinary traditions from around the world." },
  { icon: Utensils, title: "Premium Experience", desc: "Every detail crafted — from the table settings to the final dessert course." },
  { icon: Heart, title: "Warm Atmosphere", desc: "A space where conversation flows, memories are made, and guests become family." },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const handler = () => setY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return y;
}

function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-primary mb-4">
      <span className="w-6 h-px bg-primary" />
      {children}
      <span className="w-6 h-px bg-primary" />
    </span>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────

function Nav() {
  const scrollY = useScrollY();
  const [open, setOpen] = useState(false);
  const solid = scrollY > 60;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: solid ? "rgba(13,11,8,0.97)" : "transparent",
        borderBottom: solid ? "1px solid rgba(193,127,62,0.18)" : "1px solid transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <button onClick={() => scrollTo("home")} className="flex flex-col leading-none text-left">
          <span className="font-serif text-xl text-foreground tracking-wide">The Ember Table</span>
          <span className="text-[10px] tracking-[0.22em] uppercase text-primary font-mono">Fine Dining & Café</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="text-sm tracking-wide text-foreground/70 hover:text-primary transition-colors duration-200 font-sans"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Reserve CTA */}
        <button
          onClick={() => scrollTo("reservation")}
          className="hidden md:block text-xs tracking-[0.15em] uppercase font-mono px-5 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          Reserve
        </button>

        {/* Mobile Hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? "380px" : "0px" }}
      >
        <div className="bg-card border-t border-border px-6 py-6 flex flex-col gap-5">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="text-left text-base text-foreground/80 hover:text-primary transition-colors font-sans"
            >
              {link}
            </button>
          ))}
          <button
            onClick={() => scrollTo("reservation")}
            className="mt-2 text-xs tracking-[0.15em] uppercase font-mono px-5 py-3 bg-primary text-primary-foreground"
          >
            Reserve a Table
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0805]">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=1000&fit=crop&auto=format"
          alt="The Ember Table — elegant dining room"
          className="w-full h-full object-cover"
          style={{ opacity: 0.45 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b08]/60 via-transparent to-[#0d0b08]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div
          className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-mono text-primary mb-8"
          style={{ animation: "fadeUp 1s ease 0.2s both" }}
        >
          <span className="w-8 h-px bg-primary" />
          Where Flavors Meet Memories
          <span className="w-8 h-px bg-primary" />
        </div>

        <h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground leading-[1.05] mb-6"
          style={{ animation: "fadeUp 1s ease 0.4s both" }}
        >
          Experience
          <br />
          <em className="italic text-primary">Exceptional</em>
          <br />
          Flavors
        </h1>

        <p
          className="text-foreground/70 text-lg md:text-xl font-sans font-light max-w-xl mx-auto mb-12 leading-relaxed"
          style={{ animation: "fadeUp 1s ease 0.6s both" }}
        >
          A perfect blend of traditional recipes and modern culinary experiences — crafted for moments worth remembering.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeUp 1s ease 0.8s both" }}
        >
          <button
            onClick={() => scrollTo("reservation")}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-sm tracking-[0.12em] uppercase font-mono hover:bg-accent transition-all duration-300 group"
          >
            Reserve a Table
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollTo("menu")}
            className="px-8 py-4 border border-foreground/40 text-foreground text-sm tracking-[0.12em] uppercase font-mono hover:border-primary hover:text-primary transition-all duration-300"
          >
            Explore Menu
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-foreground">Scroll</span>
        <div className="w-px h-12 bg-foreground/40" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
        }
      `}</style>
    </section>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="py-24 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images */}
          <FadeIn className="relative">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65ce?w=700&h=560&fit=crop&auto=format"
                alt="Artfully plated fine dining course at The Ember Table"
                className="w-full object-cover"
                style={{ height: 480 }}
              />
              <div className="absolute -bottom-8 -right-8 w-52 h-52 hidden md:block border border-border">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=300&fit=crop&auto=format"
                  alt="Head chef plating a signature dish"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating stat */}
              <div className="absolute top-6 -left-6 hidden md:block bg-card border border-border px-6 py-5">
                <div className="font-serif text-4xl text-primary">12+</div>
                <div className="text-xs tracking-[0.15em] uppercase font-mono text-muted-foreground mt-1">Years of Excellence</div>
              </div>
            </div>
          </FadeIn>

          {/* Text */}
          <FadeIn delay={0.2} className="lg:pl-8">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1] mb-6">
              A Table Built on
              <br />
              <em className="italic text-primary">Passion & Craft</em>
            </h2>
            <p className="text-foreground/65 font-sans font-light leading-relaxed mb-6">
              Founded in 2012 by Chef Aryan Mehta, The Ember Table was born from a simple conviction: that every meal deserves to be a memory. What began as a ten-table neighbourhood bistro has evolved into the city's most beloved fine dining destination.
            </p>
            <p className="text-foreground/65 font-sans font-light leading-relaxed mb-10">
              Our kitchen bridges the richness of classical Indian technique with the precision of modern European cuisine — a dialogue between heritage and innovation, served fresh every single evening.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {VALUES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 border border-border hover:border-primary/50 transition-colors duration-300 group">
                  <Icon size={20} className="text-primary mb-3" />
                  <div className="font-serif text-sm text-foreground mb-1">{title}</div>
                  <div className="text-xs text-muted-foreground font-sans leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

function MenuSection() {
  const [active, setActive] = useState<MenuCategory>("Starters");

  return (
    <section id="menu" className="py-24 lg:py-36 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Culinary Journey</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight">
            Our <em className="italic text-primary">Menu</em>
          </h2>
        </FadeIn>

        {/* Category Tabs */}
        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-2 mb-12">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-mono border transition-all duration-300 ${
                active === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {MENU_ITEMS[active].map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.1}>
              <div className="group border border-border hover:border-primary/60 transition-all duration-400 overflow-hidden bg-background">
                <div className="overflow-hidden h-52 bg-muted">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-lg text-foreground">{item.name}</h3>
                    <span className="font-mono text-primary text-sm font-medium ml-3 shrink-0">{item.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

function Gallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-24 lg:py-36 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Visual Story</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Inside the <em className="italic text-primary">Ember</em>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">
          {GALLERY_IMAGES.map((img, i) => (
            <FadeIn
              key={i}
              delay={i * 0.06}
              className={`group cursor-pointer overflow-hidden bg-muted relative ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onClick={() => setLightbox(img.src)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white/90 text-xs tracking-[0.15em] uppercase font-mono border border-white/60 px-3 py-1.5">
                  View
                </span>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="Gallery full view" className="max-w-full max-h-[90vh] object-contain" />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white"
            >
              <X size={28} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

function Reviews() {
  return (
    <section id="reviews" className="py-24 lg:py-36 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Guest Voices</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            What Our <em className="italic text-primary">Guests</em> Say
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <FadeIn key={r.name} delay={i * 0.12}>
              <div className="p-8 border border-border hover:border-primary/40 transition-colors duration-300 bg-background relative group">
                <Quote size={32} className="text-primary/25 mb-6" />
                <p className="text-foreground/75 font-sans font-light leading-relaxed text-base mb-8 italic">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-11 h-11 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="font-serif text-sm text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{r.role}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} size={12} className="fill-primary text-primary" />
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reservation ─────────────────────────────────────────────────────────────

function Reservation() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "", time: "", guests: "2", requests: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const fieldCls = "w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm font-sans px-4 py-3 focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="reservation" className="py-24 lg:py-36 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=1000&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <FadeIn>
          <SectionLabel>Secure Your Seat</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.1] mb-6">
            Reserve a
            <br />
            <em className="italic text-primary">Table Tonight</em>
          </h2>
          <p className="text-foreground/60 font-sans font-light leading-relaxed mb-10 max-w-sm">
            Whether it is an intimate dinner for two or a celebration with loved ones, we will create an experience worthy of the occasion.
          </p>
          <div className="space-y-4 text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <span>Mon–Fri: 12:00 PM – 11:00 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary shrink-0" />
              <span>Sat–Sun: 11:00 AM – 11:30 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-primary shrink-0" />
              <span>+1 (555) 824-3690</span>
            </div>
          </div>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.2}>
          {submitted ? (
            <div className="border border-primary/50 p-12 text-center bg-card">
              <div className="font-serif text-2xl text-primary mb-3">Reservation Confirmed</div>
              <p className="text-muted-foreground font-sans font-light text-sm">
                Thank you, {form.name}. We look forward to welcoming you. A confirmation will be sent to {form.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-border p-8 bg-card space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className={fieldCls} placeholder="Your Name *" value={form.name} onChange={set("name")} required />
                <input className={fieldCls} placeholder="Phone Number *" type="tel" value={form.phone} onChange={set("phone")} required />
              </div>
              <input className={fieldCls} placeholder="Email Address *" type="email" value={form.email} onChange={set("email")} required />
              <div className="grid grid-cols-2 gap-4">
                <input className={fieldCls} type="date" value={form.date} onChange={set("date")} required />
                <input className={fieldCls} type="time" value={form.time} onChange={set("time")} required />
              </div>
              <select className={fieldCls} value={form.guests} onChange={set("guests")}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                ))}
                <option value="9+">9+ Guests (Private Dining)</option>
              </select>
              <textarea
                className={`${fieldCls} resize-none h-24`}
                placeholder="Special requests, dietary requirements, or celebrations..."
                value={form.requests}
                onChange={set("requests")}
              />
              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground text-xs tracking-[0.18em] uppercase font-mono hover:bg-accent transition-colors duration-300 flex items-center justify-center gap-2 group"
              >
                Confirm Reservation
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="py-24 lg:py-36 bg-card">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Get in <em className="italic text-primary">Touch</em>
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: MapPin,
              label: "Address",
              lines: ["48 Hearthstone Lane", "Old Quarter, NY 10014"],
            },
            {
              icon: Phone,
              label: "Phone",
              lines: ["+1 (555) 824-3690", "+1 (555) 824-3691"],
            },
            {
              icon: Mail,
              label: "Email",
              lines: ["hello@embertable.com", "events@embertable.com"],
            },
            {
              icon: Clock,
              label: "Hours",
              lines: ["Mon–Fri  12pm – 11pm", "Sat–Sun  11am – 11:30pm"],
            },
          ].map(({ icon: Icon, label, lines }) => (
            <FadeIn key={label}>
              <div className="p-6 border border-border hover:border-primary/40 transition-colors bg-background">
                <Icon size={20} className="text-primary mb-4" />
                <div className="text-xs tracking-[0.15em] uppercase font-mono text-muted-foreground mb-2">{label}</div>
                {lines.map((l) => (
                  <div key={l} className="text-sm text-foreground/80 font-sans leading-relaxed">{l}</div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Map placeholder */}
        <FadeIn>
          <div className="w-full h-72 border border-border overflow-hidden bg-muted relative flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&h=400&fit=crop&auto=format"
              alt="Map location placeholder"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-card border border-primary/50 px-6 py-4 text-center">
                <MapPin size={20} className="text-primary mx-auto mb-2" />
                <div className="font-serif text-sm text-foreground">48 Hearthstone Lane</div>
                <div className="text-xs text-muted-foreground font-mono mt-1">Old Quarter, New York</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const scrollTo = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="bg-[#080705] border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="font-serif text-2xl text-foreground mb-1">The Ember Table</div>
            <div className="text-[10px] tracking-[0.22em] uppercase font-mono text-primary mb-4">Fine Dining & Café</div>
            <p className="text-sm text-muted-foreground font-sans font-light leading-relaxed max-w-xs">
              Where every dish is a chapter and every visit a story worth telling. We are honoured to be part of your memories.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-mono text-muted-foreground mb-5">Quick Links</div>
            <div className="space-y-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => scrollTo(link)}
                  className="block text-sm text-foreground/60 hover:text-primary font-sans transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase font-mono text-muted-foreground mb-5">Stay in Touch</div>
            <p className="text-sm text-muted-foreground font-sans font-light mb-4 leading-relaxed">
              Seasonal menus, events, and exclusive experiences — delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground px-4 py-2.5 focus:outline-none focus:border-primary transition-colors font-sans"
              />
              <button className="px-4 py-2.5 bg-primary text-primary-foreground text-xs font-mono tracking-wider hover:bg-accent transition-colors shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            © 2024 The Ember Table. All rights reserved.
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            Crafted with care for unforgettable evenings.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── Floating Buttons ─────────────────────────────────────────────────────────

function FloatingButtons() {
  const scrollY = useScrollY();
  const showTop = scrollY > 400;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
      {/* WhatsApp */}
      <a
        href="https://wa.me/15558243690"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 text-xs font-mono tracking-wide shadow-lg hover:bg-[#20bd5a] transition-colors group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={16} />
        <span className="hidden group-hover:inline">WhatsApp Us</span>
      </a>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="w-11 h-11 border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-background shadow-lg"
        style={{ opacity: showTop ? 1 : 0, pointerEvents: showTop ? "auto" : "none", transition: "opacity 0.3s" }}
        aria-label="Back to top"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        .font-serif { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono { font-family: 'DM Mono', 'Courier New', monospace; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0b08; }
        ::-webkit-scrollbar-thumb { background: #c17f3e; }
        * { scrollbar-width: thin; scrollbar-color: #c17f3e #0d0b08; }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <MenuSection />
      <Gallery />
      <Reviews />
      <Reservation />
      <Contact />
      <Footer />
      <FloatingButtons />
    </div>
  );
}
