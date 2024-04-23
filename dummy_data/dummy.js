const fs = require('fs');
const UserController = require('../src/controllers/UserController');
const ShipperController = require('../src/controllers/ShipperController');
const FactoryController = require('../src/controllers/FactoryController');
const OrderController = require('../src/controllers/OrderController');

module.exports = async () => {
    if ((await OrderController.count()) == 0)
    {
        const data = JSON.parse(fs.readFileSync('./dummy_data/orders.json', 'utf-8'))
        OrderController.import(data);
    }

    if ((await FactoryController.count()) == 0)
    {
        const data = JSON.parse(fs.readFileSync('./dummy_data/factory.json', 'utf-8'))
        FactoryController.import(data);
    }

    if ((await ShipperController.count()) == 0)
    {
        const data = JSON.parse(fs.readFileSync('./dummy_data/shipper.json', 'utf-8'))
        ShipperController.import(data);
    }
}