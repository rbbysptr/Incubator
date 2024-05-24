const express = require('express');
const router = express.Router();
const Controller = require("../controllers/index");
const { incubatorValidationRules } = require('../helpers/validationRules');

router.get("/", Controller.showHomePage);

// router.get("/login", Controller.showLoginPage);
// router.post("/login", Controller.login);

// // Route untuk logout
// router.get("/logout", Controller.logout);

router.get("/incubators", Controller.showIncubator);

router.get("/incubators/add", Controller.incubatorAdd);
router.post('/incubators/add',incubatorValidationRules(), Controller.incubatorAddPost);

router.get("/incubators/detail/:id", Controller.incubatorDetail);

router.get("/incubators/:incubatorId/startUp/add",Controller.startupAdd);
router.post("/incubators/:incubatorId/startUp/add",Controller.startupAddPost);

router.get("/incubators/:incubatorId/startUp/:startUpId/edit", Controller.showEditForm);
router.post("/incubators/:incubatorId/startUp/:startUpId/edit", Controller.editStartup);

router.post('/incubator/:incubatorId/startup/:startupId/delete', Controller.deleteStartup);

router.get("/startUp", Controller.showStartUp);
router.post('/startUp/:startupId/delete', Controller.startupDelete);

module.exports = router;