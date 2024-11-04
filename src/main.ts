import 'bootstrap/dist/css/bootstrap.min.css';


interface Product {
  id: number;
  rating: number;
  status: string;
}

const API_URL = 'https://retoolapi.dev/fq3s6o/data'; 

const productTableBody = document.querySelector('#productTable tbody') as HTMLTableSectionElement;
const ratingInput = document.getElementById('ratingInput') as HTMLInputElement;
const statusInput = document.getElementById('statusInput') as HTMLInputElement;
const addProductButton = document.getElementById('addProductButton') as HTMLButtonElement;

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Nem sikerült betölteni az adatokat.");
  }
  return response.json();
}

// Új termék hozzáadása az API-hoz
async function addProduct(product: Omit<Product, 'id'>) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error("Nem sikerült hozzáadni az adatot.");
  }
}

// Termék törlése az API-ról
async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error("Nem sikerült törölni az adatot.");
  }
}

// Táblázat feltöltése
async function loadProducts() {
  try {
    const products = await fetchProducts();
    renderTable(products);
  } catch (error) {
    console.error(error);
  }
}

// Táblázat frissítése és termékek megjelenítése
function renderTable(products: Product[]) {
  productTableBody.innerHTML = ''; // táblázat kiürítése
  products.sort((a, b) => a.rating - b.rating); // rendezés értékelés szerint

  products.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.rating}</td>
      <td>${product.status}</td>
      <td><button data-id="${product.id}" class="delete-button">Törlés</button></td>
    `;

    productTableBody.appendChild(row);
  });

  // Törlés gombok kezelése
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((button) =>
    button.addEventListener('click', async (event) => {
      const target = event.target as HTMLButtonElement;
      const id = parseInt(target.getAttribute('data-id')!, 10);
      await deleteProduct(id);
      loadProducts();
    })
  );
}

// Új termék hozzáadása
addProductButton.addEventListener('click', async () => {
  const rating = parseInt(ratingInput.value, 10);
  const status = statusInput.value;

  // Értékek ellenőrzése
  if (isNaN(rating) || rating < 1 || rating > 5 || status.trim() === '') {
    alert('Érvénytelen értékek! Értékelés: 1-5, Státusz: nem lehet üres.');
    return;
  }

  // Új termék hozzáadása
  await addProduct({ rating, status });
  loadProducts();

  // Input mezők kiürítése
  ratingInput.value = '';
  statusInput.value = '';
});

// Alkalmazás inicializálása
loadProducts();
