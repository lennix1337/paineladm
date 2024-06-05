const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

// Configuração do multer para armazenamento de arquivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Criar pasta de uploads se não existir
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Servindo arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.post('/v1/categories', upload.single('image'), (req, res) => {
    const name = req.body.name;
    const image = req.file ? req.file.filename : null;

    // Aqui você pode adicionar o código para salvar a categoria no banco de dados

    res.json({ message: 'Categoria cadastrada com sucesso!', name, image });
});

app.post('/v1/products', upload.single('image'), (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    // Aqui você pode adicionar o código para salvar o produto no banco de dados

    res.json({ message: 'Produto cadastrado com sucesso!', name, description, price, image });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
