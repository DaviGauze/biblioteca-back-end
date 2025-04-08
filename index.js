//Bibliotecas
import express from "express";
import { Sequelize, DataTypes } from "sequelize";

//Conexão com o banco de dados
const sequelize = new Sequelize('progdb', 'postgres', '1205', {
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

//Testando Conexão
try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

//Mapeamento da Model Editora
const Editora = sequelize.define(
    'editora',
    {
      // Model attributes are defined here
      ideditora: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nomeeditora: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      endereco: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cnpj: {
        type: DataTypes.STRING(20),
        allowNull: false,
      }
    },
  );
  
const app = express();
app.use(express.json());

app.get('/teste', (req, res)=>{
    res.send('teste ok.')
})

//Rotas Crud da tabela editoras
app.get('/editora', async (req, res) => {
    const respostaBanco = await Editora.findAll();
    res.json(respostaBanco);
});

app.get('/editora/:id', async (req, res) => {
    const id = req.params.id;
    const respostaBanco = await Editora.findByPk(id);
    res.json(respostaBanco);
});

app.post('/editora', async (req, res) => {
//    const nomeeditora = req.body.nomeeditora;
//    const cnpj = req.body.cnpj;
//    const endereco = req.body.endereco;

    const respostaBanco = await Editora.create(req.body);
    res.json(respostaBanco);
});

app.put('/editora/:id', async (req, res) => {
    const nomeeditora = req.body.nomeeditora;
    const cnpj = req.body.cnpj;
    const endereco = req.body.endereco;

    const ideditora = req.params.id;
    
        const respostaBanco = await Editora.update(
            {nomeeditora, cnpj, endereco},
            {where: {ideditora}});
        res.json(respostaBanco);
    });

app.put('/editora/:id', async (req, res) => {
    const nomeeditora = req.body.nomeeditora;
    const cnpj = req.body.cnpj;
    const endereco = req.body.endereco;

    const ideditora = req.params.id;
    
        const respostaBanco = await Editora.update(
            {nomeeditora, cnpj, endereco},
            {where: {ideditora}});
        res.json(respostaBanco);
    });

app.delete('/editora/:id', async (req, res) => {
    const ideditora = req.params.id;

    const respostaBanco = await Editora.destroy(
    {where: {ideditora}});
    res.json(respostaBanco);
});    


app.listen(3000, ()=>{
    console.log(`Servidor Rodando`)
});
