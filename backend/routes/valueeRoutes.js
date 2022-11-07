import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Valuee from '../models/valueeModel.js';
import { isAuth, isAdmin } from '../utils.js';

const valueeRouter = express.Router();

valueeRouter.get('/', async (req, res) => {
  const valuees = await Valuee.find();
  res.send(valuees);
});

valueeRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newValuee = new Valuee({
      codVal: 0,
      name: 'sample name ' + Date.now(),
    });
    const valuee = await newValuee.save();
    res.send({ message: 'Valuee Created', valuee });
  })
);

valueeRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const valueeId = req.params.id;
    const valuee = await Valuee.findById(valueeId);
    if (valuee) {
      valuee.codVal = req.body.codVal;
      valuee.name = req.body.name;
      await valuee.save();
      res.send({ message: 'Valuee Updated' });
    } else {
      res.status(404).send({ message: 'Valuee Not Found' });
    }
  })
);

valueeRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const valuee = await Valuee.findById(req.params.id);
    if (valuee) {
      await valuee.remove();
      res.send({ message: 'Valuee Deleted' });
    } else {
      res.status(404).send({ message: 'Valuee Not Found' });
    }
  })
);

const PAGE_SIZE = 3;

valueeRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const valuees = await Valuee.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countSuppliers = await Valuee.countDocuments();
    res.send({
      valuees,
      countSuppliers,
      page,
      pages: Math.ceil(countSuppliers / pageSize),
    });
  })
);

valueeRouter.get('/:id', async (req, res) => {
  const valuee = await Valuee.findById(req.params.id);
  if (valuee) {
    res.send(valuee);
  } else {
    res.status(404).send({ message: 'Valuee Not Found' });
  }
});

export default valueeRouter;
