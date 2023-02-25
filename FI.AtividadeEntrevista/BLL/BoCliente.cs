﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Incluir(cliente);
        }
        public long IncluirBeneficiario(DML.Beneficiario beneficiario)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.IncluirBeneficiario(beneficiario);
        }

        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Alterar(cliente);
        }

        public void AlterarBeneficiario(DML.Beneficiario cliente)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.AlterarBeneficiario(cliente);
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public DML.Cliente Consultar(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Consultar(id);
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }
        public List<DML.Beneficiario> ListarBeneficiario(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.ListarBeneficiarios(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm,  quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(CPF);
        }
        public bool VerificarExistenciaBeneficiario(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistenciaBeneficiario(CPF);
        }

        public DML.Cliente BuscarCliente(string CPF)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.BuscarClientePorCPF(CPF);
        }
        public bool VerificarCPF(string CPF)
        {
            int[] numerosCPF = new int[11];

            CPF = new string(CPF.Where(char.IsDigit).ToArray());

            if (CPF.Length != 11)
                return false;


            for (int i = 0; i < 11; i++)
            {
                if (!int.TryParse(CPF[i].ToString(), out numerosCPF[i]))
                    return false;

            }

            // Verifica o primeiro dígito verificador do CPF
            int soma = 0;
            for (int i = 0; i < 9; i++)
            {
                soma += numerosCPF[i] * (10 - i);
            }
            int resto = soma % 11;
            int dv1 = resto < 2 ? 0 : 11 - resto;
            if (numerosCPF[9] != dv1)
                return false;

            // Verifica o segundo dígito verificador do CPF
            soma = 0;
            for (int i = 0; i < 10; i++)
            {
                soma += numerosCPF[i] * (11 - i);
            }
            resto = soma % 11;
            int dv2 = resto < 2 ? 0 : 11 - resto;
            if (numerosCPF[10] != dv2)
                return false;

            return true;
        }
    }
}
