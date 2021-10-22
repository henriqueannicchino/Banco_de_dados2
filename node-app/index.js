require('dotenv').config();
const app = require('./src/server');
require('./src/database');

//console.log(process.env.TESTE);

app.listen(app.get('port'), ()=>{
	console.log(`Server on port ${app.get('port')}...`);
})