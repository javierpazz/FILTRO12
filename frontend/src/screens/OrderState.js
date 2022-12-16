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
    case 'VALUE_FETCH_REQUEST':
      return { ...state, loadingVal: true };
    case 'VALUE_FETCH_SUCCESS':
      return {
        ...state,
        values: action.payload.values,
        pageVal: action.payload.page,
        pagesVal: action.payload.pages,
        loadingVal: false,
      };
    case 'VALUE_FETCH_FAIL':
      return { ...state, loadingVal: false, error: action.payload };

    default:
      return state;
  }
};
export default function OrderState({ invoice, show, setShow }) {
  const [
    { loading, error, values, pages, loadingVal, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    loadingVal: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState(invoice.totalPrice);
  const [invId, setInvId] = useState(invoice._id);
  const [name, setName] = useState(invoice.user.name);
  const [remNum, setRemNum] = useState(invoice.remNum);
  const [invNum, setInvNum] = useState(invoice.invNum);
  const [createdAt, setCreatedAt] = useState(invoice.createdAt);
  const [codval, setCodval] = useState('');
  const [desval, setDesval] = useState('');
  const [staOrd, setStaOrd] = useState(invoice.staOrd);
  const [staOrdAux, setStaOrdAux] = useState(invoice.staOrd);
  const [valuess, setValuess] = useState([]);
  const [valueeR, setValueeR] = useState('');

  const LoadInvoice = (invoice) => {
    setInvId(invoice._id);
    setTotal(invoice.totalPrice);
    setName(invoice.user.name);
    setRemNum(invoice.remNum);
    setInvNum(invoice.invNum);
    setCreatedAt(invoice.createdAt);
    setStaOrd(invoice.staOrd);
    setStaOrdAux(invoice.staOrd);
  };

  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`/api/valuees/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setValuess(data);
        dispatch({ type: 'VALUE_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);

  useEffect(() => {
    LoadInvoice(invoice);
    console.log(invoice);
    console.log(invoice.totalPrice);
  }, []);

  const stateHandler = () => {
    if (window.confirm('Are you sure to Change?')) {
      setStaOrdAux(staOrd);
      applyState(invId);
      setShow(false);

      //navigate(`/admin/invoicesRec`);
    }
  };

  const applyState = async (invoiceId) => {
    try {
      //          dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/invoices/${invoiceId}/applycha`,
        {
          remNum: remNum,
          invNum: invNum,
          staOrd: staOrd,
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

  const searchValue = (codVal) => {
    const valuesRow = valuess.find((row) => row._id === codVal);
    setValueeR(valuesRow);
    setCodval(valuesRow.codVal);
    setDesval(valuesRow.desVal);
    setStaOrd(valuesRow.desVal);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>

      <>
        <h1>{name}</h1>
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
          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Order Date</Form.Label>
                  <p>{createdAt}</p>
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
          <Col md={3}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input">
                  <Form.Label>Order State</Form.Label>
                  <p>{staOrdAux}</p>
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
        </Row>

        <h3>State Order</h3>
        <Row>
          <Col md={4}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input"></Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input" controlId="name">
                  <Form.Label>Values</Form.Label>
                  <Form.Select
                    className="input"
                    onClick={(e) => handleValueChange(e)}
                  >
                    {valuess.map((elementoV) => (
                      <option key={elementoV._id} value={elementoV._id}>
                        {elementoV.desVal}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={3}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input"></Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={1} className="col text-end">
            <div>
              <Button
                type="button"
                onClick={() => setShow(false)}
                disable="false"
              >
                Cancel
              </Button>
            </div>
          </Col>
          <Col md={1} className="col text-end">
            <div>
              <Button type="button" onClick={stateHandler} disable="false">
                Change
              </Button>
            </div>
          </Col>
        </Row>
      </>
    </div>
  );
}
