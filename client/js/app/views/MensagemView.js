class MensagemView extends View {

    constructor(element) {
        super(element);
    }

    _template(model) {
        return `<p class="alert alert-info">${model.texto}</p>`;
    }
}