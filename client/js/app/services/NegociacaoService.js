class NegociacaoService {

    constructor() {
        this._http = new HttpService();
    }

    obterNegociacoesSemana() {

        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/semana')
                .then(listaNegociacoes => {
                    resolve(listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor)));
                })
                .catch(error => {
                    console.log(error);
                    reject('Houve algum erro ao tentar listar as negociações!');
                })
        })
    }
    obterNegociacoesSemanaAnterior() {

        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/anterior')
                .then(listaNegociacoes => {
                    resolve(listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor)));
                })
                .catch(error => {
                    console.log(error);
                    reject('Houve algum erro ao tentar listar as negociações da semana anterior!');
                })
        })
    }
    obterNegociacoesSemanaRetrasada() {

        return new Promise((resolve, reject) => {
            this._http
                .get('negociacoes/retrasada')
                .then(listaNegociacoes => {
                    resolve(listaNegociacoes.map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor)));
                })
                .catch(error => {
                    console.log(error);
                    reject('Houve algum erro ao tentar listar as negociações da semana retrasada!');
                })
        })
    }
}