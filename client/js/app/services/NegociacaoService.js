'use strict';

System.register(['./HttpService', './ConnectionFactory', '../dao/NegociacaoDAO', '../models/Negociacao'], function (_export, _context) {
    "use strict";

    var HttpService, ConnectionFactory, NegociacaoDAO, Negociacao, _createClass, NegociacaoService;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_HttpService) {
            HttpService = _HttpService.HttpService;
        }, function (_ConnectionFactory) {
            ConnectionFactory = _ConnectionFactory.ConnectionFactory;
        }, function (_daoNegociacaoDAO) {
            NegociacaoDAO = _daoNegociacaoDAO.NegociacaoDAO;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('NegociacaoService', NegociacaoService = function () {
                function NegociacaoService() {
                    _classCallCheck(this, NegociacaoService);

                    this._http = new HttpService();
                }

                _createClass(NegociacaoService, [{
                    key: 'obterNegociacoesSemana',
                    value: function obterNegociacoesSemana() {

                        return this._http.get('negociacoes/semana').then(function (listaNegociacoes) {
                            return listaNegociacoes.map(function (object) {
                                return new Negociacao(new Date(object.data), object.quantidade, object.valor);
                            });
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Houve algum erro ao tentar listar as negociações!');
                        });
                    }
                }, {
                    key: 'obterNegociacoesSemanaAnterior',
                    value: function obterNegociacoesSemanaAnterior() {

                        return this._http.get('negociacoes/anterior').then(function (listaNegociacoes) {
                            return listaNegociacoes.map(function (object) {
                                return new Negociacao(new Date(object.data), object.quantidade, object.valor);
                            });
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Houve algum erro ao tentar listar as negociações da semana anterior!');
                        });
                    }
                }, {
                    key: 'obterNegociacoesSemanaRetrasada',
                    value: function obterNegociacoesSemanaRetrasada() {

                        return this._http.get('negociacoes/retrasada').then(function (listaNegociacoes) {
                            return listaNegociacoes.map(function (object) {
                                return new Negociacao(new Date(object.data), object.quantidade, object.valor);
                            });
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Houve algum erro ao tentar listar as negociações da semana retrasada!');
                        });
                    }
                }, {
                    key: 'obterNegociacoes',
                    value: function obterNegociacoes() {

                        return Promise.all([this.obterNegociacoesSemana(), this.obterNegociacoesSemanaAnterior(), this.obterNegociacoesSemanaRetrasada()]).then(function (periodos) {

                            var negociacoes = periodos.reduce(function (dados, periodo) {
                                return dados.concat(periodo);
                            }, []).map(function (dado) {
                                return new Negociacao(new Date(dado.data), dado.quantidade, dado.valor);
                            });

                            return negociacoes;
                        }).catch(function (error) {

                            throw new Error(error);
                        });
                    }
                }, {
                    key: 'cadastra',
                    value: function cadastra(negociacao) {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDAO(connection);
                        }).then(function (dao) {
                            return dao.adiciona(negociacao);
                        }).then(function () {
                            return 'Negociação adicionada com sucesso!';
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Não foi possivel cadastrar a negociação');
                        });
                    }
                }, {
                    key: 'lista',
                    value: function lista() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDAO(connection);
                        }).then(function (dao) {
                            return dao.listaTodos();
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Não foi possivel listar as negociações');
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        return ConnectionFactory.getConnection().then(function (connection) {
                            return new NegociacaoDAO(connection);
                        }).then(function (dao) {
                            return dao.apagaTodos();
                        }).then(function () {
                            return 'Negociações pagadas com sucesso';
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Não foi possivel listar as negociações');
                        });
                    }
                }, {
                    key: 'importa',
                    value: function importa(listaNegociacoes) {
                        return this.obterNegociacoes().then(function (negociacoes) {
                            return negociacoes.filter(function (negociacao) {
                                return !listaNegociacoes.some(function (negociacaoExistente) {
                                    return negociacao.isEquals(negociacaoExistente);
                                });
                            });
                        }).catch(function (error) {
                            console.log(error);
                            throw new Error('Não foi possivel importar a lista de negociações');
                        });
                    }
                }]);

                return NegociacaoService;
            }());

            _export('NegociacaoService', NegociacaoService);
        }
    };
});
//# sourceMappingURL=NegociacaoService.js.map