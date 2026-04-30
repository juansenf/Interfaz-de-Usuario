const screens = {
  intro: document.getElementById('intro-screen'),
  menu: document.getElementById('menu-screen'),
  checkout: document.getElementById('checkout-screen'),
  confirmation: document.getElementById('confirmation-screen')
};
const orderList = document.getElementById('order-list');
const checkoutList = document.getElementById('checkout-list');
const orderTotal = document.getElementById('order-total');
const checkoutTotal = document.getElementById('checkout-total');
const paymentChoice = document.getElementById('payment-choice');
const menuTargetText = document.getElementById('menu-target-text');
const sizeChoice = document.getElementById('size-choice');
const errorBox = document.getElementById('error-box');
const errorText = document.getElementById('error-text');
const feedbackBox = document.getElementById('feedback-box');
const feedbackText = document.getElementById('feedback-text');
const confirmationDetail = document.getElementById('confirmation-detail');
const discountLabel = document.getElementById('discount-label');
const sizeButtons = document.querySelectorAll('.size-button');
const optionGrid = document.getElementById('option-grid');
const powerupLegend = document.getElementById('powerup-legend');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modal-text');
const modalClose = document.getElementById('modal-close');
const ingredientsLegend = document.getElementById('ingredients-legend');

const sizePrices = {
  Chica: 80,
  Mediana: 100,
  Grande: 120,
  Familiar: 150
};

const humanOptions = [
  { name: 'Queso Muzzarella', price: 100, forbidden: false, icon: '🧀' },
  { name: 'Pepperoni', price: 130, forbidden: true, icon: '🫘' },
  { name: 'Provolone', price: 140, forbidden: false, icon: '🧀' },
  { name: 'Aceitunas', price: 90, forbidden: true, icon: '🫒' },
  { name: 'Bacon', price: 120, forbidden: false, icon: '🥓️' },
  { name: 'Morrón', price: 80, forbidden: false, icon: '🌶️' }
];

const alienBenefits = [
  { name: 'Recuperá 30% de energía celular en 15 minutos.', price: 50, forbidden: false, icon: '⚡' },
  { name: 'Recuperá 50% de energía celular en 30 minutos.', price: 70, forbidden: false, icon: '✨' },
  { name: 'Recuperá 80% de energía celular en 45 minutos.', price: 100, forbidden: false, icon: '🌌' }
];

const alienOptions = [
  { name: 'Roca Espacial', price: 140, forbidden: false, icon: '🪨' },
  { name: 'Bebida Metano', price: 120, forbidden: false, icon: '🛢️' },
  { name: 'Pepperoni', price: 130, forbidden: true, icon: '🫘' },
  { name: 'Aceitunas', price: 90, forbidden: true, icon: '🫒' },
  { name: 'Salsa Solar', price: 80, forbidden: false, icon: '🌶️' }
];

const alienForbidden = ['Pepperoni', 'Aceitunas'];


let orderItems = [];
let selectedPayment = null;
let species = 'humano';
let discount = 1;
let selectedSize = null;
let selectedSizePrice = 0;

function showScreen(name) {
  Object.values(screens).forEach((section) => section.classList.remove('active'));
  screens[name].classList.add('active');
}

function updateMenuTargetText() {
  if (species === 'alien') {
    menuTargetText.textContent = 'Recuperá energía celular.';
    discountLabel.textContent = 'Beneficio Alien: 50% OFF';
  } else {
    menuTargetText.textContent = 'Pizza sabrosa y caliente.';
    discountLabel.textContent = 'Descuento Alien: 50%';
  }
}

function setSpecies(value) {
  species = value;
  discount = value === 'alien' ? 0.5 : 1;
  discountLabel.style.display = value === 'alien' ? 'inline-block' : 'none';
  updateMenuTargetText();
  hideError();
  if (value === 'alien') {
    powerupLegend.classList.remove('hidden');
  } else {
    powerupLegend.classList.add('hidden');
  }
  renderOptions();
  showScreen('menu');
}

function selectSize(name, price, button) {
  selectedSize = name;
  selectedSizePrice = price;
  sizeButtons.forEach((b) => b.classList.toggle('selected', b === button));
  sizeChoice.textContent = `Tamaño seleccionado: ${name}`;
  hideError();
  updateOrderDisplay();
}

function formatPrice(price) {
  return price.toFixed(0);
}

function updateOrderDisplay() {
  orderList.innerHTML = '';
  const base = selectedSizePrice;
  const ingredientsTotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = (base + ingredientsTotal) * discount;

  if (selectedSize) {
    const sizeItem = document.createElement('li');
    sizeItem.className = 'order-item';
    sizeItem.innerHTML = `
      <div>
        <strong>Tamaño</strong><br />
        ${selectedSize} · Base: ${formatPrice(base)} créditos
      </div>`;
    orderList.appendChild(sizeItem);
  }

  orderItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `
      <div>
        <strong>${item.name}</strong><br />
        Precio: ${formatPrice(item.price)} créditos
      </div>
      <div class="item-actions">
        <button class="item-button" data-index="${index}">Quitar</button>
      </div>`;
    orderList.appendChild(li);
  });
  orderTotal.textContent = formatPrice(total);
}

function updateCheckoutDisplay() {
  checkoutList.innerHTML = '';
  const base = selectedSizePrice;
  const ingredientsTotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const total = (base + ingredientsTotal) * discount;

  if (selectedSize) {
    const sizeItem = document.createElement('li');
    sizeItem.className = 'order-item';
    sizeItem.innerHTML = `
      <div>
        <strong>Tamaño</strong><br />
        ${selectedSize} · Base: ${formatPrice(base)} créditos
      </div>`;
    checkoutList.appendChild(sizeItem);
  }

  orderItems.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `<div><strong>${item.name}</strong><br />Precio: ${formatPrice(item.price)} créditos</div>`;
    checkoutList.appendChild(li);
  });
  checkoutTotal.textContent = formatPrice(total);
}

function showError(message) {
  errorText.textContent = `ERROR: ${message}`;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}

function showFeedback(message) {
  feedbackText.textContent = message;
  feedbackBox.classList.remove('hidden');
}

function hideFeedback() {
  feedbackBox.classList.add('hidden');
}

function showModal(message) {
  modalText.textContent = message;
  modal.classList.remove('hidden');
}

function hideModal() {
  modal.classList.add('hidden');
}

function flashForbidden(button) {
  if (!button) return;
  button.classList.add('forbidden');
  setTimeout(() => button.classList.remove('forbidden'), 600);
}

function addItem(name, price, forbidden, button) {
  if (!selectedSize) {
    showError('elige el tamaño de pizza primero');
    return;
  }
  hideError();
  hideFeedback();

  if (species === 'alien' && forbidden) {
    showModal('ERROR: INGREDIENTE PROHIBIDO');
    flashForbidden(button);
    return;
  }
  orderItems.push({ name, price });
  updateOrderDisplay();
}

function renderOptions() {
  optionGrid.innerHTML = '';

  if (species === 'alien') {
    // Botones de beneficios
    alienBenefits.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'big-button menu-button';
      button.dataset.name = option.name;
      button.dataset.price = option.price;
      if (option.forbidden) button.dataset.forbidden = 'true';
      button.innerHTML = `<span class="icon-large">${option.icon}</span><span class="button-text">${option.name}</span>`;
      optionGrid.appendChild(button);
    });

    // Leyenda para Ingredientes
    const ingredientsLegend = document.createElement('h3');
    ingredientsLegend.textContent = 'Sumá Ingredientes';
    ingredientsLegend.className = 'legend';
    optionGrid.appendChild(ingredientsLegend);

    // Botones de opciones alien
    alienOptions.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'big-button menu-button';
      button.dataset.name = option.name;
      button.dataset.price = option.price;
      if (option.forbidden) button.dataset.forbidden = 'true';
      button.innerHTML = `<span class="icon-large">${option.icon}</span><span class="button-text">${option.name}</span>`;
      optionGrid.appendChild(button);
    });
  } else {
    // Leyenda para Ingredientes
    const ingredientsLegend = document.createElement('h3');
    ingredientsLegend.textContent = 'Sumá Ingredientes';
    ingredientsLegend.className = 'legend';
    optionGrid.appendChild(ingredientsLegend);

    // Botones de opciones humanas
    humanOptions.forEach((option) => {
      const button = document.createElement('button');
      button.className = 'big-button menu-button';
      button.dataset.name = option.name;
      button.dataset.price = option.price;
      if (option.forbidden) button.dataset.forbidden = 'true';
      button.innerHTML = `<span class="icon-large">${option.icon}</span><span class="button-text">${option.name}</span>`;
      optionGrid.appendChild(button);
    });
  }
}




function removeItem(index) {
  orderItems.splice(index, 1);
  updateOrderDisplay();
}

function resetOrder() {
  orderItems = [];
  selectedPayment = null;
  selectedSize = null;
  selectedSizePrice = 0;
  paymentChoice.textContent = 'Método de pago: ninguno seleccionado';
  sizeChoice.textContent = 'Tamaño seleccionado: ninguno';
  sizeButtons.forEach((button) => button.classList.remove('selected'));
  updateMenuTargetText();
  hideError();
  hideFeedback();
  renderOptions();
  updateOrderDisplay();
}

function selectPayment(method) {
  selectedPayment = method;
  paymentChoice.textContent = `Método de pago: ${method}`;
  hideError();
}

function confirmOrder() {
  if (!selectedSize) {
    showError('falta elegir el tamaño de pizza');
    return;
  }
  if (orderItems.length === 0) {
    showError('tienes que agregar al menos un producto');
    return;
  }
  if (!selectedPayment) {
    showError('falta seleccionar el método de pago');
    return;
  }
  const total = (selectedSizePrice + orderItems.reduce((sum, item) => sum + item.price, 0)) * discount;
  confirmationDetail.textContent = `Especie: ${species === 'alien' ? 'Alien Zogtoniano' : 'Humano'} · Tamaño: ${selectedSize} · Total a pagar: ${formatPrice(total)} créditos · Pago con ${selectedPayment}.`;
  showScreen('confirmation');
}

function setupEventListeners() {
  document.querySelectorAll('[data-species]').forEach((button) => {
    button.addEventListener('click', () => setSpecies(button.dataset.species));
  });

  sizeButtons.forEach((button) => {
    button.addEventListener('click', () => selectSize(button.dataset.size, Number(button.dataset.price), button));
  });

  optionGrid.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    addItem(button.dataset.name, Number(button.dataset.price), button.dataset.forbidden === 'true', button);
  });

  orderList.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const index = Number(button.dataset.index);
    if (!Number.isNaN(index)) {
      removeItem(index);
    }
  });

  document.getElementById('go-checkout').addEventListener('click', () => {
    if (!selectedSize) {
      showError('elige el tamaño de pizza antes de continuar');
      return;
    }
    hideError();
    updateCheckoutDisplay();
    showScreen('checkout');
  });

  document.getElementById('reset-order').addEventListener('click', resetOrder);

  document.querySelectorAll('.payment-button').forEach((button) => {
    button.addEventListener('click', () => selectPayment(button.dataset.method));
  });

  document.getElementById('back-to-menu').addEventListener('click', () => {
    hideError();
    showScreen('menu');
  });

  modalClose.addEventListener('click', hideModal);

  document.getElementById('confirm-order').addEventListener('click', confirmOrder);
  document.getElementById('new-order').addEventListener('click', () => {
    resetOrder();
    showScreen('intro');
  });
}

setupEventListeners();
resetOrder();
