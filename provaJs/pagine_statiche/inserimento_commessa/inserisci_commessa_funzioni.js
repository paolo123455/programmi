var socket = io.connect("http://localhost:8080",{
  withCredentials: true,
})

socket.on("connesso", (arg) => {
  console.log('connesso: ' + arg)
})
socket.on("disconnect", (arg) => {
  console.log("disconnesso")
})

var contatoreDelete = 0
var richiesta = 0
var ListaValori = []
var ListaValori2 = []
var contatore = 0
var setup2 = function() {
  var miarichista = richiesta
  jsonVar = {"query" : "select * from rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='FLAG_STATO'" , "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#sta').append(' <option>'+element.valore +'</option>')

      
    });
  }
  console.log("setup2 eseguito")

  })
  socket.on("esegui-query-errore", (arg) => {
    
    swal({
      title: "ERRORE",
      text: "errore nel setup della pagina, controllare i log per ulteriori dettagli",
      icon: "error",
      dangerMode: true,
    })
    console.log("errore di setup:")
    console.log(arg)

  })

}

var setup = function() {
  var miarichista = richiesta
  jsonVar = {"query" : "select * from rilatt.tab_dominio where tabella  = 'PROGETTI' AND colonna ='TIPOLOGIA'", "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#tip').append('<option>'+element.valore +'</option>')
    })
    console.log("setup1 eseguito")
  }

      
    
   

  })
  socket.on("esegui-query-errore", (arg) => {
    
    swal({
      title: "ERRORE",
      text: "errore nel setup della pagina, controllare i log per ulteriori dettagli",
      icon: "error",
      dangerMode: true,
    })
    console.log("errore di setup:")
    console.log(arg)

  })

}


socket.on("esegui-query-errore", (arg) => {
    
  swal({
    title: "ERRORE",
    text: "errore nel setup della pagina, controllare i log per ulteriori dettagli",
    icon: "error",
    dangerMode: true,
  })
  console.log("errore di setup:")
  console.log(arg)

})




socket.on("esegui-query-delete-response", (arg) => {
//ListaValori.splice(riga, 1)
console.log(arg.id_t)
ListaValori.splice(arg.riga, 1)
gridOptions.api.applyTransaction({remove:[{id_progetto : arg.id_t }]});




})

socket.on("esegui-query-delete-errore", (arg) => {
  
  
  swal({
    title: "ERRORE",
    text: arg.detail,
    icon: "error",
    dangerMode: true,
  })
 

})

var modificaDati = function(params){
   
  var nuovoValore = params.value
  var row = params.node.rowIndex
 

  var column = params.column.colId
  var columnId = params.column.instanceId
  var rowValue = params.data

  console.log(params)

  console.log(rowValue)
  console.log(row)
  console.log(columnId)
  console.log(column)
  console.log(vecchioV)
  console.log(nuovoValore)
  var email = rowValue.email 
  var nome = rowValue.nome
  var cognome = rowValue.cognome
  var livello = rowValue.livello
  var id_progetto = rowValue.id_progetto


  jsonVar = {"query" : "update rilatt.progetti set "+column +" = '" + nuovoValore + "' where true and id_progetto = '" + id_progetto+"'"}
 socket.emit("esegui-query-update",JSON.stringify(jsonVar))
  
  socket.on("esegui-query-update-response", (arg) => {
   
    console.log("update")
    console.log(ListaValori)


  })
  socket.on("esegui-query-update-errore", (arg) => {
    console.log(arg)
    swal({
      title: "ERRORE",
      text:  arg.code,
      icon: "error",
      dangerMode: true,
    })
    console.log("errore update")
  
    aggiornaFiltro()


  })
}

var drop = function(riga)
{    console.log(ListaValori)
  console.log(riga)
    console.log(ListaValori[riga]) 

    var id_progetto= ListaValori[riga].id_progetto
    

   // console.log(nome + cognome + email + id_risorsa + " " + id_ruolo + ruolo + data_validita)
    var jsonVar = {"query" : "delete  from rilatt.progetti  where true and  id_progetto = '" +id_progetto + "'",
    richiesta : contatoreDelete++ ,id_t : id_progetto , riga : riga}
   
    
    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let codice = $('#cod').val()
    
     let descrizione = $('#des').val()

     let effort_totale = $('#eff').val()

     let effort_pregresso = $('#effp').val()

     let  istituito = $('#ist').is(":checked")

     let budget= $('#bud').val()

     let  note = $('#not').val()

     let stato= $('#sta').val()

     let  tipo = $('#tip').val()

     $('#cod').val('')
     $('#des').val('')
     $('#eff').val('')
     $('#effp').val('')
     $('#ist').val('')
     $('#bud').val('')
     $('#not').val('')
     $('#sta').val('')
     $('#tip').val('')
  
     sendInsert(codice , descrizione , effort_totale, effort_pregresso, istituito, budget,note,stato,tipo)
    
 }


var stampaCoordCella = function(){
    var focusedCell = gridOptions.api.getFocusedCell();
    console.log(focusedCell.column.colId)
    if(focusedCell.column.colId === "0" )
    {  console.log("drop start " + focusedCell.rowIndex + " " + ListaValori.length)
       drop(focusedCell.rowIndex)
    }
  }

    
 function sendInsert(codice , descrizione , effort_totale, effort_pregresso, istituito, budget,note,stato,tipo) {


     jsonVar = {"query" : "insert into rilatt.progetti (codice , descrizione , effort_totale, effort_pregresso, flag_istituto, budget,note,flag_stato,tipologia)"+
     " values ('"+codice+"','"+descrizione+"','"+effort_totale+"','"+effort_pregresso+"','"+istituito+"','"+budget+"','"+note+"','"+stato+"','"+tipo+"' ) "}
    var richiesta3 = new XMLHttpRequest()
    richiesta3.open("post", "http://localhost:8080/esegui/sql/total" , true)
    richiesta3.setRequestHeader("Content-Type", "application/json");
    richiesta3.onload =  function(){
      console.log(richiesta3.response)
      dati = JSON.parse(richiesta3.response)
      if (dati.name === "error")
      {
        
       swal({
        title: "ERRORE",
        text: dati.detail,
        icon: "error",
        dangerMode: true,
      })
      ListaValori = ListaValori2 
      gridOptions.api.setRowData(ListaValori);
      }
      else { 
        aggiornaFiltro()
      }
      

      

  }  
  var t = JSON.stringify(jsonVar)
      richiesta3.send(JSON.parse(JSON.stringify(t)))
      aggiornaFiltro()
  
  
 }


    
 
   
    function aggiornaFiltro() {
      let codice = $('#cod').val()
    
     let descrizione = $('#des').val()

     let effort_totale = $('#eff').val()

     let effort_pregresso = $('#effp').val()

     let  istituito = $('#ist').is(":checked")

     let budget= $('#bud').val()

     let  note = $('#not').val()

     let stato= $('#sta').val()

     let  tipo = $('#tip').val()
   
    sendInsertSelect(codice, descrizione , effort_totale, effort_pregresso, istituito, budget,note,stato,tipo)

     }

     function sendInsertSelect(codice, descrizione , effort_totale, effort_pregresso, istituito, budget,note,stato,tipo) {

       var condition1 = ""
       var condition2 = ""
       var condition3 = ""
       var condition4 = ""
       var condition5 = ""
       var condition6 = ""
       var condition7 = ""
       var condition8 = ""
       var condition9 = ""
    
       
       if (codice != ""  && codice != undefined)
       {
              condition9 = " and codice = '" + codice+"' "
       }
       if (descrizione != "" && descrizione != undefined )
       {
              condition8 = " and descrizione = '" + descrizione+"' "
       }
       if (effort_totale != "" && effort_totale != undefined )
       {
              condition7 = " and effort_totale = '" + effort_totale+"' "
       }
       if (effort_pregresso != "" && effort_pregresso != undefined )
       {
              condition6 = " and effort_pregresso = '" + effort_pregresso+"' "
       }
       
      if (istituito != "" && istituito != undefined )
       {
              condition4 = " and flag_istituto = '" + istituito+"' "
       }
       if (budget != ""  && budget != undefined)
       {
              condition5 = " and budget = '" + budget+"' "
       }
       if (note != "" && note != undefined )
       {
              condition1 = " and note = '" + note+"' "
       }
       if (stato != "" && stato != undefined )
       {
              condition2 = " and flag_stato = '" + stato+"' "
       }
       if (tipo != "" && tipo != undefined )
       {
              condition3 = " and tipologia = '" + tipo+"' "
       }
         jsonVar = {"query" : "Select * from rilatt.progetti  " +
          " where true " + condition1 + condition2 + condition3 + condition4+condition5 +condition6+condition7+condition8+condition9+''}
        console.log(jsonVar.query)
        var richiesta3 = new XMLHttpRequest()
        richiesta3.open("post", "http://localhost:8080/esegui/sql/total" , true)
        richiesta3.setRequestHeader("Content-Type", "application/json");
        richiesta3.onload =  function(){
          console.log(JSON.parse(richiesta3.response))

          var listaRisorse = []
          listaRisorse = JSON.parse(richiesta3.response).rows 
          ListaValori = listaRisorse
          ListaValori2 = listaRisorse
       
          gridOptions.api.setRowData(ListaValori);
         
         

      }  
      var t = JSON.stringify(jsonVar)
      richiesta3.send(JSON.parse(JSON.stringify(t)))
      
     }