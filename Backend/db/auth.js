const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const md5 = require('md5');
const cors = require('cors');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "megamueblesdb",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
});

conexion.connect(err => {
    if (err) {
        console.error("Error de conexión: ", err);
        return;
    }
    console.log("Conexión a la base de datos exitosa");
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
// Ruta de registro
app.post('/register', (req, res) => {
    const { username, apellido, email, password, role } = req.body;

    // Verificar si el email ya existe
    const checkUserQuery = 'SELECT * FROM Usuarios WHERE email = ?';
    conexion.query(checkUserQuery, [email], (err, results) => {
        if (err) return res.status(500).send('Error en la base de datos');
        if (results.length > 0) {
            return res.status(400).send('El correo electrónico ya está en uso');
        }

        // Si no existe, insertar el nuevo usuario
        const hashedPassword = md5(password);
        const insertUserQuery = 'INSERT INTO Usuarios (username, apellido, email, contrasena, role) VALUES (?, ?, ?, ?, ?)';
        conexion.query(insertUserQuery, [username, apellido, email, hashedPassword, role], (err) => {
            if (err) return res.status(500).send('Error al registrar usuario');
            res.status(201).send('Usuario registrado con éxito');
        });
    });
});

// Ruta de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = md5(password);

    const query = 'SELECT * FROM Usuarios WHERE email = ? AND contrasena = ?';
    conexion.query(query, [email, hashedPassword], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            res.json({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).send('Correo electrónico o contraseña incorrectos');
        }
    });
});

// Ruta para obtener los datos del usuario por ID
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM Usuarios WHERE id = ?';
    conexion.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener los datos del usuario');
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});



// Ruta para agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const { 
        name, material, estilo, tela, acabado, color, tapizMaterial, 
        materialInterno, precio, descripcion, requiereArmado, alto, 
        ancho, profundidad, pesoNeto, cantidad, autor, userId,
        imagen1, imagen2, imagen3, imagen4, imagen5 
    } = req.body;

    // Validación básica
    if (!name || !precio || !cantidad) {
        return res.status(400).send('Faltan campos requeridos (nombre, precio, cantidad)');
    }

    const sql = `
        INSERT INTO productos 
        (name, material, estilo, tela, acabado, color, tapizMaterial, 
        materialInterno, precio, descripcion, requiereArmado, alto, 
        ancho, profundidad, pesoNeto, cantidad, autor, userId,
        imagen1, imagen2, imagen3, imagen4, imagen5)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        material || null,
        estilo || null,
        tela || null,
        acabado || null,
        color || null,
        tapizMaterial || null,
        materialInterno || null,
        precio ? parseFloat(precio) : 0,
        descripcion || null,
        requiereArmado || null,
        alto ? parseFloat(alto) : null,
        ancho ? parseFloat(ancho) : null,
        profundidad ? parseFloat(profundidad) : null,
        pesoNeto ? parseFloat(pesoNeto) : null,
        cantidad ? parseInt(cantidad) : 0,
        autor || null,
        userId || null,
        imagen1 || null,
        imagen2 || null,
        imagen3 || null,
        imagen4 || null,
        imagen5 || null
    ];

    conexion.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            return res.status(500).send('Error al agregar producto: ' + err.message);
        }
        res.status(201).json({
            message: 'Producto agregado con éxito',
            productId: result.insertId
        });
    });
});
// Ruta para obtener todos los productos
app.get('/api/productos', (req, res) => {
    const userId = req.query.userId;
    let query = 'SELECT * FROM productos';
    
    if (userId) {
        query += ' WHERE userId = ?';
        conexion.query(query, [userId], (err, results) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).send('Error al obtener productos');
            }
            res.json(results);
        });
    } else {
        conexion.query(query, (err, results) => {
            if (err) {
                console.error('Error al obtener productos:', err);
                return res.status(500).send('Error al obtener productos');
            }
            res.json(results);
        });
    }
});


// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
