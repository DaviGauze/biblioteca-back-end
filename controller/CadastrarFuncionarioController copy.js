import Funcionario from "../model/CadastrarFuncionarioModel.js";

async function listar(req, res) {
    const respostaBanco = await Funcionario.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;   
    const respostaBanco = await Funcionario.findByPk(id);
    res.json(respostaBanco);
    
}

async function inserir(req, res) {
    try {
        const respostaBanco = await Funcionario.create(req.body);
        res.json(respostaBanco);
    } catch (error) {
        console.error('Erro ao inserir funcionário:', error);
        res.status(500).json({ error: 'Erro ao inserir funcionário.', details: error.message });
    }
}

async function alterar(req, res) {
    const nomefuncionario = req.body.nomefuncionario;
    const cpf = req.body.cpf;
    const email = req.body.email;
    const telefone = req.body.telefone;
    const nascimento = req.body.nascimento;
    const salario = req.body.salario;
    const contratacao = req.body.contratacao;
    //const demissao = req.body.demissao;
    //const ativo = req.body.ativo;
    //const senha = req.body.senha;
    //const token = req.body.token;

    const idfuncionario = req.params.id;

    const respostaBanco = await Funcionario.update(
        { nomefuncionario, cpf, email, telefone, nascimento, salario, contratacao },
        { where: { idfuncionario } });
    res.json(respostaBanco);
}

async function excluir(req, res) {
    const idfuncionario = req.params.id;

    const respostaBanco = await Funcionario.destroy({ where: { idfuncionario } });
    res.json(respostaBanco);
}

export default { listar, selecionar, inserir, alterar, excluir };