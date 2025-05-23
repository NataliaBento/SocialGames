//Carregando módulos
require('dotenv').config()
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
require('./models/Categoria')
const Categoria = mongoose.model('categorias')
const usuarios = require('./routes/usuario')
const passport = require('passport')
require ('./config/auth')(passport)
const db = require('./config/db')

// Configurações 

    // Sessão
    app.use(session({
        secret: "aprendendoefazendo",
        resave: true,
        saveUninitialized: true
    } ))

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())
    //Middleware
    app.use(function(req, res, next){
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null;
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
    mongoose.connect(db.mongoURI).then(function(){
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

    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render('categorias/index', {categorias: categorias} )
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) =>{
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar os posts!')
                    res.redirect('/')
                })

            }else{
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
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
    app.use('/usuarios', usuarios)


// Outros 
const PORT  = process.env.PORT || 8081
app.listen(PORT, function(){
    console.log('Servidor rodando!')
})