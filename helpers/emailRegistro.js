import nodemailer from 'nodemailer';

const emailRegistro = async ({email, nombre, token}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
    });

    //Enviar email

    const info = await transporter.sendMail({
        from: "APV - Administrador de Pcientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu Cuenta en APV',
        text: 'Comprueba tu Cuenta en APV',
        html: `<p>Hola! ${nombre}, Comprueba tu cuenta en APV</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar/${token}" >Comprobar Cuenta</a> </p> 
            
            <p>Si no creaste esta cuenta, Ignora este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;