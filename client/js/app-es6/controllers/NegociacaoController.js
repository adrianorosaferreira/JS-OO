class NegociacaoController {

    constructor() {
        let $ = document.querySelector.bind(document);

        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacaoView($('#grid-negociacoes')),
            'adiciona', 'apagar', 'ordena', 'inverteOrdem');

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        )
        this._ordemAtual = '';

        this._service = new NegociacaoService();

        this._init();
    }

    _init() {
        this._service
            .lista()
            .then(listaNegociacoes =>
                listaNegociacoes.forEach(negociacao =>
                    this._listaNegociacoes.adiciona(negociacao)))
            .catch(error => this._mensagem.texto = error)

        setInterval(() => {
            this.importaLista();
        }, 3000);
    }

    ordena(coluna) {
        if (this._ordemAtual == coluna) {
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

    importaLista() {

        this._service
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => {
                negociacoes.forEach(negociacao => {
                    this._listaNegociacoes.adiciona(negociacao)
                    this._mensagem.texto = 'Negociações do perido importadas'
                })
            })
            .catch(error => this._mensagem.texto = error);
    }

    adiciona(event) {

        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._service
            .cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(error => this._mensagem.texto = error);

    }

    limpaLista() {

        this._service
            .apaga()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.apagar();
            })
            .catch(error => this._mensagem.texto = error);
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    _limpaFormulario() {
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0, 0;

        this._inputData.focus();
    }

    sendPost(event) {

        event.preventDefault();

        console.log("Enviando post");

        let $ = document.querySelector.bind(document);
        let inputData = $('#data');
        let inputQuantidade = $('#quantidade');
        let inputValor = $('#valor');

        let negociacao = {
            data: inputData.value,
            quantidade: inputQuantidade.value,
            valor: inputValor.value
        };

        new HttpService()
            .post('/negociacoes', negociacao)
            .then(() => {
                inputData.value = '';
                inputQuantidade.value = 1;
                inputValor.value = 0.0;
                inputData.focus();
                alert('Negociação enviada com sucesso');
            })
            .catch(erro => alert(`Não foi possível enviar a negociação: ${erro}`));
    }
}