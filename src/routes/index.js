const UserController = require('../controllers/UserController');
const ClientController = require('../controllers/ClientController');
const ShipperController = require('../controllers/ShipperController');
const FactoryController = require('../controllers/FactoryController');
const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');
const sendEmail = require ('../utils/sendEmail');

exports.appRoute = router => {
  //--------------Client--------------
  router.get('/', auth.home);
  router.get('/login', auth.out, ClientController.login);
  router.get('/register', auth.out, ClientController.register);
  router.get('/logout', auth.auth, ClientController.logout);

  router.get('/report', auth.auth, ClientController.report);
  router.get('/worker', auth.auth, ClientController.worker);
  router.get('/shipper', auth.auth, ClientController.shipper);
  router.get('/factory', auth.auth, ClientController.factory);
  router.get('/order', auth.auth, ClientController.order);
  router.get('/prediction', auth.auth, ClientController.prediction);

  //---------------API----------------
  router.post("/worker/list", UserController.list);
  router.post("/worker/register", UserController.register);
  router.post("/worker/login", UserController.login);

  router.post("/shipper/add", ShipperController.add);
  router.post("/shipper/list", ShipperController.list);

  router.post("/factory/add", FactoryController.add);
  router.post("/factory/list", FactoryController.list);

  router.post("/order/add", OrderController.add);
  router.post("/order/update", OrderController.update);
  router.post("/order/prediction", OrderController.prediction);
  router.post("/order/firstYear", OrderController.firstYear);

  router.get("/datatable/worker", UserController.datatable);
  router.get("/datatable/shipper", ShipperController.datatable);
  router.get("/datatable/factory", FactoryController.datatable);
  router.get("/datatable/order", OrderController.datatable);


  router.post('/api/sendEmail', async(req, res)=>{
    let {to} = req.body;
    console.log(to);
    try {
        await sendEmail({
            //the client email 
            to: to,
            //sendGrid sender id 
            from: 'outsmartcapital@gmail.com',
            subject: 'New Order',
            text: 'Glad you are here .. yes you!',
            html:'<strong>It is working!!</strong>'
        });
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});
 };
