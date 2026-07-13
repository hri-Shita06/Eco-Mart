const {useState, useEffect, useContext, createContext} = React;

const ShopContext = createContext(null);

const ShopProvider = ({children}) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2000);
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    showToast(product.name + " added to cart");
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(w => w.id === product.id);
      showToast(exists ? product.name + " removed from wishlist" : product.name + " added to wishlist");
      return exists ? prev.filter(w => w.id !== product.id) : [...prev, product];
    });
  };

  const openQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const value = {cart, wishlist, addToCart, removeFromCart, toggleWishlist, quickViewProduct, openQuickView, closeQuickView, toast};
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};


const Star = ({filled}) => (
  <i className={filled ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
);

const Rating = ({value=5, count}) => (
  <div className="rating d-flex align-items-center">
    {[1,2,3,4,5].map(n => <Star key={n} filled={n <= value} />)}
    {count !== undefined && <span className="count">({count})</span>}
  </div>
);

const SectionHeading = ({eyebrow, title, arrows, onPrev, onNext, action}) => (
  <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
    <div>
      <div className="eyebrow"><span className="bar"></span>{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
    </div>
    {arrows && (
      <div className="nav-arrows">
        <button type="button" aria-label="Previous" onClick={onPrev}><i className="fa-solid fa-arrow-left"></i></button>
        <button type="button" aria-label="Next" onClick={onNext}><i className="fa-solid fa-arrow-right"></i></button>
      </div>
    )}
    {action}
  </div>
);

const TopBar = () => (
  <div className="topbar">
    <div className="container-xl d-flex justify-content-between align-items-center">
      <div className="d-none d-md-block"></div>
      <p className="mb-0 text-center flex-grow-1">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <a href="#">ShopNow</a>
      </p>
      <div className="lang d-none d-md-flex">
        English <i className="fa-solid fa-chevron-down" style={{fontSize:'10px'}}></i>
      </div>
    </div>
  </div>
);

const searchCategories = ["All Categories", "Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Groceries"];

const navLinks = [
  {label: "Home", target: "top"},
  {label: "About", target: "about-us"},
  {label: "Contact", target: "contact-us"},
];

const scrollToId = (id) => {
  if (id === "top") {
    window.scrollTo({top: 0, behavior: "smooth"});
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({behavior: "smooth", block: "start"});
};

const SignUpModal = ({onClose}) => {
  const [form, setForm] = useState({name: "", email: "", password: ""});

  const handleChange = (e) => setForm(prev => ({...prev, [e.target.name]: e.target.value}));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || form.password.length < 4) {
      window.alert("Please fill in a valid name, email and password (4+ characters).");
      return;
    }
    window.alert("Welcome to Eco-Mart, " + form.name + "! Your account has been created.");
    onClose();
  };

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" style={{maxWidth: "420px"}} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qv-close" aria-label="Close sign up" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div style={{width: "100%"}}>
          <h3 className="mb-3">Create Your Account</h3>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Full name" className="form-control" required
            />
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="Email address" className="form-control" required
            />
            <input
              type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="Password" className="form-control" required
            />
            <button type="submit" className="btn-accent">Sign Up</button>
          </form>
          <p className="small text-muted mt-3 mb-0">Already have an account? <a href="#">Log in</a></p>
        </div>
      </div>
    </div>
  );
};

const CartDropdown = ({onClose}) => {
  const {cart, removeFromCart} = useContext(ShopContext);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="cart-dropdown-header">
        <span>{cart.length === 0 ? "Your cart is empty" : cart.length + " item" + (cart.length > 1 ? "s" : "") + " in cart"}</span>
        <button type="button" aria-label="Close cart" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
      </div>
      {cart.length > 0 && (
        <React.Fragment>
          <ul className="cart-dropdown-list">
            {cart.map((item, idx) => (
              <li key={item.id + "-" + idx} className="cart-dropdown-item">
                <div className="cart-dropdown-thumb"><img src={item.img} alt={item.name} /></div>
                <div className="cart-dropdown-info">
                  <p className="mb-0">{item.name}</p>
                  <span className="price-new">${item.price}</span>
                </div>
                <button type="button" aria-label={"Remove " + item.name} onClick={() => removeFromCart(item.id)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-dropdown-footer">
            <div className="d-flex justify-content-between mb-3">
              <span>Subtotal</span>
              <span className="price-new">${total}</span>
            </div>
            <button type="button" className="btn-accent w-100" onClick={() => window.alert("Proceeding to checkout with " + cart.length + " item(s), total $" + total)}>
              Checkout
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const NavBar = () => {
  const {cart, wishlist} = useContext(ShopContext);
  const [category, setCategory] = useState(searchCategories[0]);
  const [query, setQuery] = useState("");
  const [isCartOpen, setCartOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isCartOpen) return;
    const closeOnOutside = () => setCartOpen(false);
    document.addEventListener("click", closeOnOutside);
    return () => document.removeEventListener("click", closeOnOutside);
  }, [isCartOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnOutside = () => setMobileMenuOpen(false);
    document.addEventListener("click", closeOnOutside);
    return () => document.removeEventListener("click", closeOnOutside);
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.alert("Searching \"" + query + "\" in " + category + "...");
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (link.label === "Sign Up") {
      setSignUpOpen(true);
      return;
    }
    setActiveLink(link.label);
    scrollToId(link.target);
  };

  return (
    <nav className="site-nav" id="top">
      <div className="container-xl d-flex justify-content-between align-items-center flex-wrap gap-3">
        <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); handleNavClick(e, {label: "Home", target: "top"}); }}>Eco-Mart</a>
        <button
          type="button"
          className="hamburger-btn d-lg-none"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(prev => !prev); }}
        >
          <i className={"fa-solid " + (isMobileMenuOpen ? "fa-xmark" : "fa-bars")}></i>
        </button>
        <ul
          className={"nav-links mb-0" + (isMobileMenuOpen ? " mobile-open" : "")}
          onClick={(e) => e.stopPropagation()}
        >
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={"#" + link.target}
                className={activeLink === link.label ? "active" : ""}
                onClick={(e) => handleNavClick(e, link)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setSignUpOpen(true); }}>Sign Up</a>
          </li>
        </ul>
        <div className="nav-right">
          <form className="search-box d-flex align-items-center" onSubmit={handleSearchSubmit}>
            <select
              className="search-cat-select"
              aria-label="Search category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {searchCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search"><i className="fa-solid fa-magnifying-glass"></i></button>
          </form>
          <a href="#" className="icon-link" aria-label="Wishlist" onClick={e => e.preventDefault()}>
            <i className="fa-regular fa-heart"></i>
            {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
          </a>
          <div className="position-relative">
            <a
              href="#"
              className="icon-link"
              aria-label="Cart"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCartOpen(prev => !prev); }}
            >
              <i className="fa-solid fa-cart-shopping"></i>
              {cart.length > 0 && <span className="badge-count">{cart.length}</span>}
            </a>
            {isCartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
          </div>
        </div>
      </div>
      {isSignUpOpen && <SignUpModal onClose={() => setSignUpOpen(false)} />}
    </nav>
  );
};

const sideCategories = [
  {name:"Woman's Fashion", hasChild:true},
  {name:"Men's Fashion", hasChild:true},
  {name:"Electronics"},
  {name:"Home & Lifestyle"},
  {name:"Medicine"},
  {name:"Sports & Outdoor"},
  {name:"Baby's & Toys"},
  {name:"Groceries & Pets"},
  {name:"Health & Beauty"},
];

const SideCategories = () => (
  <ul className="side-cats">
    {sideCategories.map((c,i) => (
      <li key={i}>
        <a href="#">{c.name} {c.hasChild && <i className="fa-solid fa-chevron-right" style={{fontSize:'11px'}}></i>}</a>
      </li>
    ))}
  </ul>
);

const HeroBanner = () => (
  <div className="hero-banner h-100">
    <div>
      <div className="apple-tag">
        <i className="fa-brands fa-apple fa-lg"></i> iPhone 14 Series
      </div>
      <h1>Up to 10% <br/>off Voucher</h1>
      <a
        href="#todays-flash-sales"
        className="shop-now"
        onClick={(e) => { e.preventDefault(); document.getElementById('todays-flash-sales')?.scrollIntoView({behavior:'smooth'}); }}
      >
        Shop Now <i className="fa-solid fa-arrow-right"></i>
      </a>
    </div>
    <img
      className="hero-img"
      alt="iPhone 14 series promotional device"
      src="IMAGE 1.png" />
  </div>
);

const Header = () => (
  <header>
    <TopBar />
    <NavBar />
    <div className="hero-wrap container-xl">
      <div className="row g-4">
        <div className="col-lg-3 d-none d-lg-block">
          <SideCategories />
        </div>
        <div className="col-lg-9">
          <HeroBanner />
          <div className="hero-dots">
            <span></span><span></span><span className="active"></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>
  </header>
);


const ProductCard = ({p}) => {
  const {addToCart, toggleWishlist, wishlist, openQuickView} = useContext(ShopContext);
  const isWishlisted = wishlist.some(w => w.id === p.id);
  return (
    <div className="product-card">
      <div className="product-thumb">
        {p.discount && <span className="badge-discount">-{p.discount}%</span>}
        {p.isNew && <span className="badge-new">NEW</span>}
        <button
          type="button"
          className="icon-btn fav-btn"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(p)}
        >
          <i
            className={(isWishlisted ? "fa-solid" : "fa-regular") + " fa-heart"}
            style={isWishlisted ? {color:'var(--clr-accent)'} : undefined}
          ></i>
        </button>
        <button type="button" className="icon-btn eye-btn" aria-label="Quick view" onClick={() => openQuickView(p)}>
          <i className="fa-regular fa-eye"></i>
        </button>
        <img src={p.img} alt={p.name} loading="lazy" />
        <button type="button" className="add-cart-bar" onClick={() => addToCart(p)}>Add To Cart</button>
      </div>
      <p className="product-name mb-1">{p.name}</p>
      <div className="mb-1">
        <span className="price-new">${p.price}</span>
        {p.old && <span className="price-old">${p.old}</span>}
      </div>
      <Rating value={p.rating} count={p.count} />
      {p.colors && (
        <div className="color-dots">
          {p.colors.map((c,i) => <span key={i} style={{background:c}}></span>)}
        </div>
      )}
    </div>
  );
};



const flashProductsPool = [
  {id:"fs1", img:"IMG2.png", name:"HAVIT HV-G92 Gamepad", price:120, old:160, rating:5, count:88, discount:40},
  {id:"fs2", img:"ak-900-01-500x500 1.png", name:"AK-900 Wired Keyboard", price:960, old:1160, rating:4, count:75, discount:35},
  {id:"fs3", img:"g27cq4-500x500 1.png", name:"IPS LCD Gaming Monitor", price:370, old:400, rating:5, count:99, discount:30},
  {id:"fs4", img:"sam-moghadam-khamseh-kvmdsTrGOBM-unsplash 1.png", name:"S-Series Comfort Chair", price:375, old:400, rating:4, count:99, discount:25},
  {id:"fs5", img:"IMG2.png", name:"Wireless Earbuds Pro", price:89, old:120, rating:4, count:142, discount:26},
  {id:"fs6", img:"ak-900-01-500x500 1.png", name:"Leather Travel Backpack", price:145, old:180, rating:4, count:58, discount:19},
  {id:"fs7", img:"g27cq4-500x500 1.png", name:"4K Action Camera", price:210, old:260, rating:5, count:77, discount:19},
  {id:"fs8", img:"sam-moghadam-khamseh-L_7MQsHl_aU-unsplash 1.png", name:"Ergonomic Desk Lamp", price:65, old:85, rating:4, count:40, discount:24},
];

const useCountdown = (target) => {
  const [t,setT] = useState(target);
  useEffect(() => {
    const id = setInterval(() => {
      setT(prev => {
        let {d,h,m,s} = prev;
        s--; if(s<0){s=59;m--;} if(m<0){m=59;h--;} if(h<0){h=23;d--;}
        return {d,h,m,s};
      });
    },1000);
    return () => clearInterval(id);
  },[]);
  return t;
};

const FlashSales = () => {
  const t = useCountdown({d:3,h:23,m:19,s:56});
  const pad = n => String(n).padStart(2,'0');
  const [page, setPage] = useState(0);
  const totalPages = 2;
  const visible = flashProductsPool.slice(page*4, page*4+4);
  const next = () => setPage(p => (p+1) % totalPages);
  const prev = () => setPage(p => (p-1+totalPages) % totalPages);

  return (
    <section className="container-xl py-5" id="todays-flash-sales">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-4">
        <div className="d-flex align-items-end gap-5 flex-wrap">
          <div>
            <div className="eyebrow"><span className="bar"></span>Today's</div>
            <h2 className="section-title mb-0">Flash Sales</h2>
          </div>
          <div className="countdown">
            <div className="unit"><div className="unit-label">Days</div><div className="unit-value">{pad(t.d)}</div></div>
            <div className="sep">:</div>
            <div className="unit"><div className="unit-label">Hours</div><div className="unit-value">{pad(t.h)}</div></div>
            <div className="sep">:</div>
            <div className="unit"><div className="unit-label">Minutes</div><div className="unit-value">{pad(t.m)}</div></div>
            <div className="sep">:</div>
            <div className="unit"><div className="unit-label">Seconds</div><div className="unit-value">{pad(t.s)}</div></div>
          </div>
        </div>
        <div className="nav-arrows">
          <button type="button" aria-label="Previous" onClick={prev}><i className="fa-solid fa-arrow-left"></i></button>
          <button type="button" aria-label="Next" onClick={next}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
      <div className="row g-4">
        {visible.map((p) => (
          <div className="col-6 col-md-3" key={p.id}><ProductCard p={p} /></div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button
          type="button"
          className="btn-accent"
          onClick={() => document.getElementById('explore-products')?.scrollIntoView({behavior:'smooth'})}
        >
          View All Products
        </button>
      </div>
    </section>
  );
};



const bestSellingPool = [
  {id:"bs1", img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop", name:"The North Face Jacket", price:260, old:360, rating:4, count:65},
  {id:"bs2", img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop", name:"Gucci Duffle Bag", price:960, old:1160, rating:4, count:65},
  {id:"bs3", img:"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=400&auto=format&fit=crop", name:"RGB Liquid CPU Cooler", price:160, old:170, rating:4, count:65},
  {id:"bs4", img:"https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=400&auto=format&fit=crop", name:"Small BookShelf", price:380, rating:4, count:65},
  {id:"bs5", img:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop", name:"Vintage Sunglasses", price:80, old:100, rating:4, count:40},
  {id:"bs6", img:"https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop", name:"Classic Leather Wallet", price:45, old:60, rating:4, count:52},
  {id:"bs7", img:"https://images.unsplash.com/photo-1544207240-6f4bfcc17aef?q=80&w=400&auto=format&fit=crop", name:"Smart Desk Lamp", price:95, rating:4, count:33},
  {id:"bs8", img:"https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?q=80&w=400&auto=format&fit=crop", name:"Ceramic Coffee Mug Set", price:35, old:50, rating:5, count:80},
];

const BestSellingProducts = () => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? bestSellingPool : bestSellingPool.slice(0,4);
  return (
    <section className="container-xl py-5">
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
        <div>
          <div className="eyebrow"><span className="bar"></span>This Month</div>
          <h2 className="section-title mb-0">Best Selling Products</h2>
        </div>
        <button type="button" className="btn-accent" onClick={() => setShowAll(s => !s)}>
          {showAll ? "Show Less" : "View All"}
        </button>
      </div>
      <div className="row g-4">
        {visible.map((p) => (
          <div className="col-6 col-md-3" key={p.id}><ProductCard p={p} /></div>
        ))}
      </div>
    </section>
  );
};



const promoSpeaker = {
  id:"promo-speaker",
  img:"JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png",
  name:"Boombox Bluetooth Speaker",
  price:199, old:250, rating:5, count:210,
};

const PromoBanner = () => {
  const t = useCountdown({d:5,h:23,m:59,s:35});
  const {addToCart} = useContext(ShopContext);
  const [justAdded, setJustAdded] = useState(false);
  const pad = n => String(n).padStart(2,'0');

  const handleBuy = () => {
    addToCart(promoSpeaker);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <section className="container-xl py-5">
      <div className="promo-banner">
        <div>
          <div className="eyebrow promo-eyebrow"><span className="bar promo-bar"></span>Categories</div>
          <h2>Enhance Your <br/>Music Experience</h2>
          <div className="promo-circles">
            <div className="circle"><span>{pad(t.h)}</span>Hours</div>
            <div className="circle"><span>{pad(t.d)}</span>Days</div>
            <div className="circle"><span>{pad(t.m)}</span>Minutes</div>
            <div className="circle"><span>{pad(t.s)}</span>Seconds</div>
          </div>
          <button type="button" className="btn-green" onClick={handleBuy}>
            {justAdded ? "Added to cart ✓" : "Buy Now!"}
          </button>
        </div>
        <img className="promo-img" alt="Bluetooth boombox speaker" src={promoSpeaker.img} />
      </div>
    </section>
  );
};



const exploreProductsPool = [
  {id:"ep1", img:"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=400&auto=format&fit=crop", name:"Breed Dry Dog Food", price:100, old:120, rating:3, count:35},
  {id:"ep2", img:"https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=400&auto=format&fit=crop", name:"CANON EOS DSLR Camera", price:360, old:400, rating:4, count:95},
  {id:"ep3", img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400&auto=format&fit=crop", name:"ASUS FHD Gaming Laptop", price:700, rating:5, count:325},
  {id:"ep4", img:"https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop", name:"Curology Product Set", price:500, rating:4, count:145},
  {id:"ep5", img:"https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=400&auto=format&fit=crop", name:"Kids Electric Car", price:960, rating:5, count:65, isNew:true, colors:["#DB4444","#B91E1E"]},
  {id:"ep6", img:"https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=400&auto=format&fit=crop", name:"Jr. Zoom Soccer Cleats", price:1160, rating:5, count:35, isNew:true, colors:["#FFD400","#DB4444"]},
  {id:"ep7", img:"https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=400&auto=format&fit=crop", name:"GP11 Shooter USB Gamepad", price:660, rating:4, count:55, isNew:true, colors:["#181818","#DB4444"]},
  {id:"ep8", img:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop", name:"Quilted Satin Jacket", price:660, rating:5, count:55, colors:["#2FA76F","#DB4444"]},
  {id:"ep9", img:"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=400&auto=format&fit=crop", name:"Wireless Bluetooth Earbuds", price:120, old:150, rating:4, count:210},
  {id:"ep10", img:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", name:"Smart Fitness Watch", price:199, old:249, rating:4, count:180},
  {id:"ep11", img:"shopping (1).webp", name:"Canvas Travel Backpack", price:85, rating:5, count:90},
  {id:"ep12", img:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop", name:"Polarized Sunglasses", price:60, old:80, rating:4, count:60, isNew:true},
  {id:"ep13", img:"sam-moghadam-khamseh-L_7MQsHl_aU-unsplash 1.png", name:"Ergonomic Office Chair", price:340, old:400, rating:4, count:75},
  {id:"ep14", img:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=400&auto=format&fit=crop", name:"Stainless Steel Water Bottle", price:25, rating:5, count:140},
  {id:"ep15", img:"https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=400&auto=format&fit=crop", name:"Portable Desk Organizer", price:40, rating:4, count:48},
  {id:"ep16", img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop", name:"Classic Denim Jacket", price:130, old:160, rating:4, count:66},
];

const ExploreProducts = () => {
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const totalPages = 2;
  const visible = showAll ? exploreProductsPool : exploreProductsPool.slice(page*8, page*8+8);
  const next = () => setPage(p => (p+1) % totalPages);
  const prev = () => setPage(p => (p-1+totalPages) % totalPages);

  return (
    <section className="container-xl py-5" id="explore-products">
      <SectionHeading
        eyebrow="Our Products"
        title="Explore Our Products"
        arrows={!showAll}
        onPrev={prev}
        onNext={next}
      />
      <div className="row g-4">
        {visible.map((p) => (
          <div className="col-6 col-md-3" key={p.id}><ProductCard p={p} /></div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button type="button" className="btn-accent" onClick={() => setShowAll(s => !s)}>
          {showAll ? "Show Less" : "View All Products"}
        </button>
      </div>
    </section>
  );
};


const initialCategories = [
  {name:"Phones", icon:"fa-mobile-screen-button"},
  {name:"Computers", icon:"fa-display"},
  {name:"SmartWatch", icon:"fa-clock"},
  {name:"Camera", icon:"fa-camera"},
  {name:"HeadPhones", icon:"fa-headphones"},
  {name:"Gaming", icon:"fa-gamepad"},
];

const BrowseCategory = () => {
  const [order, setOrder] = useState(initialCategories);
  const [active, setActive] = useState("Camera");
  const rotate = (dir) => setOrder(prev => dir === 'next'
    ? [...prev.slice(1), prev[0]]
    : [prev[prev.length-1], ...prev.slice(0,-1)]
  );
  return (
    <section className="container-xl py-5">
      <SectionHeading
        eyebrow="Categories"
        title="Browse By Category"
        arrows
        onPrev={() => rotate('prev')}
        onNext={() => rotate('next')}
      />
      <div className="row g-3">
        {order.map((c) => (
          <div className="col-4 col-md-2" key={c.name}>
            <div
              className={"cat-box" + (active === c.name ? " active" : "")}
              onClick={() => setActive(c.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') setActive(c.name); }}
            >
              <div><i className={"fa-solid " + c.icon}></i></div>
              <span>{c.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};



const NewArrival = () => (
  <section className="container-xl py-5">
    <SectionHeading eyebrow="Featured" title="New Arrival" />
    <div className="row g-3 new-arrival-row">
      <div className="col-lg-6">
        <div
          className="arrival-tile arrival-tile-hero h-100"
          style={{backgroundImage:"url('https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=900&auto=format&fit=crop')"}}
        >
          <div className="tile-body">
            <h3>PlayStation 5</h3>
            <p>Black and White version of the PS5 coming out on sale.</p>
            <a href="#" className="tile-link">Shop Now</a>
          </div>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="row g-3 h-100">
          <div className="col-12 arrival-sub-tile-wrap">
            <div
              className="arrival-tile arrival-sub-tile h-100"
              style={{backgroundImage:"url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=900&auto=format&fit=crop')"}}
            >
              <div className="tile-body">
                <h3>Women's Collections</h3>
                <p>Featured woman collections that give you another vibe.</p>
                <a href="#" className="tile-link">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="col-6 arrival-sub-tile-wrap">
            <div
              className="arrival-tile arrival-sub-tile h-100"
              style={{backgroundImage:"url('https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop')"}}
            >
              <div className="tile-body">
                <h3 className="tile-title-sm">Speakers</h3>
                <p className="tile-text-sm">Amazon wireless speakers</p>
                <a href="#" className="tile-link">Shop Now</a>
              </div>
            </div>
          </div>
          <div className="col-6 arrival-sub-tile-wrap">
            <div
              className="arrival-tile arrival-sub-tile h-100"
              style={{backgroundImage:"url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600&auto=format&fit=crop')"}}
            >
              <div className="tile-body">
                <h3 className="tile-title-sm">Perfume</h3>
                <p className="tile-text-sm">GUCCI Intense Oud EDP</p>
                <a href="#" className="tile-link">Shop Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);


const Features = () => (
  <section className="container-xl py-5" id="about-us">
    <div className="row text-center g-4">
      {[
        {icon:"fa-truck-fast", title:"FREE AND FAST DELIVERY", sub:"Free delivery for all orders over $140"},
        {icon:"fa-headset", title:"24/7 CUSTOMER SERVICE", sub:"Friendly 24/7 customer support"},
        {icon:"fa-shield-halved", title:"MONEY BACK GUARANTEE", sub:"We reurn money within 30 days"},
      ].map((f,i) => (
        <div className="col-md-4" key={i}>
          <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
               style={{width:'64px',height:'64px',background:'#000',color:'#fff',border:'8px solid #d9d9d9'}}>
            <i className={"fa-solid " + f.icon} style={{fontSize:'22px'}}></i>
          </div>
          <h6 className="fw-bold">{f.title}</h6>
          <p className="text-muted small">{f.sub}</p>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      window.alert("Please enter a valid email address.");
      return;
    }
    setEmail("");
    window.alert("Thanks for subscribing! Your 10% discount code is on its way.");
  };

  return (
    <footer style={{background:'#000',color:'#fff'}} className="pt-5 pb-4 mt-4" id="contact-us">
      <div className="container-xl">
        <div className="row g-4">
          <div className="col-6 col-md-4 col-lg-3">
            <h5>Eco-Mart</h5>
            <p className="mt-3 mb-2">Subscribe</p>
            <p className="small text-white-50">Get 10% off your first order</p>
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe"><i className="fa-solid fa-paper-plane"></i></button>
            </form>
          </div>
          <div className="col-6 col-md-4 col-lg-3">
            <h6>Support</h6>
            <p className="small text-white-50 mt-3 mb-1">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh</p>
            <p className="small text-white-50 mb-1"><a href="mailto:exclusive@gmail.com" className="footer-link">exclusive@gmail.com</a></p>
            <p className="small text-white-50"><a href="tel:+8801588889999" className="footer-link">+88015-88888-9999</a></p>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <h6>Account</h6>
            <ul className="small text-white-50 mt-3">
              <li className="mb-1"><a href="#" className="footer-link">My Account</a></li>
              <li className="mb-1"><a href="#" className="footer-link">Login / Register</a></li>
              <li className="mb-1"><a href="#" className="footer-link">Cart</a></li>
              <li><a href="#" className="footer-link">Wishlist</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <h6>Quick Link</h6>
            <ul className="small text-white-50 mt-3">
              <li className="mb-1"><a href="#" className="footer-link">Privacy Policy</a></li>
              <li className="mb-1"><a href="#" className="footer-link">Terms Of Use</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
            </ul>
          </div>
          <div className="col-6 col-md-4 col-lg-2">
            <h6>Download App</h6>
            <p className="small text-white-50 mt-3 mb-2">Save $3 with App New User Only</p>
            <div className="app-badges">
              <div className="qr-box">
                <img src="Qrcode 1.png" alt="Scan to download the app" className="qr-img" />
              </div>
              <div className="d-flex flex-column gap-1">
                <a href="#" className="store-badge"><i className="fa-brands fa-google-play"></i> Google Play</a>
                <a href="#" className="store-badge"><i className="fa-brands fa-app-store-ios"></i> App Store</a>
              </div>
            </div>
            <div className="d-flex gap-3 mt-3 fs-5">
              <a href="#" aria-label="Facebook" className="footer-link"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" aria-label="Twitter" className="footer-link"><i className="fa-brands fa-twitter"></i></a>
              <a href="#" aria-label="Instagram" className="footer-link"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn" className="footer-link"><i className="fa-brands fa-linkedin"></i></a>
            </div>
          </div>
        </div>
        <hr className="text-white-50 mt-4" />
        <p className="text-center small text-white-50 mb-0">© Copyright Eco-Mart 2026. All rights reserved.</p>
      </div>
    </footer>
  );
};



const QuickViewModal = () => {
  const {quickViewProduct, closeQuickView, addToCart, toggleWishlist, wishlist} = useContext(ShopContext);
  if (!quickViewProduct) return null;
  const p = quickViewProduct;
  const isWishlisted = wishlist.some(w => w.id === p.id);
  return (
    <div className="qv-overlay" onClick={closeQuickView}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qv-close" aria-label="Close quick view" onClick={closeQuickView}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <div className="qv-img"><img src={p.img} alt={p.name} /></div>
        <div className="qv-info">
          <h3 className="mb-2">{p.name}</h3>
          <Rating value={p.rating} count={p.count} />
          <div className="my-2">
            <span className="price-new fs-5">${p.price}</span>
            {p.old && <span className="price-old">${p.old}</span>}
          </div>
          <p className="text-muted small mb-3">In stock and ready to ship. Free delivery on orders over $140.</p>
          <div className="d-flex gap-2">
            <button type="button" className="btn-accent" onClick={() => { addToCart(p); closeQuickView(); }}>
              Add To Cart
            </button>
            <button type="button" className="icon-btn" aria-label="Toggle wishlist" onClick={() => toggleWishlist(p)}>
              <i
                className={(isWishlisted ? "fa-solid" : "fa-regular") + " fa-heart"}
                style={isWishlisted ? {color:'var(--clr-accent)'} : undefined}
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = () => {
  const {toast} = useContext(ShopContext);
  if (!toast) return null;
  return <div className="toast-msg">{toast}</div>;
};

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      type="button"
      className="scroll-top-btn"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
    >
      <i className="fa-solid fa-arrow-up"></i>
    </button>
  );
};




const App = () => (
  <ShopProvider>
    <Header />
    <FlashSales />
    <hr className="container-xl" style={{borderColor:'var(--clr-border)'}} />
    <BestSellingProducts />
    <PromoBanner />
    <ExploreProducts />
    <hr className="container-xl" style={{borderColor:'var(--clr-border)'}} />
    <BrowseCategory />
    <hr className="container-xl" style={{borderColor:'var(--clr-border)'}} />
    <NewArrival />
    <Features />
    <Footer />
    <QuickViewModal />
    <Toast />
    <ScrollToTop />
  </ShopProvider>
);
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
