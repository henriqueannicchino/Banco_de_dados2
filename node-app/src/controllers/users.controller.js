const usersCtrl = {};

const passport = require('passport');
const User = require('../models/User');

const UserNeo4j = require('../modelsNeo4j/User');
const multer = require('multer');
const fs = require('fs');



usersCtrl.renderSignUpForm = (req, res) => {
	res.render('users/signup');
};

usersCtrl.signup = async (req, res) => {
	
	const errors = [];
	const {name, email, password, confirm_password, image} = req.body;
	
	const file = (req.file);
		
	if(password !== confirm_password){
		errors.push({text: 'Passwords do not match'});
	}
	if(password.length < 4){
		errors.push({text: 'Passwords must be least 4 characteres'});
	}
	if(errors.length > 0){
		res.render('users/signup', {errors, name, email});
	}
	else{
		const emailUser = await User.findOne({email});
		if(emailUser){
			req.flash('error_msg', 'The e-mail is already in use.');
			res.redirect('signup');
		}
		else{
			let newUser;
			if(!file){
				newUser =  new User({name, email, password});
				newUser.password = await newUser.encryptPassword(password);
				const newUserResult = await newUser.save();
				const newUserNeo = await session.run(`CREATE (n:Usuario {id: "${newUserResult._id}", name: "${newUserResult.name}", email: "${newUserResult.email}", perfilImage: null })`, {});
			}
			else{
				let img = fs.readFileSync(file.path);
				let encode_image = img.toString('base64');
				newUser =  new User({name, email, perfilImage: encode_image, password});
				newUser.password = await newUser.encryptPassword(password);
				const newUserResult = await newUser.save();
				const newUserNeo = await session.run(`CREATE (n:Usuario {id: "${newUserResult._id}", name: "${newUserResult.name}", email: "${newUserResult.email}", perfilImage: "${newUserResult.perfilImage}" })`, {});
			}
			req.flash('success_msg', 'You are Registered.');
			res.redirect('login');
		}
	}
	
};

usersCtrl.renderLoginForm = (req, res) => {
	res.render('users/login');
};

usersCtrl.login = async (req, res) => {
	
	const {email, password} = req.body;
	const user = await User.findOne({email});
	if(!user){
		if(email.length>0)
			req.flash('error_msg', 'User not found.');
		res.redirect('login');
	}
	else{
		const match = await user.matchPassword(password);
		if(match){
			
			req.login(user._id, function(err){
				res.redirect(`/notes/${user._id}`);
			});
		}
		else{
			req.flash('error_msg', 'Invalid Password.');
			res.redirect('login');
		}
	}
};
/*usersCtrl.login = passport.authenticate('local', {
	failureRedirect: '/users/login',
	successRedirect: '/notes',
	failureFlash: true
});*/

usersCtrl.logout = (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out now');
	res.redirect('/users/login');
};


usersCtrl.sendRequest = async (req, res) => {
	
	usr1 = req.query.usr1;
	usr2 = req.query.usr2;
	const newUserRequest = await session.run(`MATCH (u:Usuario), (u2:Usuario) WHERE u.id = "${usr1}" AND u2.id = "${usr2}" CREATE (u)-[:PENDENTE]->(u2)`, {});
	
	res.redirect(`/notes/${usr1}`);
	
};

usersCtrl.cancelRequest = async (req, res) => {
	
	usr1 = req.query.usr1;
	usr2 = req.query.usr2;
	
	const newUserRequest = await session.run(`MATCH (u:Usuario {id: "${usr1}"})-[p:PENDENTE]->(u2:Usuario {id: "${usr2}"}) 
												DELETE p`, {});
	
	res.redirect(`/notes/${usr1}`);	
};

usersCtrl.acceptRequest = async (req, res) => {
	
	usr1 = req.query.usr1;
	usr2 = req.query.usr2;
	
	const deletePendRequest = await session.run(`MATCH (u:Usuario {id: "${usr1}"})<-[p:PENDENTE]-(u2:Usuario {id: "${usr2}"})
												DELETE p`, {});
						
												
	const acceptFriend = await session.run(`MATCH (u:Usuario), (u2:Usuario) WHERE u.id = "${usr1}" AND u2.id = "${usr2}" 
												CREATE (u)-[:AMIGO]->(u2)
												CREATE (u)<-[:AMIGO]-(u2)`, {})									
								
	res.redirect(`/notes/${usr1}`);	
};

usersCtrl.removeFriend = async (req, res) => {
	
	usr1 = req.query.usr1;
	usr2 = req.query.usr2;
		
	const newUserRequest = await session.run(`MATCH (u:Usuario {id: "${usr1}"})-[p:AMIGO]->(u2:Usuario {id: "${usr2}"})
												MATCH (u:Usuario {id: "${usr1}"})<-[p2:AMIGO]-(u2:Usuario {id: "${usr2}"})
												DELETE p, p2`, {})
	
	res.redirect(`/notes/${usr1}`);	
};

usersCtrl.renderUpdateImage = (req, res) => {
	res.render('users/edit-perfil-photo');
};

usersCtrl.updateImage = async (req, res) => {
	
	const userIdStr = await req.query.usrId.toString();
	const file = (req.file);
	
	if(file){
		let img = fs.readFileSync(file.path);
		let encode_image = img.toString('base64');
		User.updateOne({_id: userIdStr}, {$set: {perfilImage: encode_image} }).exec();
		const updatePerfilPhoto = await session.run(`MATCH (u:Usuario {id: "${userIdStr}" }) SET u.perfilImage = "${encode_image}"`, {});
		
		//deleta a imagem da pasta temporaria
		fs.unlinkSync(file.path)
	}
	
	res.redirect(`/notes/${userIdStr}`);	
};

module.exports = usersCtrl;