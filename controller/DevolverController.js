import Devolucao from "../model/DevolverModel.js";
import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";

async function listar(req, res) {
    const respostaBanco = await Devolucao.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Devolucao.findByPk(id, {
        include: [{
            model: Emprestimo,
            include: [Livro] 
        }]
    });
    res.json(respostaBanco);
}

async function devolver(req, res) {
    try {
        const idemprestimo = req.body.idemprestimo;
        const observacao = req.body.observacao || null;

        if (!idemprestimo) {
            return res.status(422).json({ erro: 'O parâmetro idemprestimo é obrigatório' });
        }

        const emprestimo = await Emprestimo.findByPk(idemprestimo, {
            include: [Livro]
        });

        if (!emprestimo) {
            return res.status(404).json({ erro: 'Empréstimo não encontrado' });
        }

        if (emprestimo.devolucao) {
            return res.status(422).json({ erro: 'Este livro já foi devolvido' });
        }

        const devolucao = await Devolucao.create({
            idemprestimo,
            observacao,
            dataDevolucao: new Date()
        });

        await Livro.update(
            { disponivel: true },
            { where: { id: emprestimo.Livro.id } }
        );

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