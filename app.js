//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require ('mongoose')
const session = require ('express-session')
const flash = require ('connect-flash')
// Configurações 

    // Sessão
    app.use(session({
        secret: "aprendendoefazendo",
        resave: true,
        saveUninitialized: true
    } ))
    app.use(flash())
    //Middleware
    app.use(function(req, res, next){
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next();
    })

    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    //Handlerbars 
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    app.set('view engine', 'handlebars')

    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogapp').then(function(){
        console.log('Mongo conectado com sucesso!')
    }).catch(function(err) {
        console.log('Erro ao se conectar com o mongo'+err)
    })

    //Public 
    app.use(express.static(path.join(__dirname, 'public')))
// Rotas 
    app.use('/admin', admin)

// Outros 
const PORT  = 8081
app.listen(PORT, function(){
    console.log('Servidor rodando!')
})