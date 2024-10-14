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

// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
