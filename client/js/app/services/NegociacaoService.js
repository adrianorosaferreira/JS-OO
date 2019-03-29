class NegociacaoService {

    obterNegociacoesSemana(callback) {
        let xhp = new XMLHttpRequest();
        xhp.open("GET", "negociacoes/semana");
        xhp.onreadystatechange = () => {
            if (xhp.readyState == 4 && xhp.status == 200) {
                callback(null, JSON.parse(xhp.responseText)
                    .map(object => new Negociacao(new Date(object.data), object.quantidade, object.valor)));
            } else {
                console.log(xhp.responseText);
                callback('Houve algum erro ao tentar listar as negociações!', null);
            }
        };
        xhp.send();
    }
}