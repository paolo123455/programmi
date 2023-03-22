var express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;
const path = require("path")
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors())
const { Pool, Client } = require('pg');
const pool = new Pool({
	host: "10.121.172.33",
	port: 5431,
	user: "admin",
	password: "almawave",
	database: "project_review"
});

app.use(express.static(path.join(__dirname, "./")));
app.use(express.static(path.join(__dirname, "/pagine_statiche")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/modifica_dati")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserisci_risorse")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_livello_risorsa")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_ruolo_risorsa")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_practice")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_practice_risorsa_responsabile")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_practice_risorsa")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_commessa")));
app.use(express.static(path.join(__dirname, "/pagine_statiche/inserimento_commessa_risorsa")));



/********************************************/
/*				  WEB SOCKET	 		    */
/********************************************/

io.on("connection",async(socketEnt) => {
   
	socketEnt.on("disconnect", (arg) =>{
	  console.log("Server disconnesso")
	})
  
	socketEnt.on("esegui-query", (arg) =>{
	  var dati = JSON.parse(arg);
	  console.log("richiesta numero: "+dati.richiesta)
	  console.log("esecuzione 'esegui-query'  query : "+ dati.query )
	  pool.query(dati.query, function (err, res2) {
		  if(err)console.log(err),  socketEnt.emit("esegui-query-errore",err)
		  else {
			res2["richiesta"] = dati.richiesta
			console.log(res2) ; socketEnt.emit("esegui-query-response",res2)}
		  
	  });
	})
	console.log("connesso")
	socketEnt.emit("connesso", "true")
	socketEnt.on("esegui-query-update", (arg) =>{
		var dati = JSON.parse(arg);
	    
		console.log("esecuzione 'esegui-query'  query : "+ dati.query )
		pool.query(dati.query, function (err, res2) {
			if(err)console.log("errore " + err),err["richiesta"] = dati.richiesta,  socketEnt.emit("esegui-query-update-errore",err)
			else {
				
				  console.log(res2) ; res2["richiesta"] = dati.richiesta; 
			      
			      socketEnt.emit("esegui-query-update-response",res2)
				
				
				}
			
		});
	  })

	  socketEnt.on("esegui-query-delete", (arg) =>{
		var dati = JSON.parse(arg);
	   
		console.log("esecuzione 'esegui-query'  query : "+ dati.query )
		pool.query(dati.query, function (err, res2) {
			if(err)console.log("errore"),console.log(err),err["richiesta"] = dati.richiesta,  socketEnt.emit("esegui-query-delete-errore",err)
			else {console.log(res2)  ;
				 res2["richiesta"] = dati.richiesta;
				 res2["id_t"]  = dati.id_t 
				 res2["riga"] = dati.riga
				 socketEnt.emit("esegui-query-delete-response",res2)
				}
			
		});
	  })

	  
	  
	  
	
  })
  
/********************************************/
/*				  API INTERNE	 		    */
/********************************************/

app.get("/", function (request , response){ 
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_livello_risorsa/inserimento_livello_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserisci_risorse/inserisciRisorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_ruolo_risorsa/inserimento_ruolo_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice/inserimento_practice.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice_risorsa_responsabile/inserimento_practice_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_practice_risorsa/inserimento_practice_risorse.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_commessa/inserimento_commessa.html"))
	//response.sendFile(path.join(__dirname,"/pagine_statiche/inserimento_commessa_risorsa/inserimento_commessa_risorse.html"))
	console.log(path.join(__dirname,"/pagine_statiche/home/home.html"))
	response.sendFile(path.join(__dirname,"/pagine_statiche/home/home.html"))
})

app.post('/esegui/sql/total', async (req , res) => {
	
	var query = req.body.query
	console.log(query)

	  
	
	pool.query(query , function (err, res2) {
	   
		if (err){ console.log("errore: " + err); res.send(err)}
		else {
		if (res2) console.log("ok: " + res2);res.send(res2)
		}
		
	});

  })



  server.listen(port, function() {
	console.log(`Listening on port ${port}`);
  });
  


  
/********************************************/
/*				 roba angular  		    */
/********************************************/

app.get('/testRest', async (req, res) => {

	
	res.send({"prova" : "prova"})
  
  })
  app.post('/esegui/query/dizionario', async (req, res) => {

    console.log(req.body.query)
	console.log("dizionario")
	var query = req.body.query

	/*const pool3 = new Pool({
		host: "localhost",
		port: 5432,
		user: "postgres",
		password: "Assassino10@",
		database: "postgres"
	});*/

	const pool3 = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	
	
	
	pool3.query(query, function (err, res2) {
		if(err) {console.log(err)
		        res.send(err)}
		else {
			console.log("tutto ok")
			//console.log(res2)
			console.log("tutto ok")
			res.send(res2)
		}
		
	});

	pool3.end(function (err) {
		console.log('errore: '+ err);
	});
  
  })
  

  


 
app.post('/esegui/query/selezione', async (req, res) => {

    console.log(req.body.query)
	var query = req.body.query

	const pool2 = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	
	
	pool2.query(query, function (err, res2) {
		if(err) {
			err["upd"] = "nok"
			console.log(err)
			res.send(err)
		
		}
		else {
			//console.log(res2)
			res2['upd'] = "ok"
			//console.log(res2)
		  res.send(res2)
		}
		
	});

	pool2.end(function (err) {
		console.log('errore: '+ err);
	});
  
  })
  

  


/********************************************/
/*				 DA ELIMINARE	 		    */
/********************************************/  
app.post('/inserisci/dati', async (req, res) => {

  console.log(req.body)
  res.send("ok")

})

app.post('/insert/update/dati', async (req,res) => {
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
  var query = ""
  var listaP = []
  listaP = req.body.listaPersone
  console.log(listaP)
  listaP.forEach(element => {
	var risorsa = element.risorsa
	console.log(risorsa)
	var  listaC = []
	listaC = element.listaCodici
	listaC.forEach(element2  => { 
		var modificato = element2.editato
		var creato = element2.creato 
		console.log(modificato + " " + creato)
		if (creato  )
		{
			query = query + " insert into public.pianificazioni_commesse values " +
		 "('"+element2.codice+"','"+risorsa+"','"+element2.giorni+"','"+2+"','"+2022+"','"+ 2 +"');"
		
		}
		else {
             
			 if (modificato)
			 { 
                query = query + " update public.pianificazioni_commesse set giornate_pianificate = '" + element2.giorni + "' where codice = '"
				+ element2.codice +"' and risorsa = '" + risorsa + "' ;"        
			 } 

		} 
	})
	
  });
  console.log("query" + query)
  pool.query(query , function( err , res2){
     if (res2)
	 {
		res.send("ok")
	 }
	 if (err)
	 {
		res.send(err)
	 }


  } )

  //res.send(req.body.listaPersone)
 



})

app.get('/dati/risorse', async (req, res) => {
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	

    pool.connect(); 
	pool.query('select   risorsa , codice , giornate_pianificate from public.pianificazioni_commesse pc  order by risorsa' , function (err, res2) {
	    if (err){ res.send(err)}
		else{res.send( res2.rows)}
		
		
	});

	pool.end(function (err) {
		console.log('errore: '+ err);
	});

	
  })
  

app.get('/dati/commesse', async (req, res) => {
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	

    pool.connect(); 
	pool.query('select distinct  codice from rilatt.progetti p' , function (err, res2) {
	    if (err){console.log(err + "ciao"); res.send(err)}
		else{res.send( res2.rows)}
		
		
	});

	pool.end(function (err) {
		console.log('errore: '+ err);
	});

	
  })
  


  app.post('/inserisci/commessa/rilatt', async (req, res) => {
        
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	var listaRows = [] 
	listaRows = req.body.listaRows
	console.log(listaRows)
	var query = "insert into rilatt.progetti (commessa , codice) values "
	console.log(listaRows)
	listaRows.forEach(element => { 

	   query = query + "('"+element.nomeCommessa+"','"+element.codice+"'),"
	   
	});
	query = query.substring(0, query.length -1 )
   
  
   pool.connect(); 
   pool.query(query , function (err, res2) {
	  if (err) res.send(err)
	  if (res2) res.send("ok")
	   
   });


  })







  


  app.post('/esegui/sql/total', async (req , res) => {
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	var query = req.body.query
	console.log(query)

	  
	pool.connect(); 
	pool.query(query , function (err, res2) {
	   
		if (err){ console.log("errore: " + err); res.send(err)}
		else {
		if (res2) console.log("ok: " + res2);res.send(res2)
		}
		
	});
	pool.end(function (err) {
	 console.log('errore: '+ err);
 });

  })







  app.post('/inserisci/risorse/rilatt', async (req, res) => {
        
	const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
	var listaRows = [] 
	listaRows = req.body.listaRows
	console.log(listaRows)
	var query = "insert into rilatt.risorse (nome , cognome) values "
	console.log(listaRows)
	listaRows.forEach(element => { 

	   query = query + "('"+element.nome+"','"+element.cognome+"'),"
	   
	});
	query = query.substring(0, query.length -1 )
   
  
   pool.connect(); 
   pool.query(query , function (err, res2) {
	  
	if (err){ console.log("errore: " + err); res.send(err)}
	else {
	if (res2) console.log("ok: " + res2);res.send("ok")
	}
	
	   
   });
   pool.end(function (err) {
	console.log('errore: '+ err);
});


  })  

app.post('/inserisci/dati/rilatt', async (req, res) => {

	
    const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	
  
	 var listaRows = [] 
	 listaRows = req.body.listaRows
	 console.log(listaRows)
	 var query = "insert into  public.pianificazioni_commesse values "
	 console.log(listaRows)
	 listaRows.forEach(element => { 

		query = query + "('"+element.codice+"','"+element.risorsa+"','"+element.giorni+"','"+element.mese+"','"+element.anno+"','"+element.data +"'),"
		
	 });
	 query = query.substring(0, query.length -1 )
	
   
	pool.connect(); 
	pool.query(query , function (err, res2) {
		if (err){ console.log("errore: " + err); res.send(err)}
		else {
		if (res2) console.log("ok: " + res2);res.send("ok")
		}
		
		
	});

	pool.end(function (err) {
		console.log('errore: '+ err);
	});
});


app.post('/prova', async (req,res)=> { 
    
    const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	console.log("funzione"); 
	console.log(req.body.risora); 
	console.log(req.body.commessa); 
	onsole.log(req.body.giornate); 

})
app.get('/seleziona/dati/tabella3', async (req, res) => {
	//var dati = JSON.stringify(req.body);
	//var datiDB = JSON.parse(dati);
	console.log("inizio")
	
    const pool = new Pool({
		host: "10.121.172.33",
		port: 5431,
		user: "admin",
		password: "almawave",
		database: "project_review"
	});
	

    pool.connect(); 
	pool.query('select * from rilatt.risorse' , function (err, res2) {
		if (err){ console.log("errore: " + err); res.send(err)}
		else {
		if (res2) console.log("ok: " + res2);res.send("ok")
		}
		
		
	});

	pool.end(function (err) {
		console.log('errore: '+ err);
	});
});