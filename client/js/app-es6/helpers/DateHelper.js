export class DateHelper {

    constructor() {
        throw new Error('Esta classe não pode ser instanciada');
    }

    static dataParaTexto(data) {
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }

    static textoParaData(texto) {
        // if (!/\d{4}-\d{2}-\d{2}/.test(texto))
        if (!/\d{2}\/\d{2}\/\d{4}/.test(texto))
            throw new Error(`A data deve estar no formato 'dd/mm/aaaa'`);

        return new Date(...texto.split('/')
            .reverse()
            .map((data, index) => data - index % 2));
    }

}