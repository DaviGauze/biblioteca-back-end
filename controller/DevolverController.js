import Devolucao from "../model/DevolverModel.js";
import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";

async function listar(req, res) {
    const respostaBanco = await Devolucao.findAll({
        include: [{
            model: Emprestimo,
            include: [Livro] // Inclui informações do livro relacionado
        }]
    });
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Devolucao.findByPk(id, {
        include: [{
            model: Emprestimo,
            include: [Livro] // Inclui informações do livro relacionado
        }]
    });
    res.json(respostaBanco);
}

async function devolver(req, res) {
    try {
        const idemprestimo = req.body.idemprestimo;
        const observacao = req.body.observacao || null;

        // Verifica se o parâmetro idemprestimo foi enviado
        if (!idemprestimo) {
            return res.status(422).json({ erro: 'O parâmetro idemprestimo é obrigatório' });
        }

        // Busca o empréstimo no banco
        const emprestimo = await Emprestimo.findByPk(idemprestimo, {
            include: [Livro] // Inclui informações do livro relacionado
        });

        // Validações
        if (!emprestimo) {
            return res.status(404).json({ erro: 'Empréstimo não encontrado' });
        }

        if (emprestimo.devolucao) {
            return res.status(422).json({ erro: 'Este livro já foi devolvido' });
        }

        // Cria o registro de devolução
        const devolucao = await Devolucao.create({
            idemprestimo,
            observacao,
            // datadevolucao é preenchida automaticamente pelo modelo
        });

        // O hook afterCreate do modelo já atualiza o empréstimo e o livro,
        // mas podemos retornar os dados atualizados
        const emprestimoAtualizado = await Emprestimo.findByPk(idemprestimo, {
            include: [Livro]
        });

        res.json({
            mensagem: 'Devolução registrada com sucesso',
            devolucao,
            emprestimo: emprestimoAtualizado
        });

    } catch (error) {
        console.error('Erro ao registrar devolução:', error);
        res.status(500).json({ 
            erro: 'Erro ao registrar devolução',
            detalhes: error.message 
        });
    }
}

export default { listar, selecionar, devolver };