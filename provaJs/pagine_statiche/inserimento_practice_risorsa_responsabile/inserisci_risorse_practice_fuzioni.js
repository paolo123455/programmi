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
  jsonVar = {"query" : "Select descrizione, id_practice from rilatt.practice" , "richiesta" : richiesta++}
  socket.emit("esegui-query",JSON.stringify(jsonVar))
  socket.on("esegui-query-response", (arg) => {
    console.log(arg.richiesta)
    if (arg.richiesta === miarichista)
    {
    var listaRows = []
    listaRows = arg.rows
    console.log(listaRows)
    listaRows.forEach(element => {
          $('#practice').append(' <option>'+element.id_practice+":"+element.descrizione +'</option>')

      
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
gridOptions.api.applyTransaction({remove:[{id_responsabile_practice: arg.id_t }]});




})
socket.on("esegui-query-delete-errore", (arg) => {
  
  
  swal({
    title: "ERRORE",
    text: arg.detail,
    icon: "error",
    dangerMode: true,
  })
 

})



var drop = function(riga)
{    console.log(ListaValori)
  console.log(riga)
    console.log(ListaValori[riga]) 
    var nome = ListaValori[riga].nome
    var id_risorsa_pratice = ListaValori[riga].id_responsabile_practice
    var cognome = ListaValori[riga].cognome 
    var email = ListaValori[riga].email
    var id_risorsa = ListaValori[riga].id_risorsa
    var id_practice = ListaValori[riga].id_practice
    var practice= ListaValori[riga].practice
    var data_validita = ListaValori[riga].data_validita

    console.log(nome + cognome + email + id_risorsa + " " + id_practice + practice + data_validita)
    var jsonVar = {"query" : ("delete  from rilatt.responsabile_practice  where true and  id_risorsa = '" +id_risorsa + "' and id_practice = '"+
     id_practice+ "' and  dtvalid_responsabile_practice = '"+ data_validita + "'").replace("= 'null'"," is NULL"),richiesta : contatoreDelete++ ,id_t : id_risorsa_pratice , riga : riga}
   
    
    socket.emit("esegui-query-delete",JSON.stringify(jsonVar))
}


 var verificaDati = function () {
     let risorsa = $('#ris').val()
    
     let practice = $('#practice').val()

     let data = $('#dat').val()

     $('#ris').val('')
     $('#practice').val('')
     $('#dat').val('')

     var lvl = practice.split(":")[0]
     var ris_id = risorsa.split(":")[0]

  
      
     
  
     sendInsert(ris_id , lvl[0] , data)
    // aggiugniDatiLista(nome , cognome, email)

    // inviaDati(codice,risorsa,giorni)
    
 }

var stampaCoordCella = function(){
    var focusedCell = gridOptions.api.getFocusedCell();
    console.log(focusedCell.column.colId)
    if(focusedCell.column.colId === "0" )
    {  console.log("drop start " + focusedCell.rowIndex + " " + ListaValori.length)
       drop(focusedCell.rowIndex)
    }
  }



 function sendInsert(risorsa , practice , data ) {


     jsonVar = {"query" : "insert into rilatt.responsabile_practice (id_risorsa, id_practice , dtvalid_responsabile_practice) values ('"+risorsa+"','"+practice+"','"+data+"' ) "}
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
    
      let practice = $('#practice').val()
 
      let data = $('#dat').val()
    console.log(practice)
    if (risorsa != "")var ris = risorsa.split(":")[1].split("_")
    else var ris = risorsa.split("_")
    var lvl = practice.split(":")
    console.log(ris)
    console.log(risorsa+ " " + practice + " " + data)
    sendInsertSelect(ris[0],ris[1],ris[2], lvl[1] , data)

     }

     function sendInsertSelect(nome , cognome , email , practice , data ) {

       var condition1 = ""
       var condition2 = ""
       var condition3 = ""
       var condition4 = ""
       var condition5 = ""
       console.log("esecuzione")

       
      if (practice != "" && practice != undefined )
       {
              condition4 = " and descrizione = '" + practice+"' "
       }
       if (data != ""  && data != undefined)
       {
              condition5 = " and dtvalid_responsabile_practice = '" + data+"' "
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
         jsonVar = {"query" : "Select id_responsabile_practice,descrizione as practice, r.id_risorsa, l.id_practice,to_char( dtvalid_responsabile_practice, 'YYYY-MM-DD') as data_validita,nome,cognome,email from rilatt.responsabile_practice rl " +
         "inner join  rilatt.risorse r on  r.id_risorsa  = rl.id_risorsa " +   
         "inner  join  rilatt.practice l  on l.id_practice  = rl.id_practice  where true " + condition1 + condition2 + condition3 + condition4+condition5 +''}
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