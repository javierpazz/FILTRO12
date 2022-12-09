import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Invoice from '../models/invoiceModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin, mailgun, payInvoiceEmailTemplate } from '../utils.js';

const invoiceRouter = express.Router();

invoiceRouter.get(
  '/S',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ salbuy: 'SALE' }).populate(
      'user',
      'name'
    );
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/B',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ salbuy: 'BUY' }).populate(
      'user',
      'name'
    );
    res.send(invoices);
  })
);

invoiceRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.aggregate([
      { $unwind: '$invoiceItems' },
      { $match: {} },
      {
        $project: {
          total: '$totalPrice',
          fecha: '$invDat',
          cliente: '$user',
          producto: '$invoiceItems.name',
          cantidad: '$invoiceItems.quantity',
          precio: '$invoiceItems.price',
        },
      },
    ]);
    res.send(invoices);
  })
);

const PAGE_SIZE = 3;

invoiceRouter.get(
  '/adminS',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ salbuy: 'SALE' })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments({ salbuy: 'SALE' });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.get(
  '/adminB',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ salbuy: 'BUY' })
      .populate('user', 'name')
      .populate('supplier', 'name')
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments({ salbuy: 'BUY' });
    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newInvoice = new Invoice({
      invoiceItems: req.body.invoiceItems.map((x) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
      supplier: req.body.codSup,
      remNum: req.body.remNum,
      invNum: req.body.invNum,
      invDat: req.body.invDat,
      recNum: req.body.recNum,
      recDat: req.body.recDat,
      desVal: req.body.desVal,
      notes: req.body.notes,
      salbuy: req.body.salbuy,
    });
    const invoice = await newInvoice.save();
    res.status(201).send({ message: 'New Invoice Created', invoice });
  })
);

invoiceRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoices = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          numInvoices: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyInvoices = await Invoice.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          invoices: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, invoices, dailyInvoices, productCategories });
  })
);

invoiceRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const invoices = await Invoice.find({ user: req.user._id })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countInvoices = await Invoice.countDocuments();

    res.send({
      invoices,
      countInvoices,
      page,
      pages: Math.ceil(countInvoices / pageSize),
    });
  })
);

invoiceRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      invoice.isDelivered = true;
      invoice.deliveredAt = Date.now();
      await invoice.save();
      res.send({ message: 'Invoice Delivered' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (invoice) {
      invoice.isPaid = true;
      invoice.paidAt = Date.now();
      invoice.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedInvoice = await invoice.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${invoice.user.name} <${invoice.user.email}>`,
            subject: `New invoice ${invoice._id}`,
            html: payInvoiceEmailTemplate(invoice),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Invoice Paid', invoice: updatedInvoice });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

invoiceRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    if (invoice) {
      await invoice.remove();
      res.send({ message: 'Invoice Deleted' });
    } else {
      res.status(404).send({ message: 'Invoice Not Found' });
    }
  })
);

export default invoiceRouter;
