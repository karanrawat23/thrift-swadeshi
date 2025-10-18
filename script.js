/* Thrift — interactive front-end (no backend) */
const PRODUCTS = [
  { id:1, title:"Men's Tracksuit", price:49.00, cat:"tops", img:"https://picsum.photos/seed/tracksuit/800/600", rating:4.2, desc:"Cozy tracksuit — great for warmups."},
  { id:2, title:"Windbreaker Jacket", price:59.00, cat:"tops", img:"https://picsum.photos/seed/windbreaker/800/600", rating:4.6, desc:"Lightweight wind protection."},
  { id:3, title:"Running Shorts", price:22.00, cat:"bottoms", img:"https://picsum.photos/seed/shorts/800/600", rating:4.0, desc:"Breathable running shorts."},
  { id:4, title:"Performance Gym Tee", price:18.00, cat:"tops", img:"https://picsum.photos/seed/gymtee/800/600", rating:4.4, desc:"Sweat-wicking tee."},
  { id:5, title:"Training Sneakers", price:79.00, cat:"footwear", img:"https://picsum.photos/seed/sneakers/800/600", rating:4.7, desc:"Comfortable trainers."},
  { id:6, title:"Sports Cap", price:12.00, cat:"accessories", img:"https://picsum.photos/seed/cap/800/600", rating:4.1, desc:"Classic sports cap."}
];

const productsEl = document.getElementById('products');
const template = document.getElementById('product-template');
const searchInput = document.getElementById('search');
const suggestionsEl = document.getElementById('suggestions');
const sortEl = document.getElementById('sort');
const rangeEl = document.getElementById('range');
const rangeValueEl = document.getElementById('rangeValue');
const priceMinEl = document.getElementById('priceMin');
const priceMaxEl = document.getElementById('priceMax');
const cartBtn = document.getElementById('cartButton');
const cartCountEl = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

let cart = JSON.parse(localStorage.getItem('thrift_cart') || '[]');
let theme = localStorage.getItem('thrift_theme') || 'light';
let active = [...PRODUCTS];
let currentMax = Number(rangeEl?.max || 100);

// init theme
document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

// utility
const formatPrice = v => '$' + v.toFixed(2);
const clamp = (v,min,max) => Math.min(Math.max(v,min),max);

// render stars
function stars(n){
  const full = Math.floor(n);
  const half = (n - full) >= 0.5;
  let s = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(Math.max(0,5-full - (half?1:0)));
  return s.replace('½','☆'); // simple visual
}

// render products
function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const node = template.content.cloneNode(true);
    node.querySelector('.card-img').src = p.img;
    node.querySelector('.card-img').alt = p.title;
    node.querySelector('.card-title').textContent = p.title;
    node.querySelector('.card-price').textContent = formatPrice(p.price);
    node.querySelector('.badge.rating').textContent = stars(Math.round(p.rating));
    const view = node.querySelector('.view-btn');
    const add = node.querySelector('.add-btn');
    view.addEventListener('click', ()=> openModal(p));
    add.addEventListener('click', ()=> addToCart(p));
    productsEl.appendChild(node);
    // fade-in
    requestAnimationFrame(()=> node.firstElementChild.classList.add('visible'));
  });
}

// cart functions
function saveCart(){ localStorage.setItem('thrift_cart', JSON.stringify(cart)); }
function updateCartUI(){
  cartCountEl.textContent = cart.length;
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((c,i)=>{
    total += c.price;
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `<img src="${c.img}" alt="${c.title}"><div style="flex:1"><strong>${c.title}</strong><div class="muted">${formatPrice(c.price)}</div></div><button class="remove" data-i="${i}">Remove</button>`;
    item.querySelector('.remove').addEventListener('click', e => {
      cart.splice(i,1); saveCart(); updateCartUI();
    });
    cartItemsEl.appendChild(item);
  });
  cartTotalEl.textContent = formatPrice(total);
}
function addToCart(p){
  cart.push(p); saveCart(); updateCartUI(); animateCartBtn();
}
function animateCartBtn(){ cartBtn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:240}); }

// cart panel toggles
cartBtn.addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', ()=> { closeCart(); closeModal(); });

function openCart(){ cartPanel.classList.add('open'); overlay.classList.add('show'); overlay.removeAttribute('hidden'); cartPanel.setAttribute('aria-hidden','false'); }
function closeCart(){ cartPanel.classList.remove('open'); overlay.classList.remove('show'); overlay.setAttribute('hidden',''); cartPanel.setAttribute('aria-hidden','true'); }

// modal
const modal = document.getElementById('productModal');
function openModal(p){
  modal.setAttribute('aria-hidden','false'); overlay.classList.add('show'); overlay.removeAttribute('hidden');
  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalPrice').textContent = formatPrice(p.price);
  document.getElementById('modalDesc').textContent = p.desc;
  document.getElementById('modalRating').textContent = 'Rating: ' + p.rating.toFixed(1) + ' / 5';
  document.getElementById('modalAdd').onclick = () => { addToCart(p); closeModal(); };
}
function closeModal(){ modal.setAttribute('aria-hidden','true'); overlay.classList.remove('show'); overlay.setAttribute('hidden',''); }
document.getElementById('closeModal').addEventListener('click', closeModal);

// search + suggestions (debounced)
function debounce(fn,ms=200){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }
searchInput.addEventListener('input', debounce(e=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q){ suggestionsEl.classList.remove('show'); filterAndRender(); return; }
  const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(q)).slice(0,6);
  suggestionsEl.innerHTML = matches.map(m=>`<li data-id="${m.id}" tabindex="0">${m.title}</li>`).join('');
  suggestionsEl.classList.add('show'); suggestionsEl.setAttribute('aria-hidden','false');
  suggestionsEl.querySelectorAll('li').forEach(li => li.addEventListener('click', ()=> {
    searchInput.value = li.textContent; suggestionsEl.classList.remove('show');
    filterAndRender();
  }));
},220));

// category filters
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    document.querySelectorAll('.filter-btn').forEach(b=> b.setAttribute('aria-pressed','false'));
    btn.setAttribute('aria-pressed','true');
    filterAndRender();
  });
});

// sort
sortEl.addEventListener('change', ()=> filterAndRender());

// price range slider & inputs
rangeEl.addEventListener('input', ()=> {
  const v = Number(rangeEl.value);
  rangeValueEl.textContent = '$' + v;
  priceMaxEl.value = v;
  filterAndRender();
});
priceMaxEl.addEventListener('change', ()=> {
  let v = clamp(Number(priceMaxEl.value || 0), Number(rangeEl.min), Number(rangeEl.max));
  rangeEl.value = v; rangeValueEl.textContent = '$' + v; filterAndRender();
});
priceMinEl.addEventListener('change', ()=> filterAndRender());

// responsive hamburger
hamburger.addEventListener('click', ()=> {
  if(nav.style.display === 'block'){ nav.style.display=''; } else { nav.style.display='block'; }
});

// theme toggle
themeToggle.addEventListener('click', ()=> {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  localStorage.setItem('thrift_theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
});

// review form
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
reviewForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('reviewName').value.trim();
  const rating = document.getElementById('reviewRating').value;
  const text = document.getElementById('reviewText').value.trim();
  if(!name || !text) return;
  const article = document.createElement('article');
  article.className = 'review';
  article.innerHTML = `<div class="review-header"><strong>${name}</strong><span class="stars">${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span></div><p>${text}</p>`;
  reviewsList.prepend(article);
  reviewForm.reset();
});

// core filtering + sorting + rendering
function filterAndRender(){
  const q = searchInput.value.trim().toLowerCase();
  const pressed = document.querySelector('.filter-btn[aria-pressed="true"]')?.dataset.cat || 'all';
  const min = Number(priceMinEl.value || 0);
  const max = Number(priceMaxEl.value || rangeEl.value || 9999);
  let list = PRODUCTS.filter(p => {
    if(pressed !== 'all' && p.cat !== pressed) return false;
    if(q && !p.title.toLowerCase().includes(q)) return false;
    if(p.price < min || p.price > max) return false;
    return true;
  });
  const sort = sortEl.value;
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  else if(sort === 'name') list.sort((a,b)=>a.title.localeCompare(b.title));
  else if(sort === 'rating') list.sort((a,b)=>b.rating - a.rating);

  // smooth fade: apply opacity 0 then render and fade in
  productsEl.style.opacity = 0;
  setTimeout(()=>{ renderProducts(list); productsEl.style.transition='opacity .28s'; productsEl.style.opacity=1; }, 120);
}

// initial
function init(){
  // set defaults for price inputs
  const maxP = Math.max(...PRODUCTS.map(p=>p.price), 100);
  rangeEl.max = Math.ceil(maxP + 20);
  rangeEl.value = Math.ceil(maxP);
  rangeValueEl.textContent = '$' + rangeEl.value;
  priceMinEl.value = 0;
  priceMaxEl.value = rangeEl.value;

  updateCartUI();
  filterAndRender();

  // global keyboard
  document.addEventListener('keydown', (e)=> {
    if(e.key === 'Escape'){ closeModal(); closeCart(); suggestionsEl.classList.remove('show'); }
  });
}
document.addEventListener('DOMContentLoaded', init);