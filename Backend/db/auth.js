const express = require('express');
const app = express();
const mysql = require('mysql');
const md5 = require('md5');
const cors = require('cors');

app.use(express.json());
app.use(cors());

const conexion = mysql.createConnection({
    host:"localhost",
    database:"megamueblesdb",
    user:"root",
    password: ""
});

conexion.connect(err => {
    if (err) {
        console.error("Error de conexión: ", err);
        return;
    }
    console.log("Conexión a la base de datos exitosa");
});


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
app.post('/productos', (req, res) => {
    const name  = req.body.name 
    const material = req.body.material
    const estilo = req.body.estilo
    const tela = req.body.tela
    const acabado = req.body.acabado
    const color = req.body.color
    const tapizMaterial = req.body.tapizMaterial
    const materialInterno = req.body.materialInterno
    const precio = req.body.precio
    const descripcion = req.body.descripcion
    const requiereArmado = req.body.requiereArmado
    const alto = req.body.alto
    const ancho = req.body.ancho
    const profundidad = req.body.profundidad
    const pesoNeto = req.body.pesoNeto
    const cantidad = req.body.cantidad
    const autor = req.body.autor
    const imagen1 = req.body.imagen1
    const imagen2 = req.body.imagen2
    const imagen3 = req.body.imagen3
    const imagen4 = req.body.imagen4
    const imagen3D = req.body.imagen3D

    conexion.query('INSERT INTO productos (name, material, estilo, tela, acabado, color, tapizMaterial, materialInterno, precio, descripcion, requiereArmado, alto, ancho, profundidad, pesoNeto, cantidad, autor, imagen1, imagen2, imagen3, imagen4, imagen3D) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [name, material, estilo, tela, acabado, color, tapizMaterial, materialInterno, precio, descripcion, requiereArmado, alto, ancho, profundidad, pesoNeto, cantidad, autor, imagen1, imagen2, imagen3, imagen4, imagen3D],
    (err,result)=>{
        if(err){
            console.log(err);

        }else{
            res.send("Mueble agregado satisfactoriamente :))");
        }
    }
    );
});

//leer productos :)
app.get("/llamarProductos",(req,res)=>{

    conexion.query('SELECT * FROM productos',
        (err,result)=>{
            if(err){
                console.log(err);

            }else{
                res.send(result)
            }
        }
    )    
})

// Ruta para agregar un nuevo producto2
app.post('/productos2', (req, res) => {
    const { name, material, color, precio, descripcion, imagen3D } = req.body;

    conexion.query(
        'INSERT INTO productos2 (name, material, color, precio, descripcion, imagen3D) VALUES (?, ?, ?, ?, ?, ?)',
        [name, material, color, precio, descripcion, imagen3D],
        (err, result) => {
            if (err) {
                console.log("Error al agregar el mueble:", err);
                res.status(500).send("Error en el servidor");
            } else {
                res.send("Mueble agregado satisfactoriamente :))");
            }
        }
    );
});

// Inicia el servidor
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
