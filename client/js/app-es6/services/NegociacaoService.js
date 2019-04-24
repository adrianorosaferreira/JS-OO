import { HttpService } from './HttpService';
import { ConnectionFactory } from './ConnectionFactory';
import { NegociacaoDAO } from '../dao/NegociacaoDAO';
import { Negociacao } from '../models/Negociacao';

export class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesSemana() {

        return this._http
            .get('negociacoes/semana')
            .then(listaNegociacoes => {
                return listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(error => {
                console.log(error);
                throw new Error('Houve algum erro ao tentar listar as negociações!');
            })
    }

    obterNegociacoesSemanaAnterior() {

        return this._http
            .get('negociacoes/anterior')
            .then(listaNegociacoes => {
                return listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(error => {
                console.log(error);
                throw new Error('Houve algum erro ao tentar listar as negociações da semana anterior!');
            })
    }

    obterNegociacoesSemanaRetrasada() {

        return this._http
            .get('negociacoes/retrasada')
            .then(listaNegociacoes => {
                return listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor));
            })
            .catch(error => {
                console.log(error);
                throw new Error('Houve algum erro ao tentar listar as negociações da semana retrasada!');
            })
    }
    obterNegociacoes() {

        return Promise.all([
                this.obterNegociacoesSemana(),
                this.obterNegociacoesSemanaAnterior(),
                this.obterNegociacoesSemanaRetrasada()
            ])
            .then(periodos => {

                let negociacoes = periodos
                    .reduce((dados, periodo) => dados.concat(periodo), [])
                    .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor));

                return negociacoes;
            })
            .catch(error => {

                throw new Error(error);
            });
    }

    cadastra(negociacao) {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDAO(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso!')
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possivel cadastrar a negociação')
            });
    }

    lista() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDAO(connection))
            .then(dao => dao.listaTodos())
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possivel listar as negociações')
            });
    }

    apaga() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDAO(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações pagadas com sucesso')
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possivel listar as negociações')
            });
    }

    importa(listaNegociacoes) {
        return this.obterNegociacoes()
            .then(negociacoes =>
                negociacoes.filter(negociacao =>
                    !listaNegociacoes.some(negociacaoExistente =>
                        negociacao.isEquals(negociacaoExistente)
                    )
                )
            )
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possivel importar a lista de negociações');
            });
    }
}