document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Simulação de autenticação
            if (username === 'admin' && password === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                alert('Usuário ou senha incorretos.');
            }
        });
    }
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

const produtoForm = document.getElementById('produtoForm');
if (produtoForm) {
    produtoForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const price = document.getElementById('productPrice').value;
        const imageFile = document.getElementById('productImage').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:3000/v1/products', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Produto cadastrado com sucesso!');
            } else {
                alert('Erro ao cadastrar produto.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        }
    });
}

const categoriaForm = document.getElementById('categoriaForm');
if (categoriaForm) {
    categoriaForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('categoryName').value;
        const imageFile = document.getElementById('categoryImage').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', imageFile);

        try {
            const response = await fetch('http://localhost:3000/v1/categories', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Categoria cadastrada com sucesso!');
            } else {
                alert('Erro ao cadastrar categoria.');
            }
        } catch (error) {
            alert('Erro ao conectar com o servidor.');
        }
    });
}

const bannerForm = document.getElementById('bannerForm');
if (bannerForm) {
    bannerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Banner cadastrado com sucesso!');
    });
}
