import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        invoices: action.payload,
        loading: false,
      };
    case 'TOTAL_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function InvoiceListChaNum({ invoice, show, setShow }) {
  //const recNum = { props.recNum };
  const [{ loading, error, invoices, loadingDelete }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState('');
  const [invId, setInvId] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [ordNum, setOrdNum] = useState('');
  const [invDat, setInvDat] = useState('');

  const LoadInvoice = (invoice) => {
    setInvId(invoice._id);
    setTotal(invoice.totalPrice);
    setName(invoice.user.name);
    setRemNum(invoice.remNum);
    setOrdNum(invoice.ordNum);
    setInvNum(invoice.invNum);
    setInvDat(invoice.invDat);
  };

  const applyHandler = () => {
    if (window.confirm('Are you sure to Change?')) {
      applyReceipt(invId);
      setShow(false);

      //navigate(`/admin/invoicesRec`);
    }
  };

  const applyReceipt = async (invoiceId) => {
    try {
      //          dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/invoices/${invoiceId}/applycha`,
        {
          remNum: remNum,
          invNum: invNum,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      //          dispatch({type: 'UPDATE_SUCCESS' });
      toast.success('Remit Invoice Number Changed successfully');
      //          navigate('/admin/products');
    } catch (err) {
      toast.error(getError(err));
      //          dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>

      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Invoice N°</Form.Label>
                    <p>{invNum}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Invoice Date</Form.Label>
                    <p>{invDat}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Remit N°</Form.Label>
                    <p>{remNum}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Order</Form.Label>
                    <p>{ordNum}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Client</Form.Label>
                    <p>{name}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Amount</Form.Label>
                    <p>{total}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1} className="col text-end">
              <div>
                <Button type="button" onClick={applyHandler} disabled="true">
                  Apply
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
