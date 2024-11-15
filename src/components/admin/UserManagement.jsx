import React, { useState, useEffect } from 'react';
import Axios from "axios";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


function UserManagement() {
  const [username, setUsername] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [role, setRole] = useState("");
  const [usuariosList, setUsuarios] = useState([]);
  const [editar, setEditar] = useState (false);
  const [id, setId]= useState([]);
  const [eliminar, setEliminar] = useState ([]);
  const noti = withReactContent(Swal)



  const addUser = () => {
    Axios.post("http://localhost:3001/createUser", {
      username: username,
      apellido: apellido,
      email: email,
      contrasena: contrasena,
      role: role
    }).then(() => {
      getRegistrados();
      alert("Usuario registrado");
    });
  }


  
  const usuarioDelete = (val) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: "Estas seguro?",
      html: "<p>Quieres eliminar el mueble <strong>"+ val.username +"</strong>?</p>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      reverseButtons: true   
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/deleteUser/${val.id}`).then(() => {
          getRegistrados(); // Recargar la lista de productos
            cancel(); // Cancelar cualquier acción adicional si es necesario
            noti.fire({
              title: "Eliminado!",
              html: "<p>El mueble <strong>"+val.username+"</strong> fue eliminado satisfactoriamente</p>",
              icon: "success",
              timer:3000
            });
          })
          .catch((error) => {
            console.error("Error eliminando producto:", error);
            Swal.fire("Error", "There was an issue deleting the product.", "error");
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelado",
          html: "<p>El mueble <strong>"+ val.username +"</strong> no fue eliminado</p>",
          icon: "error"
        });
      }
    });
  };
  
const cancel =()=> {
    setEditar(false)
    setUsername("");
    setApellido("");
    setEmail("");
    setContrasena("");
    setRole("");
    setId("")


}

const update =()=> {
    Axios.put("http://localhost:3001/updateUser",{
    id:id,
    username:username,
    apellido:apellido,
    email:email,
    contrasena:contrasena,
    role:role
    }).then(()=>{
      getRegistrados();
    cancel();
    noti.fire({
        title: "Muy Bien!",
        text: "El mueble "+username+" fue actualizado  satisfactoriamente",
        icon: "success",
        timer: 3000
      });
})
}
const editarUsuario =(val)=>{
    setEditar(true)

    setUsername(val.username);
    setApellido(val.apellido);
    setEmail(val.email);
    setContrasena(val.contrasena);
    setRole(val.role);
    setId(val.id);
    
}


  const getRegistrados = () => {
    Axios.get("http://localhost:3001/registrados").then((response) => {
      setUsuarios(response.data);
    });
  }
  useEffect(() => {
    getRegistrados(); // Llama la lista de productos cuando el componente carga
}, []);

  return (
    <div className="container">
         

        <div className="card text-center" style={{ maxWidth: '400px', margin: '0 auto', padding: '0px' }}>
          <div className="card-header">
            <h5 className="mb-0">Gestión de usuarios</h5>
          </div>

          <div className="card-body">
            <div className="input-group mb-3">
              <span className="input-group-text" style={{ width: '120px', justifyContent: 'center' }}>Nombre</span>
              <input 
                type="text"
                onChange={(event) => setUsername(event.target.value)}
                className="form-control" 
                placeholder="Ingrese un nombre" 
                aria-label="Username" 
                style={{ height: '45px', minWidth: '240px' }}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" style={{ width: '120px', justifyContent: 'center' }}>Apellido</span>
              <input 
                type="text"
                onChange={(event) => setApellido(event.target.value)}
                className="form-control" 
                placeholder="Ingrese un apellido" 
                aria-label="Apellido" 
                style={{ height: '45px', minWidth: '240px' }}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" style={{ width: '120px', justifyContent: 'center' }}>Email</span>
              <input 
                type="email"
                onChange={(event) => setEmail(event.target.value)}
                className="form-control"
                placeholder="Ingrese un email"
                style={{ height: '45px', minWidth: '240px' }}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" style={{ width: '120px', justifyContent: 'center' }}>Contraseña</span>
              <input 
                type="password"
                onChange={(event) => setContrasena(event.target.value)}
                className="form-control"
                placeholder="Ingrese una contraseña"
                style={{ height: '45px', minWidth: '240px' }}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text" style={{ width: '120px', justifyContent: 'center' }}>Role</span>
              <input 
                type="text"
                onChange={(event) => setRole(event.target.value)}
                className="form-control"
                placeholder="Ingrese un rol"
                style={{ height: '45px', minWidth: '240px' }}
              />
            </div>
          </div>
          <div className="card-footer">
                {
                    editar? 
                    <div> 
                        <button onClick={update}>actualizar</button>
                        <button onClick={cancel}>cancelar</button>
                    </div>
                    :<button onClick={addUser}>Registar</button>
                }

                </div>



      <table class="table table-striped">
          <thead> 
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Email</th>
              <th scope="col">Contraseña</th>
              <th scope="col">Rol</th>
            </tr>
          </thead>
          <tbody>

          {usuariosList.map((val, key) => (
           
           <tr key={val.id}>
           <th scope="row">{val.id}</th>
           <td>{val.username}</td>
           <td>{val.apellido}</td>
           <td>{val.email}</td>
           <td>{val.contrasena}</td>
           <td>{val.role}</td>
           <td>                
              <button onClick={()=>{
               editarUsuario(val)
               }}>editar</button>

              <button onClick={()=>{
               usuarioDelete(val);
               }}>Eliminar</button>
          </td>
         </tr>
          ))}

           
            
          </tbody>
          </table>                
          </div> 

    </div>
  );
}

export default UserManagement;