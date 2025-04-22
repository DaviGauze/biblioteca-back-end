import { DataTypes } from "sequelize";
import banco from "../banco.js";

export default banco.define(
    'devolucao',
    {
        iddevolucao: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idemprestimo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'emprestimo',
                key: 'idemprestimo'
            },
            validate: {
                isEmprestimoValido: async function(value) {
                    const emprestimo = await banco.models.emprestimo.findOne({
                        where: { idemprestimo: value }
                    });
                    
                    if (!emprestimo) {
                        throw new Error('Empréstimo não encontrado');
                    }
                    
                    if (emprestimo.devolucao !== null) {
                        throw new Error('Este empréstimo já foi devolvido');
                    }
                }
            }
        },
        datadevolucao: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        observacao: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        hooks: {
            afterCreate: async (devolucao, options) => {
                // Atualiza o empréstimo marcando como devolvido
                await banco.models.emprestimo.update(
                    { devolucao: devolucao.datadevolucao },
                    { where: { idemprestimo: devolucao.idemprestimo } }
                );
                
                // Marca o livro como disponível
                const emprestimo = await banco.models.emprestimo.findByPk(devolucao.idemprestimo);
                if (emprestimo) {
                    await banco.models.livro.update(
                        { disponivel: true },
                        { where: { idlivro: emprestimo.idlivro } }
                    );
                }
            }
        }
    }
);