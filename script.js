const products = [
    { id: 1, title: 'Tie-Dye Lounge Set', price: 150, image: 'assets/Photos/photo1.jpg' },
    { id: 2, title: 'Sunburst Tracksuit', price: 150, image: 'assets/Photos/photo2.jpg' },
    { id: 3, title: 'Retro Red Streetwear', price: 150, image: 'assets/Photos/photo3.jpg' },
    { id: 4, title: 'Urban Sportwear Combo', price: 150, image: 'assets/Photos/photo4.jpg' },
    { id: 5, title: 'Oversized Knit & Coat', price: 150, image: 'assets/Photos/photo6.jpg' },
    { id: 6, title: 'Chic Monochrome Blazer', price: 150, image: 'assets/Photos/photo7.jpg' },
];

const selectedProducts = new Map();
const maxRequired = 3;

const productGrid = document.getElementById('product-grid');
const selectedList = document.getElementById('selected-products');
const progressBar = document.getElementById('progress-bar');
const subtotalText = document.getElementById('subtotal');
const discountText = document.getElementById('discount');
const ctaButton = document.getElementById('cta-button');

// product cards
products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
    <div class="image-container">
      <img src="${product.image}" alt="${product.title}" class="product-image" />
    </div>
    <div class="details">
      <p class="product-title">${product.title}</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="add-to-bundle" data-id="${product.id}">
        <span class="btn-label">Add to Bundle</span>
        <span class="btn-icon">
          <img src="assets/Icons/plus.svg" alt="add" width="14" height="14" />
        </span>
      </button>
    </div>
  `;
    productGrid.appendChild(card);
});

// Handle add/remove toggle
productGrid.addEventListener('click', e => {
    const button = e.target.closest('.add-to-bundle');
    if (!button) return;

    const id = parseInt(button.dataset.id);
    const product = products.find(p => p.id === id);

    if (selectedProducts.has(id)) {
        selectedProducts.delete(id);
        button.classList.remove('selected');
        button.querySelector('.btn-label').textContent = 'Add to Bundle';
        button.querySelector('.btn-icon').innerHTML = `
      <img src="assets/Icons/plus.svg" alt="add" width="14" height="14" />
    `;
    } else {
        selectedProducts.set(id, { ...product, quantity: 1 });
        button.classList.add('selected');
        button.querySelector('.btn-label').textContent = 'Added to Bundle';
        button.querySelector('.btn-icon').innerHTML = `
      <img src="assets/Icons/Check.svg" alt="check" width="16" height="16" />
    `;
    }

    updateSidebar();
});

// Update sidebar display
function updateSidebar() {
    selectedList.innerHTML = '';
    let totalQty = 0, total = 0;

    selectedProducts.forEach((product, id) => {
        totalQty += product.quantity;
        total += product.price * product.quantity;

        const item = document.createElement('div');
        item.className = 'selected-item';
        item.innerHTML = `
      <div class="selected-info">
        <img src="${product.image}" alt="${product.title}" />
        <div class="info">
          <p>${product.title}</p>
          <p>$${product.price.toFixed(2)}</p>
          <div class="stepper-row">
            <div class="stepper">
              <button data-id="${id}" class="decrease">−</button>
              <span>${product.quantity}</span>
              <button data-id="${id}" class="increase">+</button>
            </div>
                <button data-id="${id}" class="remove-btn">🗑</button>
          </div>
        </div>
      </div>
    `;
        selectedList.appendChild(item);
    });

    const discount = totalQty >=1? total * 0.3 : 0;
    const subtotal = total - discount;

    discountText.textContent = `- $${discount.toFixed(2)}(30%)`;
    subtotalText.textContent = `$${subtotal.toFixed(2)}`;
    progressBar.style.width = `${Math.min((totalQty / maxRequired) * 100, 100)}%`;
    ctaButton.disabled = totalQty < 3;
}

// Stepper and Delete Button logic
selectedList.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button) return;

    const id = parseInt(button.dataset.id);
    if (!selectedProducts.has(id)) return;

    const product = selectedProducts.get(id);

    if (button.classList.contains('increase')) {
        product.quantity++;
    } else if (button.classList.contains('decrease')) {
        product.quantity--;
        if (product.quantity <= 0) {
            selectedProducts.delete(id);
        }
    } else if (button.classList.contains('remove-btn')) {
        selectedProducts.delete(id);
    }

    const btn = document.querySelector(`.add-to-bundle[data-id="${id}"]`);
    if (btn && !selectedProducts.has(id)) {
        btn.classList.remove('selected');
        btn.querySelector('.btn-label').textContent = 'Add to Bundle';
        btn.querySelector('.btn-icon').innerHTML = `
      <img src="assets/Icons/plus.svg" alt="add" width="14" height="14" />
    `;
    }

    updateSidebar();
});

// CTA submit
ctaButton.addEventListener('click', () => {
    console.log('Submitted:', [...selectedProducts.values()]);
    alert('Bundle submitted! Check console.');
});
