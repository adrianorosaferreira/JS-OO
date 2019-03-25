class DataHelper {

    dataParaTexto(data) {
        return data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear();
    }

    textoParaData(texto) {
        return new Date(...texto
            .split('-')
            .map((data, index) => data - index % 2));
    }

}