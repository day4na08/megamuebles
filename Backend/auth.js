const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const md5 = require('md5');
const cors = require('cors');

// Conexión a la base de datos
const conexion = mysql.createConnection({
    host: "localhost",
    database: "megamueblesdb",
    user: "root",
    password: ""
});

conexion.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("Conexión a la base de datos exitosa");
    }
});

// Configuración de la app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Ruta de registro
app.post('/register', (req, res) => {
    const { username, apellido, email, password, role } = req.body;
    
    // Verificar si el email ya existe
    const checkUserQuery = 'SELECT * FROM Usuarios WHERE email = ?';
    conexion.query(checkUserQuery, [email], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).send('El correo electrónico ya está en uso');
        }
        
        // Si no existe, insertar el nuevo usuario
        const hashedPassword = md5(password);
        const insertUserQuery = 'INSERT INTO Usuarios (username, apellido, email, contrasena, role) VALUES (?, ?, ?, ?, ?)';
        conexion.query(insertUserQuery, [username, apellido, email, hashedPassword, role], (err) => {
            if (err) throw err;
            res.send('Usuario registrado con éxito');
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
//agregar muebles
app.post('/api/productos', (req, res) => {
    const { name, material, estilo, precio, cantidad, descripcion } = req.body;
    const userId = req.user.id;  // Obtenido del usuario autenticado
    const username = req.user.username; // Obtenido del usuario autenticado

    const nuevoProducto = {
        name,
        material,
        estilo,
        precio,
        cantidad,
        descripcion,
        autor: username,  // El username del usuario
        userId: userId,   // El id del usuario
        imagen1: req.body.imagen1,
        imagen2: req.body.imagen2,
        imagen3: req.body.imagen3,
        imagen4: req.body.imagen4,
        imagen5: req.body.imagen5
    };

    conexion.query('INSERT INTO Productos SET ?', nuevoProducto, (err, result) => {
        if (err) throw err;
        res.send('Producto agregado con éxito');
    });
});

// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
