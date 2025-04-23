import { DataTypes } from "sequelize";
import banco from "../banco.js";

const Multa = banco.define('multa', {
    idmulta: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idemprestimo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: 'emprestimo', // Nome da tabela de referência
            key: 'idemprestimo'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    valor: {
        type: DataTypes.DECIMAL(11, 2),
        allowNull: false,
        defaultValue: 0
    },
    vencimento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    pagamento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'multa', 
    timestamps: false 
});

export default Multa;