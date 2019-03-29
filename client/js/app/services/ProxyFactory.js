class ProxyFactory {

    static create(objeto, acao, props) {
        return new Proxy(objeto, {
            get(target, prop, receiver) {
                if (props.includes(prop) && ProxyFactory._isFunction(target[prop])) {

                    return function() {
                        acao(target);
                        return Reflect.apply(target[prop], target, arguments);
                    }
                }

                return Reflect.get(target, prop, receiver);
            },
            set(target, prop, value, receiver) {

                let retorno = Reflect.set(target, prop, value, receiver);
                if (props.includes(prop)) acao(target);

                return retorno;
            }
        });
    }

    static _isFunction(attr) {

        return typeof(attr) == typeof(Function);
    }
}