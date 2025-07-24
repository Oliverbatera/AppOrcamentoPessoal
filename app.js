class Despesa
{
constructor(ano, mes, dia, tipo, descricao, valor)
  {
    this.ano = ano
    this.mes = mes
    this.dia = dia
    this.tipo = tipo
    this.descricao = descricao
    this.valor = valor
  }

  validarDados(){
    for(var i in this)
      if(this[i] == undefined || this[i] == '' || this[i] == null){
        return false
      }
      return true
  }
}

class Bd{

  constructor(){
    var id = localStorage.getItem('id')
    if(id === null){
      localStorage.setItem('id', 0)
    }
  }

  getProximoId() {
    var proximoId = localStorage.getItem('id')
    return (parseInt(proximoId) + 1)
  }

  gravar(d){
    let id = this.getProximoId()
    localStorage.setItem(id, JSON.stringify(d))
    localStorage.setItem('id', id)
  }

  recuperarTodosRegistros(){
    var despesas = Array()
    var id = localStorage.getItem('id')
    for(var i = 1; i <= id; i++){
      var despesa = JSON.parse(localStorage.getItem(i))
      if(despesa === '' || despesa === undefined || despesa === null)continue
      despesa.id = i
      despesas.push(despesa)
    }
      return(despesas)
  }

  pesquisar(despesa) {
    var pesquisasFiltradas = Array()
    pesquisasFiltradas = this.recuperarTodosRegistros()

    //ano
    if(despesa.ano != ''){
      var form_ano = document.getElementById('ano')
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.ano == despesa.ano)
    }
    //dia
    if(despesa.dia != ''){
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.dia == despesa.dia)
    }
    //mes
    if(despesa.mes != ''){
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.mes == despesa.mes)
    }
    //tipo
    if(despesa.tipo != ''){
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.tipo == despesa.tipo)
    }
    //descicao
    if(despesa.descricao != ''){
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.descricao == despesa.descricao)
    }
    //valor
    if(despesa.valor != ''){
      pesquisasFiltradas = pesquisasFiltradas.filter(d => d.valor == despesa.valor)
    }
       return pesquisasFiltradas
  }

  remover(id){
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

function cadastrarDespesa() {
  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
  if(despesa.validarDados()){
    bd.gravar(despesa)
    document.getElementById('ModalLabel').innerHTML = 'Sucesso'
    document.getElementById('tipoMensagem').className = 'modal-header text-success'
    document.getElementById('btn').className = 'btn btn-success'
    document.getElementById('ModalMensagem').innerHTML = 'Registro gravado com sucesso'
    $('#modalRegistroDespesa').modal('show');
    document.getElementById('btn').addEventListener('click', function () {
    window.location.reload();
    });
  }
  else{
    document.getElementBId('ModalLabel').innerHTML = 'Erro'
    document.getElementById('ModalMensagem').innerHTML = 'Ocorreu Erro na gravação do registro, Favor verificar os dados.'
    document.getElementById('tipoMensagem').className = 'modal-header text-danger'
    document.getElementById('btn').className = 'btn btn-danger'
    $('#modalRegistroDespesa').modal('show')
  }
}

function carregaListaDespesa(despesas = Array(), filtro = false){
  if(despesas.length == 0 && filtro == false){
  despesas = bd.recuperarTodosRegistros()
  }
  var listaDespesas = document.getElementById('listaDespesas')
  listaDespesas.innerHTML = ''
    despesas.forEach(function(d) {
        console.log(d)
        var linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${ d.ano}`
        switch (d.tipo){
        case '1' : d.tipo = 'Alimentação'
          break
        case '2' : d.tipo = 'Educação'
          break
        case '3' : d.tipo = 'Lazer'
          break
        case '4' : d.tipo = 'Saúde'
          break
        case '5' : d.tipo = 'transporte'
          break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor
        var btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            id = btn.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
  });
}

  function pesquisarDepesas(){
    var ano = document.getElementById('ano').value
    var dia = document.getElementById('dia').value
    var mes = document.getElementById('mes').value
    var tipo = document.getElementById('tipo').value
    var descricao = document.getElementById('descricao').value
    var valor = document.getElementById('valor').value
    var despesa = new Despesa(ano, dia, mes, tipo, descricao, valor)
    var despesas = bd.pesquisar(despesa)
    this.carregaListaDespesa(despesas, true)
  }

