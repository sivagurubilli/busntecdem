'use strict';

const adminLoginHandler = require('./login');
const categoryfun = require('./category')
const responsesCommon = require("../../common/response.common");
const Menu = require("../../models").menu

module.exports = {
    adminLoginHandler,
    categoryfun,
    fetchAdminMenus: async (req, res) => {
        try {
            let { page = 1, limit = 10 } = req.query;
            const pageInt = parseInt(page, 10);
            const limitInt = parseInt(limit, 10);
            const offset = (pageInt - 1) * limitInt;
            const menus = await Menu.findAll({
                where: { isAdminMenu: false },
                offset,
                limit: limitInt,
                order: [['id', 'DESC']]
            });
            return res.status(200).send(responsesCommon.formatSuccessMessage("User logged in successfully", menus, null, 1, ""));
        } catch (error) {
            console.error(error);
            return res.status(200).send(responsesCommon.formatErrorMessage(error.message, 400, null))
        }
    },
    updateMenu: async (req, res) => {
        try {
            const { id } = req.body;
            if (id) {
                //update
                delete req.body.id;
                await Menu.update(req.body, { where: { id } });
                return res.status(200).send(responsesCommon.formatSuccessMessage("Menu is updated!", [], null, 1, ""));
            }
            //create
            const menu = await Menu.create(req.body);
            return res.status(200).send(responsesCommon.formatSuccessMessage("Menu is created!", [menu], null, 1, ""));
        } catch (error) {
            console.error(error);
            return res.status(200).send(responsesCommon.formatErrorMessage(error.message, 400, null))
        }
    }
}