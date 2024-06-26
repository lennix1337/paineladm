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
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    sessionStorage.setItem('lastSection', sectionId);

    if (sectionId === 'listarProdutos') {
        fetchProducts();
    } else if (sectionId === 'listarCategorias') {
        fetchCategories();
    }
}

const produtoForm = document.getElementById('produtoForm');
if (produtoForm) {
    produtoForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const title = document.getElementById('productTitle').value;
        const description = document.getElementById('productDescription').value;
        const originalPrice = document.getElementById('productOriginalPrice').value;
        const sellingPrice = document.getElementById('productSellingPrice').value;
        const imageFile = document.getElementById('productImage').files[0];

        const productData = {
            title: title,
            description: description,
            images: [], // As URLs das imagens serão gerenciadas separadamente
            variants: [],
            options: []
        };

        try {
            const productResponse = await fetch('https://rfcc.azurewebsites.net/v1/products', {
                method: 'POST',
                body: JSON.stringify(productData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (productResponse.ok) {
                const createdProduct = await productResponse.json();

                const variantData = {
                    productId: createdProduct.id,
                    originalPrice: parseFloat(originalPrice),
                    sellingPrice: parseFloat(sellingPrice),
                    title: title,
                    image: imageFile.name // Assumindo que o arquivo da imagem será gerenciado separadamente
                };

                const variantResponse = await fetch('https://rfcc.azurewebsites.net/v1/productVariant', {
                    method: 'POST',
                    body: JSON.stringify(variantData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (variantResponse.ok) {
                    alert('Produto e variação cadastrados com sucesso!');
                    fetchProducts();
                } else {
                    alert('Erro ao cadastrar variação do produto.');
                }
            } else {
                const errorData = await productResponse.json();
                alert('Erro ao cadastrar produto: ' + errorData.message);
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        }
    });
}

const categoriaForm = document.getElementById('categoriaForm');
if (categoriaForm) {
    categoriaForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('categoryName').value;
        const imageFile = document.getElementById('categoryImage').files[0];

        const categoryData = {
            name: name,
            values: [],
            productId: 0 // Ajuste conforme necessário
        };

        try {
            const response = await fetch('https://rfcc.azurewebsites.net/v1/categories', {
                method: 'POST',
                body: JSON.stringify(categoryData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Categoria cadastrada com sucesso!');
                fetchCategories();
            } else {
                const errorData = await response.json();
                alert('Erro ao cadastrar categoria: ' + errorData.message);
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        }
    });
}

const bannerForm = document.getElementById('bannerForm');
if (bannerForm) {
    bannerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Banner cadastrado com sucesso!');
    });
}

async function fetchProducts() {
    try {
        const response = await fetch('https://rfcc.azurewebsites.net/v1/products');
        const products = await response.json();
        const productList = document.getElementById('productList').querySelector('tbody');
        const productMessage = document.getElementById('productMessage');

        productList.innerHTML = '';
        if (products === "Não há produtos cadastrados") {
            productMessage.classList.remove('hidden');
        } else {
            productMessage.classList.add('hidden');
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.variants[0].originalPrice}</td>
                    <td>${product.variants[0].sellingPrice}</td>
                    <td><img src="uploads/${product.variants[0].image}" alt="${product.title}" width="50"></td>
                `;
                productList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

async function fetchCategories() {
    try {
        const response = await fetch('https://rfcc.azurewebsites.net/v1/categories');
        const categories = await response.json();
        const categoryList = document.getElementById('categoryList').querySelector('tbody');
        const categoryMessage = document.getElementById('categoryMessage');

        categoryList.innerHTML = '';
        if (categories === "Não há categorias cadastradas") {
            categoryMessage.classList.remove('hidden');
        } else {
            categoryMessage.classList.add('hidden');
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.name}</td>
                    <td><img src="uploads/${category.image}" alt="${category.name}" width="50"></td>
                `;
                categoryList.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
    }
}