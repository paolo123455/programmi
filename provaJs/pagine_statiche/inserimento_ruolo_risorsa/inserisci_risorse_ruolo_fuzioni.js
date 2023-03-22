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
  jsonVar = {"query" : "Select descrizione, id_ruolo from rilatt.ruoli" , "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#ruolo').append(' <option>'+element.id_ruolo+":"+element.descrizione +'</option>')

      
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
  jsonVar = {"query" : "Select CONCAT(nome, '_', cognome , '_', email) , id_risorsa from rilatt.risorse", "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#ris').append(' <option>'+element.id_risorsa+":"+element.concat+'</option>')
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
gridOptions.api.applyTransaction({remove:[{id_risorsa_ruolo : arg.id_t }]});




})



var drop = function(riga)
{    console.log(ListaValori)
  console.log(riga)
    console.log(ListaValori[riga]) 
    var nome = ListaValori[riga].nome
    var id_risorsa_ruolo = ListaValori[riga].id_risorsa_ruolo
    var cognome = ListaValori[riga].cognome 
    var email = ListaValori[riga].email
    var id_risorsa = ListaValori[riga].id_risorsa
    var id_ruolo = ListaValori[riga].id_ruolo
    var ruolo = ListaValori[riga].ruolo
    var data_validita = ListaValori[riga].data_validita

    console.log(nome + cognome + email + id_risorsa + " " + id_ruolo + ruolo + data_validita)
    var jsonVar = {"query" : ("delete  from rilatt.risorse_ruoli  where true and  id_risorsa = '" +id_risorsa + "' and id_ruolo = '"+
     id_ruolo+ "' and  dtvalid_ruolo = '"+ data_validita + "'").replace("= 'null'"," is NULL"),richiesta : contatoreDelete++ ,id_t : id_risorsa_ruolo , riga : riga}
   
    
    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let risorsa = $('#ris').val()
    
     let ruolo = $('#ruolo').val()

     let data = $('#dat').val()

     $('#ris').val('')
     $('#ruolo').val('')
     $('#dat').val('')

     var lvl = ruolo.split(":")[0]
     var ris_id = risorsa.split(":")[0]

  
      
     
  
     sendInsert(ris_id , lvl[0] , data)
    // aggiugniDatiLista(nome , cognome, email)

    // inviaDati(codice,risorsa,giorni)
    
 }

 /*var modificaDati = function(params){
   
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
    var data = rowValue.data_validita

    console.log(nome + email+cognome+livello+data)
    if (column === "email")
    {

      email = vecchioV
    }
    if (column === "nome")
    {
      nome = vecchioV
    }
    if (column === "cognome")
    {
      cognome = vecchioV
    }
    if (column === "livello")
    {

      livello = vecchioV
    }
    if (column === "data_validita")
    {
      data_validita = vecchioV
    }
   
  
    jsonVar = {"query" : ("update rilatt.risorse set "+column +" = '" + nuovoValore + "' where true and email = '" + email + "' and nome = '"+
     nome + "' and cognome = '"+ cognome + "'").replace("= 'null'"," is NULL")}
   //socket.emit("esegui-query-update",JSON.stringify(jsonVar))
    
    socket.on("esegui-query-update-response", (arg) => {
     
      console.log("update")
      console.log(ListaValori)


    })
    socket.on("esegui-query-update-errore", (arg) => {
      
      swal({
        title: "ERRORE",
        text:  arg.detail,
        icon: "error",
        dangerMode: true,
      })
      console.log("errore update")
    
      gridOptions.api.applyTransaction({update:[{id_risorsa : id_risorsa ,  nome : nome, cognome : cognome , email : email, livello : livello,data_validita : data_validita }]});
  

    })
 }
*/
var stampaCoordCella = function(){
    var focusedCell = gridOptions.api.getFocusedCell();
    console.log(focusedCell.column.colId)
    if(focusedCell.column.colId === "0" )
    {  console.log("drop start " + focusedCell.rowIndex + " " + ListaValori.length)
       drop(focusedCell.rowIndex)
    }
  }

  var aggiugniDatiLista = function(nome, cognome, email)
  { 

   var flag = true

   gridOptions.api.getRenderedNodes().forEach((Element) => {

     if(Element.data.nome === nome && Element.data.cognome === cognome && Element.data.email === email )
     { flag = false
    
       swal({
         title: "ERRORE",
         text: "hai già inserito questa risorsa, il  campo non verrà inserito",
         icon: "error",
         dangerMode: true,
       })
     }

   })
   if(flag)
   {
    const d = new Date();
    let month = d.getMonth() +1 ;
    let year = d.getFullYear() ;
    gridOptions.api.applyTransaction({add:[{id : contatore,  nome : nome, cognome : cognome , email : email, ruolo : ruolo }], addIndex:contatore});
    contatore = contatore +1 
   }
  }
    
 function sendInsert(risorsa , ruolo , data ) {


     jsonVar = {"query" : "insert into rilatt.risorse_ruoli (id_risorsa, id_ruolo , dtvalid_ruolo) values ('"+risorsa+"','"+ruolo+"','"+data+"' ) "}
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
      let risorsa = $('#ris').val()
    
      let ruolo = $('#ruolo').val()
 
      let data = $('#dat').val()
    console.log(ruolo)
    if (risorsa != "")var ris = risorsa.split(":")[1].split("_")
    else var ris = risorsa.split("_")
    var lvl = ruolo.split(":")
    console.log(ris)
    console.log(risorsa+ " " + ruolo + " " + data)
    sendInsertSelect(ris[0],ris[1],ris[2], lvl[1] , data)

     }

     function sendInsertSelect(nome , cognome , email , ruolo , data ) {

       var condition1 = ""
       var condition2 = ""
       var condition3 = ""
       var condition4 = ""
       var condition5 = ""
       console.log("esecuzione")

       
      if (ruolo != "" && ruolo != undefined )
       {
              condition4 = " and descrizione = '" + ruolo+"' "
       }
       if (data != ""  && data != undefined)
       {
              condition5 = " and dtvalid_ruolo = '" + data+"' "
       }
       if (nome != "" && nome != undefined )
       {
              condition1 = " and nome = '" + nome+"' "
       }
       if (cognome != "" && cognome != undefined )
       {
              condition2 = " and cognome = '" + cognome+"' "
       }
       if (email != "" && email != undefined )
       {
              condition3 = " and email = '" + email+"' "
       }
         jsonVar = {"query" : "Select id_risorsa_ruolo,descrizione as ruolo, r.id_risorsa, l.id_ruolo,to_char( dtvalid_ruolo, 'YYYY-MM-DD') as data_validita,nome,cognome,email from rilatt.risorse_ruoli rl " +
         "inner join  rilatt.risorse r on  r.id_risorsa  = rl.id_risorsa " +   
         "inner  join  rilatt.ruoli l  on l.id_ruolo  = rl.id_ruolo  where true " + condition1 + condition2 + condition3 + condition4+condition5 +''}
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