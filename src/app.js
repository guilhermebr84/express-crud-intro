// vamos simular um CRUD no servidor, não vai salvar

//01 - importar express:
const express = require("express");

//07 - importar o uuid
const { v4: uuidv4 } = require("uuid");

//02 - definir uma array database de exemplo:
const database = [
  //06 - adicionar um id - para gerar um id, vamos usar um pacote chamado uuid - npm install uuid
  // underline é convenção da comunidade para dizer que é o id do banco de dados
  {
    _id: uuidv4(),
    title: "TITULO",
    author: "pessoa qualquer",
    publisher: "editora qualquer",
    year: "1999",
    genre: "anytech",
  },
];

const app = express();

//05 - tem que configurar o servidro EXPRESS para que interpretar requisições com o corpo em formato JSON.
app.use(express.json());

//CRUD NO EXPRESS

//CREATE
//03 - para criar um novo registro a gente faz uma requisição do tipo POST. Exemplo de livros.
//04 - requisições POST, PUT e PATCH possuem a propriedade especial "body", que carrega o conteudo da requisição.
app.post("/book", (req, res) => {
  console.log(req.body); // dentro do navegador, só da para mandar POST de dentro de um formulario.
  const data = { ...req.body, _id: uuidv4() }; // 08- para gerar um id dinamico. Dentro de {} espalha a req.body e insere um _id no final
  //09 - pegar a informação e jogar em req.body usando o método de array ".push"
  database.push(data); //09 - ao inves de usar req.body, usa o data denominado anteriormente. Essa linha adiciona o objeto criado no database
  //10 - por convenção quando responde uma operação de criação, responde o registro recem criado e por boa pratica é mandar o codigo de status 201 - created
  res.status(201).json(data);
});
// 11 - cada vez que salva, o banco de dados reseta

//READ
app.get("/book", (req, res) => {
  //12 - read todos os livros do banco de dados
  res.status(200).json(database);
});

//READ COM DETALHES 1 - id
app.get("/book/id/:id", (req, res) => {
  //console.log(req.params); // usa o ".params" porque sao parametros de rota.
  //similar ao REACT, podemos declarar parâmetros de rota no Express usando o sintaxe ":nome do parametro". Os parametros de rota ficam disponíveis no objeto params.
  //13 - usando o find para filtrar o que quer:
  const foundBook = database.find((bookObj) => {
    return bookObj._id === req.params.id;
  });

  if (foundBook) {
    return res.status(200).json(foundBook);
  }

  return res.status(404).json({ msg: "book id not found" });
});

//READ COM DETALHES 2 - name
app.get("/book/title/:title", (req, res) => {
  // console.log(req.body);
  const foundBookTitle = database.filter((bookObj) => {
    return bookObj.title.includes(req.params.title);
  });
  console.log(foundBookTitle);
  if (foundBookTitle) {
    return res.status(200).json(foundBookTitle);
  }

  return res.status(404).json({ msg: "book title not found" });
});

app.get("/book/author/:author", (req, res) => {
  // console.log(req.body);
  const foundBookAuthor = database.filter((bookObj) => {
    return bookObj.author.includes(req.params.author);
  });
  console.log(foundBookAuthor);
  if (foundBookAuthor) {
    return res.status(200).json(foundBookAuthor);
  }

  return res.status(404).json({ msg: "book title not found" });
});

app.patch("/book/:id", (req, res) => {
  const foundBookIndex = database.findIndex((bookObj) => {
    return bookObj._id === req.params.id;
  });
  if (foundBookIndex > -1) {
    const update = { ...database[foundBookIndex], ...req.body };
    database[foundBookIndex] = update;
    return res.status(200).json(update);
  }
  return res.status(404).json({ msg: "impossible to update" });
});

app.delete("/book/:id", (req, res) => {
  const foundBookIndex = database.findIndex((bookObj) => {
    return bookObj._id === req.params.id;
  });
  if (foundBookIndex > -1) {
    database.splice(foundBookIndex, 1);
    return res.status(200).json({ msg: "delete ok" });
    // sempre que fizer o delete, o objeto retorna vazio
  }
  return res.status(404).json({ msg: "impossible to delete" });
});

app.listen(4000, () => console.log("server running on 4000 port"));
