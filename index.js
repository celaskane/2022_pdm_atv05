const redux = require('redux');
const prompts = require('prompts');

//cria a ação (tudo dentro do return, pelo menos o type)
const realizarVestibular = (nome, cpf) => {
    const entre6E10 = Math.random() <= 0.7
    const nota = entre6E10 ? 6 + Math.random() * 4 : Math.random() * 5
    return {
        type: "REALIZAR_VESTIBULAR",
        payload: {
            nome, cpf, nota
        }
    }
}

//cria a ação (tudo dentro do return, pelo menos o type)
const realizarMatricula = (cpf, status) => {
    return { 
        type: "REALIZAR_MATRICULA",
        payload: {
            cpf, status
        }
    }
}

//não há estado compartilhado entre reducers (um estado e uma ação)
const historicoVesitbular = (historicoVesitbularAtual = [], acao) => {
    if(acao.type === "REALIZAR_VESTIBULAR"){
        return [...historicoVesitbularAtual, acao.payload]
    }
    //devolve undefined se não entrar no if
    return historicoVesitbularAtual
}

//não cria ação, apenas a recebe
const historicoMatriculas = (historicoMatriculasAtual = [], acao) => {
    if(acao.type === "REALIZAR_MATRICULA"){
        return[...historicoMatriculasAtual, acao.payload]
    }
    return historicoMatriculasAtual
}

const todosOsReducers = redux.combineReducers({
    historicoMatriculas,
    historicoVesitbular
})

const store = redux.createStore(todosOsReducers)

const main = async () => {
    const menu = '1-Realizar Vestibular\n2-Realizar matrícula\n3-Visualizar meu status\n4-Visualizar a lista de aprovados\n0-Sair'
    let response
    do {
        response = await prompts({
            type: 'number',
            name: 'op',
            message: menu
        })
        switch(response.op){
            case 1:
                
                break;
        }
    } while (response.op !== 0)
}