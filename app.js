//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require ('mongoose')
const session = require ('express-session')
const flash = require ('connect-flash')
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
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

    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/404')
        })
        
    })

    app.get('/postagem/:slug', (req, res)=>{
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem:postagem})
            }else{
                req.flash('error_msg', "Essa postagem não existe")
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404!')
    })

    app.get('/posts', (req, res) => {
        res.send('Lista Posts')
    })

    app.use('/admin', admin)

// Outros 
const PORT  = 8081
app.listen(PORT, function(){
    console.log('Servidor rodando!')
})