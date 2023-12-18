// Classe que representa uma despesa
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    // Método para validar se todos os dados da despesa foram preenchidos
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

// Classe responsável por operações de armazenamento no localStorage
class Bd {
    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    // Método para obter o próximo ID disponível
    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    // Método para gravar uma despesa no localStorage
    gravar(d) {
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(d));
        localStorage.setItem('id', id);
    }

    // Método para recuperar todas as despesas registradas
    recuperarTodosRegistros() {
        let despesas = Array();
        let id = localStorage.getItem('id');

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i));

            if (despesa === null) {
                continue;
            }
            despesa.id = i;
            despesas.push(despesa);
        }
        return despesas;
    }

    // Método para pesquisar despesas com base em critérios fornecidos
    pesquisar(despesa) {
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
        }

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
        }

        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
        }

        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }

        return despesasFiltradas;
    }

    // Método para remover uma despesa do localStorage
    remover(id) {
        localStorage.removeItem(id);
    }
}

// Instância da classe Bd
let bd = new Bd();

// Função para cadastrar uma nova despesa
function cadastrarDespesa() {
    // Obtenção dos valores dos campos do formulário
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    // Criação de uma nova despesa
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    // Validação dos dados da despesa
    if (despesa.validarDados()) {
        // Gravação da despesa no localStorage
        bd.gravar(despesa);

        // Exibição de modal de sucesso
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';

        $('#modalRegistraDespesa').modal('show');

        // Limpeza dos campos do formulário
        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';

    } else {
        // Exibição de modal de erro
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro';
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
        document.getElementById('modal_btn').className = 'btn btn-danger';

        $('#modalRegistraDespesa').modal('show');
    }
}

// Função para carregar a lista de despesas na página
function carregaListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros();
    }

    let listaDespesas = document.getElementById("listaDespesas");
    listaDespesas.innerHTML = '';
    despesas.forEach(function (d) {
        // Criação das linhas da tabela com os dados das despesas
        var linha = listaDespesas.insertRow();
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

        // Conversão do tipo para uma descrição mais amigável
        switch (d.tipo) {
            case '1':
                d.tipo = 'Alimentação';
                break;
            case '2':
                d.tipo = 'Educação';
                break;
            case '3':
                d.tipo = 'Lazer';
                break;
            case '4':
                d.tipo = 'Saúde';
                break;
            case '5':
                d.tipo = 'Transporte';
                break;
        }
        linha.insertCell(1).innerHTML = d.tipo;
        linha.insertCell(2).innerHTML = d.descricao;
        linha.insertCell(3).innerHTML = d.valor;

        // Criação do botão de remoção
        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fa fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function () {
            let id = this.id.replace('id_despesa_', '');
            bd.remover(id);
            window.location.reload();
        }
        linha.insertCell(4).append(btn);
    });
}

// Função para pesquisar despesas com base nos critérios fornecidos
function pesquisarDespesa() {
    let ano = document.getElementById("ano").value;
    let mes = document.getElementById("mes").value;
    let dia = document.getElementById("dia").value;
    let tipo = document.getElementById("tipo").value;
    let descricao = document.getElementById("descricao").value;
    let valor = document.getElementById("valor").value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    let despesas = bd.pesquisar(despesa);
    carregaListaDespesas(despesas, true);
}
