const { Router } = require('express');
const router = Router();

const { isAuthenticated } = require('../helpers/auth');

const {renderNoteForm, createNewNote, renderNotes, renderEditForm, updateNote, deleteNote } = require('../controllers/notes.controller');

//New Note
router.get('/notes/add', isAuthenticated, renderNoteForm);
router.post('/notes/new-note', isAuthenticated, createNewNote);

//Get All notes
router.get('/notes/:usrId', isAuthenticated, renderNotes);

//Edit Notes
router.get('/notes/edit/:id', isAuthenticated, renderEditForm);
router.put('/notes/edit', isAuthenticated, updateNote);

//Delete Note
router.delete('/notes/delete', isAuthenticated, deleteNote);

module.exports = router;