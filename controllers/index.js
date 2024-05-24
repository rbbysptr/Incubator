const { Op } = require("sequelize");
const { Incubator, Startup,Sequelize, sequelize } = require("../models");
const formatToRupiah = require("../helpers/formatToRupiah");
const { validationResult } = require('express-validator');
const { incubatorValidationRules } = require('../helpers/validationRules');
const startup = require("../models/startup");


class Controller {
    static async showHomePage(req, res) {
        try {
            res.render('home');
        } catch (error) {
            console.error(error);
            res.send('error');
        }
    }
    static async showIncubator(req, res) {
        try {
            let data = await Incubator.findAll();
            res.render('incubator/incubatorHome', { data });
        } catch (error) {
            res.send(error);
        }
    }
    static async incubatorAdd(req, res) {
        try {
            res.render('incubator/incubatorAdd');
        } catch (error) {
            res.send(error);
        }
    }
    static async incubatorAddPost(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('incubator/incubatorAdd', { errors: errors.array() });
        }

        let { name, location, level } = req.body;
        await Incubator.create({
            name,
            location,
            level,
        });
        res.redirect('/incubators',{ notification: notificationMessage });
    } catch (error) {
        res.send(error);
    }
}
    static async incubatorDetail(req, res) {
        try {
            const { id } = req.params;
            const { notification } = req.query;
            const incubator = await Incubator.findByPk(id);
            const startups = await Startup.findAll({
            where: {
                IncubatorId: id
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
            });
            let totalValuation = 0;
            if (startups.length > 0) {
                totalValuation = startups.reduce((accumulator, currentStartup) => {
                    return accumulator + currentStartup.valuation;
                }, 0);
            }
            let formattedTotalValuation = "-";
            if (!isNaN(totalValuation) && totalValuation !== 0) {
                formattedTotalValuation = formatToRupiah(totalValuation);
            }
            res.render('incubator/incubatorDetail', { incubator, startups, formattedTotalValuation, notification, incubatorId: id });
        } catch (error) {
            console.log(error);
        }
    }
    static async startupAdd(req, res) {
        try {
        
        const { incubatorId } = req.params;
        const incubator = await Incubator.findByPk(incubatorId);
        res.render('startup/startupAdd', { incubator });
    } catch (error) {
        res.send(error);
    }
}
 static async startupAddPost(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map(error => `${error.msg}`).join('');
            return res.status(400).send(`${errorMessage}`);
        }
        const { incubatorId } = req.params;
        let { startUpName, founderName, dateFound, educationOfFounder, roleOfFounder, valuation } = req.body;

        if (!startUpName || !founderName || !dateFound || !educationOfFounder || !roleOfFounder || !valuation) {
            return res.send('All fields are required');
        }
        const currentDate = new Date();
        const startupFoundDate = new Date(dateFound);
        const differenceInYears = (currentDate - startupFoundDate) / (1000 * 3600 * 24 * 365);
        if (differenceInYears < 5) {
            return res.send('Startup must be at least 5 years old');
        }
        if (roleOfFounder.toLowerCase() === 'hustler') {
            if (educationOfFounder.toLowerCase() !== 's2') {
                return res.send('Founder with role Hustler must have at least S2 education');
            }
        }
        if (!Number.isInteger(parseInt(valuation))) {
            return res.send('Valuation must be an integer');
        }
        await Startup.create({
            startUpName,
            founderName,
            dateFound: new Date('2019-01-02'),
            educationOfFounder,
            roleOfFounder,
            valuation,
            IncubatorId: incubatorId
        });
        res.redirect('/incubators/detail/' + incubatorId);
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
}
    static async showStartUp(req, res) {
        try {
        let notification = req.query.notification 
        let incubator = await Incubator.findAll();
        let data;
        if (req.query.category) {
            data = await Startup.findAll({
                where: {
                    roleOfFounder: req.query.category
                },
                include: Incubator
            });
        } else {
            data = await Startup.findAll({
                include: Incubator
            });
        }
        res.render('startup/startupHome', { incubator, data,notification });
    } catch (error) {
        res.send(error);
    }
}
static async deleteStartup(req, res) {
    try {
        const { incubatorId, startupId } = req.params;
        const startup = await Startup.findByPk(startupId);
        if (!startup) {
            return res.send("Startup not found");
        }
        const { startUpName, founderName } = startup;
        await Startup.destroy({
            where: {
                id: startupId
            }
        });
        const notificationMessage = `Start-Up ${startUpName} and Founder ${founderName} removed `;
        res.redirect(`/incubators/detail/${incubatorId}?notification=${encodeURIComponent(notificationMessage)}`);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    }
    //get
   static async showEditForm(req, res) {
    try {
        const { incubatorId, startUpId } = req.params;
        const incubator = await Incubator.findByPk(incubatorId);
        const startup = await Startup.findByPk(startUpId);
        res.render('startup/startupEdit', { incubator, startup });
    } catch (error) { 
        res.send(error);
    }
}
    //post
   static async editStartup(req, res) {
    try {
        const { incubatorId, startUpId } = req.params;
        const { startUpName, founderName, dateFound, educationOfFounder, roleOfFounder, valuation } = req.body;
        const startup = await Startup.findByPk(startUpId);
        if (!startup) {
            return res.send("Startup not found");
        }
        const currentDate = new Date();
        const startupFoundDate = new Date(dateFound);
        const differenceInYears = (currentDate - startupFoundDate) / (1000 * 3600 * 24 * 365);
        if (differenceInYears < 5) {
            return res.status(400).send('Startup must be at least 5 years old');
        }
        if (roleOfFounder.toLowerCase() === 'hustler') {
            if (educationOfFounder.toLowerCase() !== 's2') {
                return res.send('Founder with role Hustler must have at least S2 education');
            }
        }

        await startup.update({
            startUpName,
            founderName,
            dateFound,
            educationOfFounder,
            roleOfFounder,
            valuation
        });
        res.redirect(`/incubators/detail/${incubatorId}`);
    } catch (error) {
        console.log(error);
        res.send('Internal server error');
    }
   }
    
  static async startupDelete(req, res) {
    try {
        const { startupId } = req.params;
        const startup = await Startup.findByPk(startupId);
        if (!startup) {
            return res.send("Startup not found");
        }
        await Startup.destroy({
            where: {
                id: startupId
            }
        });
        const notificationMessage = `Startup ${startup.startUpName} and Founder ${startup.founderName} removed `;
        res.redirect(`/startup?notification=${encodeURIComponent(notificationMessage)}`);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}



}







module.exports = Controller;