const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const nodemailer = require('nodemailer')
const port = process.env.PORT || 3500

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://style-web.net')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
}) 

app.post("/mail/send", (req, res)=>{
    console.log("Email enviado");
    const {name, email, phone, message} = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER,
          pass: process.env.PASS_EMAIL
        },
        tls: {
          rejectUnauthorized: false
        }
    })

    const templeteAdmin = `
      <body>
        <div>
            <p>Un nuevo usuario se ha contactado desde la web</p>
            <p>Datos de contacto:</p>
            <ul>
                <li>Nombre y apellido: ${name}</li>
                <li>Teléfono: ${phone}</li>
                <li>Email: ${email}</li>
                <li>Mensaje: ${message}</li>
            </ul>
        </div>
      </body>`

    const templateUser = `
      <body>
        <div>
            <p>¡Gracias ${name} por comunicarte con nosotros!</p>
            <p>En breve nos estaremos contactando.</p>
            <p>Que tengas un buen dia, saludos.</p>
        </div>
      </body>`

    const mailOptionsAdmin = {
        from: 'style-web <'+ process.env.EMAIL_SERVER +'>',
        subject: 'Nuevo Contacto de styleweb.net',
        html: templeteAdmin,
        to: process.env.EMAIL_SERVER
    }
    const mailOptionsUser = {
        from: 'style-web <'+ process.env.EMAIL_SERVER +'>',
        subject: 'Hemos recibido tu consulta',
        html: templateUser,
        to: email
    }

    transporter.sendMail(mailOptionsAdmin, (err, info) => {
        if(err){
            res.status(500).json(err.message)
        }else{
            console.log("Email enviado al admin.");
            // res.status(200).json(req.body)
            transporter.sendMail(mailOptionsUser, (err, info) => {
                if(err){
                    res.status(500).json(err.message)
                }else{
                    console.log("Email enviado al user.");
                    res.status(200).json({
                        status: 200,
                        datos: 'Su mensaje fue enviado correctamente.'
                    })
                }
            })
        }
    })
})


app.listen(port, () => {
    console.log(`Server listen http://localhost:${port}`);
})