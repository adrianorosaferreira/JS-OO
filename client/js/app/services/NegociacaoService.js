class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoes() {

        return Promise.all([
                this.obterNegociacoesSemana(),
                this.obterNegociacoesSemanaAnterior(),
                this.obterNegociacoesSemanaRetrasada()
            ])
            .then(periodos => {

                return periodos.reduce((listaNova, lista) => listaNova.concat(lista), []);
            })
            .catch(error => {

                throw new Error(error);
            });
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
}