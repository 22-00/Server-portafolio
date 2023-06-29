require("dotenv").config();
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser")
const { NM_PASSWORD, NM_EMAIL, PORT } = process.env;

const port = PORT || 3001

const app = express()
app.use(cors())
app.use(bodyParser.json())


const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: NM_EMAIL,
          pass: NM_PASSWORD,
        },
})


transport.verify((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Mensaje enviado")
    }
})

app.get("/api",bodyParser.urlencoded({ extended: true}), (req, res)=> {
    res.json({message: "Servidor andando bien"})
})

app.post("/contact",bodyParser.urlencoded({ extended: true}), (req, res) => {
    const { nombre, apellido, email, cel, mensaje } = req.body

    const mail = {
        from: email,
        to: NM_EMAIL,
        subject: "Contacto desde Portafolio",
        html: `<p>Nombre: ${nombre}</p>
               <p>Apellido: ${apellido}<p>
               <p>email: ${email}</p>
               <p>Cel: ${cel}</p>
               <p>Mensaje: ${mensaje}`
    }

    transport.sendMail(mail,(error) => {
        if(error) {
            console.log(error)
            res.json({code: 500, message: "Ah ocurrido un error"})
        } else {
            res.json({code: 200, message: "Mensaje enviado"})
        }
    })
})

app.listen(port, ()=> {
    console.log(`Servidor andando en el puerto ${port}`)
})