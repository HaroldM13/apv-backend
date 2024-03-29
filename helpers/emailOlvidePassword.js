import nodemailer from 'nodemailer';

const emailOlvidePassword = async ({email, nombre, token}) => {
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
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password',
        html: `<p>Hola! ${nombre}, Has solicitado reestablecer tu Password</p>

            <p>Sigue el siguiente enlace para generar un nuevo Password: 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Reestablecer Password</a> </p> 
            
            <p>Si no creaste esta cuenta, Ignora este mensaje</p>
        `
    });

    console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;