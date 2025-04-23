import Emprestimo from "../model/EmprestimoModel.js";
import Livro from "../model/LivroModel.js";
import Usuario from "../model/UsuarioModel.js";
import Multa from "../model/MultaModel.js"; 
import moment from 'moment';

async function listar(req, res) {
    const respostaBanco = await Emprestimo.findAll();
    res.json(respostaBanco);
}

async function selecionar(req, res) {
    const id = req.params.id;
    const respostaBanco = await Emprestimo.findByPk(id);
    res.json(respostaBanco);
}

async function emprestar(req, res) {
    //Lendo os paramentros
    const idlivro = req.body.idlivro;
    const idusuario = req.body.idusuario;

    //verifica se existe o paramentro idlivro
    if (!idlivro) {
        res.status(422).send('O parâmetro idlivro é obrigatório.');
    }

    //verifica se existe o paramentro idusuario
    if (!idusuario) {
        res.status(422).send('O parâmetro idusuario é obrigatório.');
    }

    //verifica se o livro existe
    const livroBanco = await Livro.findByPk(idlivro);
    if (!livroBanco) {
        res.status(404).send('Livro não encontrado.');
    }

    //verifica se o usuário existe
    const usuarioBanco = await Usuario.findByPk(idusuario);
    if (!usuarioBanco) {
        res.status(404).send('Usuário não encontrado.');
    }

    //verifica se o livro está inativo
    if (!livroBanco.ativo) {
        res.status(422).send('Este livro está inativo.');
    }

    //verifica se o livro está emprestado
    if (livroBanco.emprestado) {
        res.status(422).send('Este livro já está emprestado.');
    }

    //verifica se o usuário tem um empréstimo pendente
    const emprestimoPendente = await Emprestimo.findOne({
        where: {
            idusuario,
            devolucao: null // Verifica se o campo devolucao é null
        }
    });

    if (emprestimoPendente) {
        return res.status(422).send('O usuário já possui um empréstimo pendente.');
    }
    //falta fazer

    //setando data de emprestimo e data de vencimento
    const emprestimo = moment().format('YYYY-MM-DD');
    const vencimento = moment().add(15, 'days').format('YYYY-MM-DD');

    //inserindo o emprestimo no banco
    const respostaBanco = await Emprestimo.create({ idlivro, idusuario, emprestimo, vencimento });

    //alterando o campo emprestado do livro para true
    const emprestado = true;
    await Livro.update(
        { emprestado },
        { where: { idlivro } });

    res.json(respostaBanco);


    //res.json(respostaBanco);
}

async function devolver(req, res) {
    try {
        const { idemprestimo } = req.body;

        // Valida se o código do empréstimo foi enviado
        if (!idemprestimo) {
            return res.status(422).json({ erro: 'O campo idemprestimo é obrigatório.' });
        }

        // Busca o empréstimo no banco de dados
        const emprestimo = await Emprestimo.findByPk(idemprestimo, {
            include: [Livro] // Inclui informações do livro associado
        });

        // Valida se o código do empréstimo é válido
        if (!emprestimo) {
            return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
        }

        // Valida se o empréstimo já foi devolvido
        if (emprestimo.devolucao) {
            return res.status(422).json({ erro: 'Este empréstimo já foi devolvido.' });
        }

        // Registra a data de devolução no empréstimo
        const devolucao = moment().format('YYYY-MM-DD');
        await Emprestimo.update(
            { devolucao },
            { where: { idemprestimo } }
        );

        // Marca o livro como disponível
        await Livro.update(
            { emprestado: false },
            { where: { idlivro: emprestimo.idlivro } }
        );

        // Verifica se há atraso na devolução
        const dataVencimento = moment(emprestimo.vencimento, 'YYYY-MM-DD');
        const dataDevolucao = moment(devolucao, 'YYYY-MM-DD');
        let multa = 0;

        if (dataDevolucao.isAfter(dataVencimento)) {
            const diasAtraso = dataDevolucao.diff(dataVencimento, 'days');
            multa = diasAtraso * 2.5; 

            // Registra a multa na tabela Multa
            await Multa.create({
                idusuario: emprestimo.idusuario,
                idemprestimo: emprestimo.idemprestimo,
                valor: multa,
                diasAtraso
            });
        }

        res.json({
            mensagem: 'Devolução registrada com sucesso.',
            emprestimo: {
                idemprestimo: emprestimo.idemprestimo,
                idlivro: emprestimo.idlivro,
                idusuario: emprestimo.idusuario,
                devolucao,
                multa: multa > 0 ? `R$ ${multa.toFixed(2)}` : 'Sem multa'
            }
        });
    } catch (error) {
        console.error('Erro ao registrar devolução:', error);
        res.status(500).json({ erro: 'Erro ao registrar devolução.', detalhes: error.message });
    }
}

export default { listar, selecionar, emprestar, devolver };