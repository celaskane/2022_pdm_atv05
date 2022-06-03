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
            case 1:{
                //1. capturar o nome da pessoa usando prompts
                const { nome } = await prompts({
                    type: 'text',
                    name: 'nome',
                    message: 'Digite seu nome'
                })
                //2. capturar o cpf da pessoa usando prompts
                const { cpf } = await prompts({
                    type: 'text',
                    name: 'cpf',
                    message: 'Digite seu cpf'
                })
                //3. produzir uma ação que representa a realização do vestibular
                const acao = realizarVestibular(nome, cpf)
                //4. direcionar (dispatch) a ação ao reducer apropriado
                store.dispatch(acao)
                break;
            }
            case 2:{
                //1. capturar o cpf usando prompts
                const { cpf } = await prompts({
                    type: 'text',
                    name: 'cpf',
                    message: 'Digite seu cpf'
                })
                //2. verificar se o usuário de cpf informado existe no estado centralizado e, mais ainda, tem nota pelo menos 6
                //pegue o estado com store.getState() do estado, acessar a propriedade chamada historicoVestibular
                //essa propriedade é uma coleção, portanto, você pode chamar o método find.
                //Entregue para o método find uma arrow function que compara cpf e nota
                store.getState().historicoVesitbular.find((aluno) => {
                    return aluno.cpf === cpf && aluno.nota  >= 6
                })
                //3. se um aluno for encontrado, faça a sua matrícula produzindo uma ação e direcionando ao reducer apropriado. 
                //Exiba uma mensagem confirmando logo após
                if(aprovado){
                    const acao = realizarMatricula(cpf, 'M')
                    store.dispatch(acao)
                    console.log("Parabéns, matriculado")
                }
                else{
                //4. Caso contrário, registre no histórico essa tentativa com status NM
                const acao = realizarMatricula(cpf, 'NM')
                store.dispatch(acao)
                console.log("Infelizmente você não foi aprovado no vestibular ainda.")
                }
                break;
            }
            case 3:{
                //1. capturar o cpf do usuário
                const { cpf } = await prompts({
                    type: 'text',
                    name: 'cpf',
                    message: 'Digite seu cpf'
                })
                //2. buscar o aluno no histórico de matrículas (store.getState().historicoMatriculas)
                store.getState().historicoVesitbular.find((aluno) => {
                    return aluno.cpf === cpf
                })
                //3. Exibir o status do aluno caso ele exista
                if(aluno){
                    console.log(`Seu status é: ${aluno.status}`)
                }
                //4. caso contrário exibir uma mensagem dizendo que ele não existe
                else{
                    console.log("Você não existe")
                }
                break;
            }
            case 4:{
                const aprovados = store.getState().historicoVesitbular.filter((aluno) => aluno.nota >= 6)
                console.log(aprovados)
                break;
            }

        }
    } while (response.op !== 0)
}
main()