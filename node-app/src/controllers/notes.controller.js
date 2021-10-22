const notesCtrl = {};
const Note = require('../models/Notes');
const User = require('../models/User');


notesCtrl.renderNoteForm = (req, res) => {
    //res.send('Notes Add');
	res.render('notes/new-note');
};

notesCtrl.createNewNote = async (req, res) => {
	const {title, description } =  req.body;
	const newNote = new Note({title, description});
	newNote.user = req.user.id;
	try{
		await newNote.save();
		req.flash('success_msg', 'Note Added Successfully');
		res.redirect(`/notes/${req.user.id}`);
	}
	catch(error){
		console.log(error);
	}
};

notesCtrl.renderNotes = async (req, res) => {

	thisUser = req.user._id.toString();
		
	userIdStr = await req.params.usrId.toString();
	
	if(thisUser === userIdStr)
		flagUser = true;
	else{
		flagUser = false;
		userIdStr = thisUser;
	}
	
	//puxa somentes os q não são amigos nem pendentes
	const allUsers = await session.run(`MATCH (u:Usuario) WHERE u.id = "${userIdStr}" 
											MATCH (u), (u2:Usuario) WHERE NOT (u)-[:PENDENTE]->(u2) AND NOT (u)<-[:PENDENTE]-(u2) AND NOT (u)-[:AMIGO]->(u2)
											MATCH (u2) WHERE u2.id <> "${userIdStr}" RETURN u2`, {});
	

	const pendRequests = await session.run(`MATCH (u:Usuario) WHERE u.id = "${userIdStr}" 
												MATCH (u), (u2:Usuario) WHERE (u2)-[:PENDENTE]->(u) RETURN u2`, {});
	
	const pendFriends = await session.run(`MATCH (u:Usuario) WHERE u.id = "${userIdStr}"
											MATCH (u), (u2:Usuario) WHERE (u)-[:PENDENTE]->(u2) RETURN u2`)
	
	const friends = await session.run(`MATCH (u:Usuario) WHERE u.id = "${userIdStr}"
											MATCH (u), (u2:Usuario) WHERE (u)-[:AMIGO]->(u2) RETURN u2`)
	
	const allusers = []
	allUsers.records.forEach(user => {
		allusers.push({id: user.get(0).properties.id, currentUserId: thisUser, name: user.get(0).properties.name, perfilImage: user.get(0).properties.perfilImage})
	});
	
	const allPendRequests = [];
	pendRequests.records.forEach(user => {
		allPendRequests.push({id: user.get(0).properties.id, currentUserId: thisUser, name: user.get(0).properties.name, perfilImage: user.get(0).properties.perfilImage});
	});
	
	const pendFriendsRequests = [];
	pendFriends.records.forEach(user => {
		pendFriendsRequests.push({id: user.get(0).properties.id, currentUserId: thisUser, name: user.get(0).properties.name, perfilImage: user.get(0).properties.perfilImage});
	});
	
	const friendsAccepted = [];
	friends.records.forEach(user => {
		friendsAccepted.push({id: user.get(0).properties.id, currentUserId: thisUser, name: user.get(0).properties.name, perfilImage: user.get(0).properties.perfilImage});
	});
	
	res.locals.pend = allPendRequests;
	
	const notes = await Note.find({"user": req.params.usrId});
	const usrNamePhoto = await User.findById(req.params.usrId).select('name perfilImage');
	
	res.locals.pageOwner = {name: usrNamePhoto.name, perfilImage: usrNamePhoto.perfilImage};
	res.locals.isPageOwner = {flagUser: flagUser};
	
	await notes.map((note) => {
		note.usrName = usrNamePhoto.name;
		note.loggedUserId = flagUser;
	});
	
	res.render('notes/all-notes', {notes, allusers, allPendRequests, pendFriendsRequests, friendsAccepted, flagUser});
};

notesCtrl.renderEditForm = async (req, res) => {
	const note = await Note.findById(req.params.id);
    res.render('notes/edit-note', {note});
};

notesCtrl.updateNote = async (req, res) => {
	const id = req.query.id, usrId = req.query.usrId;
	const {title, description } =  req.body;
	await Note.findByIdAndUpdate(id, {title,description});
	
    res.redirect(`/notes/${usrId}`);
};

notesCtrl.deleteNote = async (req, res) => {
	const id = req.query.id, usrId = req.query.usrId;
	await Note.findByIdAndDelete(id);
	res.redirect(`/notes/${usrId}`);
};

module.exports = notesCtrl; 