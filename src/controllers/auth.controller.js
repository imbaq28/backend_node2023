import models from "./../models"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function login(req, res) {  
    
     const { email, password} = req.body; // connst constante q no va cambiar su valor
    
    //busqueda de un usuario por email
    let user = await models.Usuario.findOne({ // let el valor puede cambiar
        where: {
            email: email
        }
    }) 
    // si el usuario no xiste
    if(!user){
        return res.status(200).send({
            mensaje: "Credenciales incorrectas"
        })
    }
    // verificar el password
    let correcto = await bcrypt.compare(password, user.password);
    if(correcto){
        let payload = {// generacion de token
            id: user.id,
            email: user.email,
            time: new Date()            
        }

        const token = jwt.sign(payload, "MI_CODIGO_SECRETO",{
            expiresIn: 60*60
        } )

        res.status(200).send({
            acces_token: token, 
            usuario: user,
            error: false
        })
    }else{
        return res.status(200).send({
            mensaje: "Password incorrecto"
        })
    }
}

export const registro = async function(req, res){
    let user = await models.Usuario.findOne({
        where: {
            email: req.body.email
        }
    })

    if(!user){
        // cifrar el password
        let pass_cifrado = await bcrypt.hash(req.body.password, 12)
	  req.body.password = pass_cifrado
        await models.Usuario.create(req.body)
        res.status(200).send({
            mensaje: "Usuario registrado"
        })
    }else{
        res.status(200).send({mensaje: "El correo ya esta registrado"})
    }
}

export const perfil = (req, res) =>{
    res.json({mensaje: "estas logueado..."})
}
