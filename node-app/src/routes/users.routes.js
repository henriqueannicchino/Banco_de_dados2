const { Router } = require('express');
const router = Router();
const multer = require('multer');
const store = require('../middleware/multer');
const { isAuthenticated } = require('../helpers/auth');

const { renderSignUpForm, signup, renderLoginForm, login, logout, sendRequest, cancelRequest, acceptRequest, removeFriend, renderUpdateImage, updateImage} = require('../controllers/users.controller');

router.get('/users/signup', renderSignUpForm);
router.post('/users/signup', store.single('image'), signup);

router.get('/users/login', renderLoginForm);
router.post('/users/login', login);

router.get('/users/logout', logout);


//funcoes amigos
router.post('/users/sendRequest', isAuthenticated, sendRequest);
router.post('/users/cancelRequest', isAuthenticated, cancelRequest);
router.post('/users/acceptRequest', isAuthenticated, acceptRequest);
router.post('/users/removeFriend', isAuthenticated, removeFriend);

//atualiza foto do perfil
router.get('/users/edit-perfil-photo', isAuthenticated, renderUpdateImage);
router.put('/users/edit-perfil-photo', store.single('image'), updateImage);

module.exports = router;