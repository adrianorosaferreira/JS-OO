'use strict';

System.register(['../models/ListaNegociacoes', '../models/Mensagem', '../views/NegociacaoView', '../views/MensagemView', '../services/NegociacaoService', '../helpers/DateHelper', '../helpers/Bind', '../models/Negociacao', '../services/HttpService'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, NegociacaoView, MensagemView, NegociacaoService, DateHelper, Bind, Negociacao, HttpService, _createClass, NegociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_viewsNegociacaoView) {
            NegociacaoView = _viewsNegociacaoView.NegociacaoView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_servicesHttpService) {
            HttpService = _servicesHttpService.HttpService;
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

            _export('NegociacaoController', NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    var $ = document.querySelector.bind(document);

                    this._inputData = $('#data');
                    this._inputQuantidade = $('#quantidade');
                    this._inputValor = $('#valor');

                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacaoView($('#grid-negociacoes')), 'adiciona', 'apagar', 'ordena', 'inverteOrdem');

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($('#mensagemView')), 'texto');
                    this._ordemAtual = '';

                    this._service = new NegociacaoService();

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        this._service.lista().then(function (listaNegociacoes) {
                            return listaNegociacoes.forEach(function (negociacao) {
                                return _this._listaNegociacoes.adiciona(negociacao);
                            });
                        }).catch(function (error) {
                            return _this._mensagem.texto = error;
                        });

                        setInterval(function () {
                            _this.importaLista();
                        }, 3000);
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {
                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordena(function (a, b) {
                                return a[coluna] - b[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }, {
                    key: 'importaLista',
                    value: function importaLista() {
                        var _this2 = this;

                        this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            negociacoes.forEach(function (negociacao) {
                                _this2._listaNegociacoes.adiciona(negociacao);
                                _this2._mensagem.texto = 'Negociações do perido importadas';
                            });
                        }).catch(function (error) {
                            return _this2._mensagem.texto = error;
                        });
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this3 = this;

                        event.preventDefault();

                        var negociacao = this._criaNegociacao();

                        this._service.cadastra(negociacao).then(function (mensagem) {
                            _this3._listaNegociacoes.adiciona(negociacao);
                            _this3._mensagem.texto = mensagem;
                            _this3._limpaFormulario();
                        }).catch(function (error) {
                            return _this3._mensagem.texto = error;
                        });
                    }
                }, {
                    key: 'limpaLista',
                    value: function limpaLista() {
                        var _this4 = this;

                        this._service.apaga().then(function (mensagem) {
                            _this4._mensagem.texto = mensagem;
                            _this4._listaNegociacoes.apagar();
                        }).catch(function (error) {
                            return _this4._mensagem.texto = error;
                        });
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {
                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {
                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0, 0;

                        this._inputData.focus();
                    }
                }, {
                    key: 'sendPost',
                    value: function sendPost(event) {

                        event.preventDefault();

                        console.log("Enviando post");

                        var $ = document.querySelector.bind(document);
                        var inputData = $('#data');
                        var inputQuantidade = $('#quantidade');
                        var inputValor = $('#valor');

                        var negociacao = {
                            data: inputData.value,
                            quantidade: inputQuantidade.value,
                            valor: inputValor.value
                        };

                        new HttpService().post('/negociacoes', negociacao).then(function () {
                            inputData.value = '';
                            inputQuantidade.value = 1;
                            inputValor.value = 0.0;
                            inputData.focus();
                            alert('Negociação enviada com sucesso');
                        }).catch(function (erro) {
                            return alert('N\xE3o foi poss\xEDvel enviar a negocia\xE7\xE3o: ' + erro);
                        });
                    }
                }]);

                return NegociacaoController;
            }());

            _export('NegociacaoController', NegociacaoController);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map