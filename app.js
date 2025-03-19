//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
//const mongoose = require ('mongoose')
// Configurações 
    // Body Parser 

    app.use(express.urlencoded({extended: true}))
    app.use(express.json())

    //Handlerbars 
    app.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    app.set('view engine', 'handlebars')

    //Public 
    app.use(express.static(path.join(__dirname, 'public')))
// Rotas 
    app.use('/admin', admin)

// Outros 
const PORT  = 8081
app.listen(PORT, function(){
    console.log('Servidor rodando!')
})