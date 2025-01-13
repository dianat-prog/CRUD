const express=require('express');
const app=express();
const PORT =3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usuarios = [
    { id: 1, nombre: 'Ryu', edad: 32, lugarProcedencia: 'Japón' },
    { id: 2, nombre: 'Chun-Li', edad: 29, lugarProcedencia: 'China' },
    { id: 3, nombre: 'Guile', edad: 35, lugarProcedencia: 'Estados Unidos' },
    { id: 4, nombre: 'Dhalsim', edad: 45, lugarProcedencia: 'India' },
    { id: 5, nombre: 'Blanka', edad: 32, lugarProcedencia: 'Brasil' },
];


// Endpoint --  Obtiene la lista de todos los usuarios.
app.get('/usuarios', (req, res) => {
    res.status(200).json(usuarios);
  });

  // Endpoint -- Crea un nuevo usuario.
  app.post('/usuarios', (req, res) => {
  
    const nuevoUsuario={
        id: usuarios.length + 1,
        nombre : req.body.nombre,
        edad : req.body.edad,
        lugarProcedencia : req.body.lugarProcedencia,
       };
       
    if ( !nuevoUsuario.nombre || !nuevoUsuario.edad || !nuevoUsuario.lugarProcedencia) {
        return res.status(400).json({ error: "Datos incompletos. Se requiere nombre, edad y lugar de procedencia." });
    }
  
    // Verificar que no exista un usuario con el mismo nombre
    const usuarioExistente = usuarios.find(
      (usuario) => usuario.nombre.toLowerCase() === nuevoUsuario.nombre.toLowerCase()
    );
  
    if (usuarioExistente) {
      return res.status(400).json({ error: "El usuario ya existe." });
    }

      // Generar un id único para el nuevo usuario
  const maxId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) : 0;
  nuevoUsuario.id = maxId + 1;

  // Guardamos el usuario en el array
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  
  });
 

  // Endpoint -- Obtiene un usuario por nombre.
  app.get('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
   const usuarioEncontrado = usuarios.find(usuario => usuario.nombre.toLowerCase() === nombre);
  
    if (!usuarioEncontrado) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
  
    res.status(200).json(usuarioEncontrado);
  });
  

  // Endpoint -- Actualiza la información de un usuario por nombre.
  app.put('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase(); // Captura el nombre del usuario desde la URL
    const datosActualizados = req.body; // Captura los datos enviados en el cuerpo de la solicitud
  
    // Encuentra el índice del usuario en el array
    const indice = usuarios.findIndex((usuario) => usuario.nombre.toLowerCase() === nombre);
  
    // Si el usuario no existe, devuelve un error 404
    if (indice === -1) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
  
    // Actualiza los datos del usuario
    usuarios[indice] = { ...usuarios[indice], ...datosActualizados };
    res.status(200).json(usuarios[indice]); // Devuelve el usuario actualizado
  });
  

  // Endpoint  -- Elimina un usuario por nombre.
  app.delete('/usuarios/:nombre', (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
   const usuariosFiltrados = usuarios.filter((usuario) => usuario.nombre.toLowerCase() !== nombre);

  if (usuarios.length === usuariosFiltrados.length) {
    return res.status(404).json({ error: "Usuario no encontrado." });
  }

  usuarios = usuariosFiltrados;
  res.status(200).json({ mensaje: "Usuario eliminado." });
  });
  

app.listen(PORT,()=>{
    console.log(`Servidor en ejecución en http://localhost:${PORT}`)
});


