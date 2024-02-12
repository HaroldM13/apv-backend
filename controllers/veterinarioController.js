import Veterinario  from "../models/Veterinario.js";
import generarJWT from '../helpers/generarJWT.js';
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const {nombre, email, password} = req.body;
    //Prevenir y revisar si el usuario ya esta registrado
    const  exiteUsuario = await Veterinario.findOne({email});
    if (exiteUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }
    
    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar Email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const {token} = req.params;
    const  usuarioConfirmar = await Veterinario.findOne({token});
    
    if (!usuarioConfirmar) {
        const error = new Error('Token no valido!!');
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({msg: "Usuario Confirmado Correctamente!!"});
        
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const {email, password} = req.body;

    //Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});
    if (!usuario) {
        const error = new Error('El usuario NO Existe!!');
        return res.status(403).json({ msg: error.message });
    };

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('Tu cuenta no ha sido confirmada!!');
        return res.status(403).json({ msg: error.message });
    };

    // Revisar el password si es igual al de la bd
    if (await usuario.comprobarPassword(password)) {
        //Autenticar al usuario
        usuario.token = generarJWT(usuario.id);
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        });
    } else {
        const error = new Error('El password es INCORRECTO!!');
        return res.status(403).json({ msg: error.message });
    }
    // res.json( {msg: 'El Usuario SI esta Autenticando'} );

}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({ email });

    if (!existeVeterinario) {
        const error = new Error('El Usuario no Existe!!');
        return res.status(403).json({ msg: error.message });
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();

        //Enviar Email con las instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({msg: 'Hemos enviado un email con las indicaciones'});
    } catch (error) {
        console.log(error);
    }

    console.log(existeVeterinario);
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token});

    if (tokenValido) {
        //El token es valido, el usuario existe!!
        res.json({msg: "Token valido y el usuario existe!!"});
    } else {
        const error = new Error('Token no Valido!!');
        return res.status(403).json({ msg: error.message });
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({token});

    if (!veterinario) {
        const error = new Error('Hubo un error!!');
        return res.status(403).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        // veterinario.confirmado = false;
        await veterinario.save();
        console.log(veterinario);
        res.json({msg: "Password modificado Correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body;
    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({email});

        if (existeEmail) {
            const error = new Error("El Email que ingresaste ya esta en Uso!!");
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;
        veterinario.email = req.body.email;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    //Leer los datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    //Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id);
    if (!veterinario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});
    }

    //comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {
        //Si es correcto, cambiar la contraseña y guardarla
        //Almacenar el password nuevo
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: "Contraseña Actualizada"})
    }else {
        const error = new Error("El password actual es incorrecto!!");
        return res.status(400).json({msg: error.message});
    }

    
}    


export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}