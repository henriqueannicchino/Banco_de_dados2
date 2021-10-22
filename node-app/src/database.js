//----------MONGODB-------------
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost/node-app';
//const MONGODB_URI = 'mongodb+srv://'+process.env.MONGODB_USER+':'+process.env.MONGODB_PASSWORD+'@'+process.env.MONGODB_HOST+'/'+process.env.MONGODB_DATABASE+'?retryWrites=true&w=majority'; 

mongoose.connect(MONGODB_URI, {
	useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(db => console.log('Database is connected'))
.catch(err => console.log(err));

//-------------NEO4J-----------

const neo4j = require('neo4j-driver');

const driver = new neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("", "")); //("usuario", "senha")

global.session = driver.session({
	database: "neo4j", // <-- Connect to the database `neo4j`
});

/*console.log("Conectado ao Neo4j por neo4j:localhost:7687");

const neo = async () => {
	const results = await session.run("MATCH (n) return n", {});
	
	//console.log(results.records.length);
	
	const nodes = []
	results.records.forEach(res => {
		//console.log(res.get(0).properties);
		nodes.push({nome: res.get(0).properties.nome, idade: res.get(0).properties.idade.low})
	});
	
	console.log(nodes);	
	
	session.close();
}*/

//neo();





