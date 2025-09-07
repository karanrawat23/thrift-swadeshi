/* Lightweight product renderer with placeholder images so UI shows immediately */
const PRODUCTS = [
  { id:1, title:"Men's Tracksuit",        price:"$49", img: "https://picsum.photos/seed/tracksuit/800/600" },
  { id:2, title:"Windbreaker Jacket",     price:"$59", img: "https://picsum.photos/seed/windbreaker/800/600" },
  { id:3, title:"Running Shorts",         price:"$22", img: "https://picsum.photos/seed/shorts/800/600" },
  { id:4, title:"Performance Gym Tee",    price:"$18", img: "https://picsum.photos/seed/gymtee/800/600" },
  { id:5, title:"Training Sneakers",      price:"$79", img: "https://picsum.photos/seed/sneakers/800/600" },
  { id:6, title:"Sports Cap",             price:"$12", img: "https://picsum.photos/seed/cap/800/600" }
];

const productsEl = document.getElementById('products');
const template = document.getElementById('product-template');
const searchInput = document.getElementById('search');
const cartCountEl = document.getElementById('cartCount');

let cart = [];

function renderProducts(list){
  productsEl.innerHTML = '';
  list.forEach(p=>{
    const node = template.content.cloneNode(true);
    node.querySelector('.card-img').src = p.img;
    node.querySelector('.card-img').alt = p.title;
    node.querySelector('.card-title').textContent = p.title;
    node.querySelector('.card-price').textContent = p.price;
    const btn = node.querySelector('.add-btn');
    btn.addEventListener('click', ()=> addToCart(p));
    productsEl.appendChild(node);
  });
}

function addToCart(product){
  cart.push(product);
  cartCountEl.textContent = cart.length;
  const orig = document.querySelector('.cart-btn');
  if (orig?.animate) {
    orig.animate([{ transform: 'scale(1)' },{ transform: 'scale(1.06)' },{ transform: 'scale(1)' }], { duration: 260 });
  }
}

searchInput?.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  if(!q) renderProducts(PRODUCTS);
  else renderProducts(PRODUCTS.filter(p=> p.title.toLowerCase().includes(q)));
});

function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProducts(PRODUCTS);
}

document.addEventListener('DOMContentLoaded', init);