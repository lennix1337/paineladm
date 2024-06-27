const API_BASE_URL = "https://rfcc.azurewebsites.net/v1";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/categories`;
const PRODUCT_VARIANTS_ENDPOINT = `${API_BASE_URL}/productVariant`;
const PRODUCT_OPTIONS_ENDPOINT = `${API_BASE_URL}/productOption`;

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Simulação de autenticação
      if (username === "admin" && password === "admin") {
        sessionStorage.setItem("authenticated", "true");
        window.location.href = "dashboard.html";
      } else {
        alert("Usuário ou senha incorretos.");
      }
    });
  }
});

function showSection(sectionId) {
  const sections = document.querySelectorAll("main section");
  sections.forEach((section) => section.classList.remove("active"));
  document.getElementById(sectionId).classList.add("active");

  sessionStorage.setItem("lastSection", sectionId);

  if (sectionId === "listarProdutos") {
    fetchProducts();
  } else if (sectionId === "listarCategorias") {
    fetchCategories();
  }
}

const produtoForm = document.getElementById("produtoForm");
if (produtoForm) {
  produtoForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("productTitle").value;
    const description = document.getElementById("productDescription").value;
    const originalPrice = document.getElementById("productOriginalPrice").value;
    const sellingPrice = document.getElementById("productSellingPrice").value;
    const imageFile = document.getElementById("productImage").files[0];
    const categoryId = document.getElementById("productCategory").value;

    try {
      const productData = new FormData();
      productData.append("Title",title);
      productData.append("Description",description);
      productData.append("Images",imageFile);
      productData.append("CategoryId",categoryId);
      
      const productResponse = await fetch(PRODUCTS_ENDPOINT, {
        method: "POST",
        body: productData,
      });

      if (productResponse.ok) {
        const createdProduct = await productResponse.json();

        const variantData = new FormData();
        variantData.append("ProductId",createdProduct.id);
        variantData.append("Title",title);
        variantData.append("OriginalPrice",originalPrice);
        variantData.append("SellingPrice",sellingPrice);
        variantData.append("Image",imageFile);

        const variantResponse = await fetch(PRODUCT_VARIANTS_ENDPOINT, {
          method: "POST",
          body: variantData,
        });

        if (variantResponse.ok) {
          alert("Produto e variação cadastrados com sucesso!");
          fetchProducts();
        } else {
          alert("Erro ao cadastrar variação do produto.");
        }
      } else {
        const errorData = await productResponse.json();
        alert("Erro ao cadastrar produto: " + errorData.message);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });
}

const categoriaForm = document.getElementById("categoriaForm");
if (categoriaForm) {
  categoriaForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("categoryName").value;
    const imageFile = document.getElementById("categoryImage").files[0];

    try {
      const categoryData = new FormData();
      categoryData.append("Name",name);
      categoryData.append("Image",imageFile);
      const response = await fetch(CATEGORIES_ENDPOINT, {
        method: "POST",
        body: categoryData
      });

      if (response.ok) {
        alert("Categoria cadastrada com sucesso!");
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert("Erro ao cadastrar categoria: " + errorData.message);
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor.");
    }
  });
}

async function fetchProducts() {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);
    const products = await response.json();
    const productList = document
      .getElementById("productList")
      .querySelector("tbody");
    const productMessage = document.getElementById("productMessage");

    productList.innerHTML = "";
    if (products.length === 0) {
      productMessage.classList.remove("hidden");
    } else {
      productMessage.classList.add("hidden");
      products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${product.title}</td>
                  <td>${product.description}</td>
                  <td>${product.variants[0]?.originalPrice || ""}</td>
                  <td>${product.variants[0]?.sellingPrice || ""}</td>
                  <td><img src="${product.images[0]}" alt="${
          product.title
        }" width="100"></td>
              `;
        productList.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(CATEGORIES_ENDPOINT);
    const categories = await response.json();
    const categoryList = document
      .getElementById("categoryList")
      .querySelector("tbody");
    const categoryMessage = document.getElementById("categoryMessage");

    categoryList.innerHTML = "";
    if (categories.length === 0) {
      categoryMessage.classList.remove("hidden");
    } else {
      categoryMessage.classList.add("hidden");
      categories.forEach((category) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                  <td>${category.name}</td>
                  <td><img src="${category.image}" alt="${category.name}" width="100"></td>
              `;
        categoryList.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
}

async function fetchCategoriesForm() {
  try {
      const response = await fetch(CATEGORIES_ENDPOINT);
      const categories = await response.json();
      const categorySelect = document.getElementById('productCategory');
      categorySelect.innerHTML = '';

      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
      });
  } catch (error) {
      console.error('Erro ao buscar categorias:', error);
  }
}

fetchCategoriesForm();