    const { text } = require('body-parser')
    const express = require ('express')
    const router = express.Router()
    const mongoose = require ('mongoose')
    require('../models/Categoria')
    const Categoria = mongoose.model('categorias')
    require('../models/Postagem')
    const Postagem = mongoose.model('postagens')
    const {eAdmin} = require('../helpers/eAdmin')


    router.get('/', function(req, res){
        res.render('admin/index')
    })

    router.get('/posts', function(req, res){
        res.send('Página de posts')
    })

    router.get('/categorias', function(req, res){
        Categoria.find().sort({Date:'desc'}).lean().then(function(categorias){
            res.render('admin/categorias', {categorias: categorias})
        }).catch(function(err){
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin')
        })
    })

    router.get('/categorias/add', function(req, res){
        res.render('admin/addcategorias')
    })

    router.post('/categorias/nova', function(req, res){
        
        var erros = []

        if (!req.body.nome || typeof req.body.nome === undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }

        if(req.body.nome.length < 2 ){
            erros.push({texto: "Nome muito pequeno"})
        }

        if (!req.body.slug || typeof req.body.slug === undefined || req.body.slug == null){
            erros.push({texto: "Slug inválido"})
        }

        if (erros.length > 0){
            res.render("admin/addcategorias", {erros: erros})
        }else{
            const novaCategoria = {
                nome: req.body.nome,
                slug: req.body.slug
            }

            new Categoria(novaCategoria).save().then(function(){
                req.flash('success_msg', 'Categoria criada com sucesso')
                res.redirect('/admin/categorias')
            }).catch(function(err){
                req.flash('error_msg', 'Houve um erro ao salvar a categoria, tente novamente')
                res.redirect('/admin')
            })  
        } 
    })

    router.get('/categorias/edit/:id', (req, res) => {
        Categoria.findOne({_id: req.params.id}).lean().then(function(categoria){
            res.render('admin/editcategorias', {categoria: categoria})
        }).catch(function(err){
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect('/admin/categorias')
        })
    })

    router.post('/categorias/edit', (req, res) => {

        Categoria.findOne({_id: req.body.id}).then((categoria) =>{
            
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

           categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorias')
           }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria')
                res.redirect('/admin/categorias')
           })

        }).catch(function(err){
            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
        })
    })

    router.post('/categorias/deletar', (req, res) => {
        
        Categoria.deleteOne({_id: req.body.id}).then(() => {
            req.flash('success_msg', 'Categoria excluída com sucesso!');
            res.redirect('/admin/categorias');
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao excluir a categoria!');
            res.redirect('/admin/categorias')
        })
    })


    router.get("/postagens", (req, res) =>{

        Postagem.find().populate('categoria').lean().sort({data:'desc'}).then((postagens) =>{
            res.render("admin/postagens", {postagens: postagens})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao exibir as postagens')
            res.redirect('/admin')

        })
    })

    router.get("/postagens/add", (req, res) => {
        Categoria.find().lean().then((categorias) =>{
            res.render("admin/addpostagem", {categorias: categorias})
        }).catch((err) => {
            req.flash("error,msg", "Houve um erro ao carregar o formulário")
            res.redirect("/admin")
        })
        
    })

    router.post("/postagens/nova", (req, res) => {

        var erros = []

        if(req.body.categoria == "0"){
            erros.push({text: "Categoria inválida, registre uma categoria válida!"})
        }

        if(erros.length > 0){
            res.render("admin/addpostagem", {erros: erros})
        }else{
            const novaPostagem ={
                titulo: req.body.titulo,
                descricao: req.body.descricao,
                conteudo: req.body.conteudo,
                categoria: req.body.categoria,
                slug: req.body.slug
            }

            new Postagem(novaPostagem).save().then(() => {
                req.flash('success_msg', "Postagem criada com sucesso!")
                res.redirect('/admin/postagens')
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao salvar a sua postagem!')
                res.redirect('/admin/postagens')
            })
        }
    })

    router.get('/postagens/edit/:id', (req, res)=> {
        
        Postagem.findOne({_id:req.params.id}).lean().then((postagem) => {
            
            Categoria.find().lean().then((categorias) =>{
                res.render('admin/editpostagens', {categorias: categorias, postagem: postagem})
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao listar as categorias')
                res.redirect('/admin/postagens')
            })

        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
            res.redirect('/admin/postagens')
        })
        
    })

    router.post('/postagens/edit', (req, res) => {

        Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
    
            postagem.save().then(() => {
                req.flash('success_msg', 'Postagem editada com sucesso!')
                res.redirect('/admin/postagens')
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao editar a postagem!')
                res.redirect('/admin/postagens')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a edição')
            res.redirect('/admin/postagens')
        })
    })

    router.get('/postagens/deletar/:id', (req, res) => {
        Postagem.deleteOne({_id: req.params.id}).then(()=> {
            req.flash('success_msg',`Postagem deletada com sucesso`)
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg','Houve um erro ao deletar a postagem')
            console.log("Erro ao deletar: ",err)
            res.redirect('/admin/postagens')
        })
    })
    module.exports = router