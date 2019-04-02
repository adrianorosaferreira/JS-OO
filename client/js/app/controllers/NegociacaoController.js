class NegociacaoController {

    constructor() {
        this._ordemAtual = '';
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
        let service = new NegociacaoService();

        service
            .obterNegociacoes()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = "Negociações da semana importadas com sucesso!";
            })
            .catch(error => this._mensagem.texto = error);
    }

    adiciona(event) {

        event.preventDefault();
        try {
            this._listaNegociacoes.adiciona(this._criaNegociacao());
            this._mensagem.texto = 'Negociação adicionada com sucesso!';
            this._limpaFormulario();
        } catch (error) {
            this._mensagem.texto = error;
        }
    }

    limpaLista() {

        this._listaNegociacoes.apagar();
        this._mensagem.texto = 'Lista de negociações apagada com sucesso!';
    }

    _criaNegociacao() {
        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            this._inputQuantidade.value,
            this._inputValor.value
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