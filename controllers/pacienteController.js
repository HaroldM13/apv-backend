import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerPacientes = async (req, res) => {
    
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
}

const obtenerpaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('El paciente NO Existe!!');
        return res.status(404).json({ msg: error.message });
    }
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: "Accion NO Valida!!"});
    };

    res.json(paciente);
};
const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('El paciente NO Existe!!');
        return res.status(403).json({ msg: error.message });
    }
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: "Accion NO Valida!!"});
    };

    //Actualizamos el paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        return res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
}
const eliminarPaciente = async (req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
        const error = new Error('El paciente NO Existe!!');
        return res.status(404).json({ msg: error.message });
    };

    
    
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: "Accion no Valida!!"});
    };

    try {
        await paciente.deleteOne();
        res.json({msg: "Paciente Eliminado"});
    } catch (error) {
        console.log('Antes del error');
        console.log(error);
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerpaciente,
    actualizarPaciente,
    eliminarPaciente
}