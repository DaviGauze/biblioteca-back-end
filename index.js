//Bibliotecas
import express from "express";
import banco from "./banco.js";
import editora from "./controller/EditoraController.js"
  
const app = express();
app.use(express.json());

app.get('/teste', (req, res)=>{
    res.send('teste ok.')
})

//Rotas Crud da tabela editoras
app.get('/editora', editora.listar)

app.get('/editora/:id', editora.selecionar);

app.post('/editora', editora.inserir);

app.put('/editora/:id', editora.alterar);

app.delete('/editora/:id', editora.excluir);    

app.listen(3000, ()=>{
  console.log(`Servidor Rodando`)
});

//Testando Conexão
try {
  await banco.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}


