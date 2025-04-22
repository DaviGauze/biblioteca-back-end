import { DataTypes } from "sequelize";
import banco from "../banco.js";

//mapeamento da model Funcionario
export default banco.define(
    'funcionario',
    {
        // Model attributes are defined here
        idfuncionario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nomefuncionario: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        nascimento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        salario: {
            type: DataTypes.DECIMAL(11, 2),
            allowNull: false
        },
        contratacao: {
            type: DataTypes.DATE,
            allowNull: false
        },
        demissao: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        senha: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        token: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }
);