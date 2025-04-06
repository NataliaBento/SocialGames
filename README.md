# 🎮 GameBlog - Compartilhe suas Experiências em Jogos

GameBlog é uma aplicação web onde jogadores podem compartilhar experiências, publicar textos sobre jogos, interagir com outros usuários e manter uma timeline de postagens relacionadas ao universo gamer.

---

## 🧠 Problemática

Atualmente, muitos jogadores não encontram um espaço simples e direto para expressar suas experiências com jogos de forma mais pessoal. Redes sociais tradicionais nem sempre oferecem o foco necessário para esse tipo de conteúdo, diluindo as publicações em meio a outros temas.

Além disso, não há uma centralização de relatos e histórias sobre jogos contadas pelos próprios jogadores — algo que pode inspirar outros, trazer recomendações reais e até criar uma comunidade mais próxima.

---

## ✅ Solução

O **GameBlog** surge como uma solução prática e acessível para preencher essa lacuna. Com um sistema de cadastro e login de usuários, os jogadores podem:

- Criar postagens sobre seus jogos favoritos
- Compartilhar experiências, dicas e histórias
- Ler e interagir com publicações de outros jogadores

---

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Handlebars](https://handlebarsjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/) (autenticação)

---

## ⚙️ Como rodar o projeto localmente

#1. Clone o repositórios

git clone https://github.com/nataliabento/SocialGames.git

cd SocialGames

##2. Instale as dependências

npm install

###3. Configure as variáveis de ambiente
Crie um arquivo .env na raiz do projeto com as seguintes vaiáveis: 


####4.Inicie o servidor com Nodemon

nodemon app.js


📁 gameblog/
├── 📁 config/            # Configurações do banco de dados e passport
├── 📁 models/            # Modelos do Mongoose (User, Post)
├── 📁 routes/            # Rotas (autenticação, postagens, etc.)
├── 📁 views/             # Views com Handlebars
│   ├── layouts/
│   ├── partials/
│   └── ...
├── 📁 public/            # Arquivos estáticos (CSS, imagens)
├── app.js               # Arquivo principal da aplicação
├── package.json
└── .env

Acesse: http://localhost:3000


Funcionalidades:

Cadastro e login de usuários com autenticação via Passport.js

Criação, edição e exclusão de postagens

Listagem das postagens dos usuários

Visualização individual de posts

Layout responsivo com Handlebars

Integração com MongoDB para persistência de dados




