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
const confirmationDetail = document.getElementById('confirmation-detail');
const discountLabel = document.getElementById('discount-label');
const sizeButtons = document.querySelectorAll('.size-button');

const sizePrices = {
  Chica: 80,
  Mediana: 100,
  Grande: 120,
  Familiar: 150
};

const alienForbidden = ['Pepperoni Espacial', 'Aceitunas'];

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
  menuTargetText.textContent = species === 'alien'
    ? 'Recuperá energía celular en 30 minutos.'
    : 'Pizza sabrosa y caliente.';
}

function setSpecies(value) {
  species = value;
  discount = value === 'alien' ? 0.5 : 1;
  discountLabel.style.display = value === 'alien' ? 'inline-block' : 'none';
  updateMenuTargetText();
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
  if (species === 'alien' && forbidden) {
    showError('ingrediente prohibido para tu especie');
    flashForbidden(button);
    return;
  }
  orderItems.push({ name, price });
  updateOrderDisplay();
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

  document.querySelectorAll('.menu-button').forEach((button) => {
    button.addEventListener('click', () => addItem(button.dataset.name, Number(button.dataset.price), button.dataset.forbidden === 'true', button));
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

  document.getElementById('confirm-order').addEventListener('click', confirmOrder);
  document.getElementById('new-order').addEventListener('click', () => {
    resetOrder();
    showScreen('intro');
  });
}

setupEventListeners();
resetOrder();
