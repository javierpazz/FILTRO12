import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiFillPrinter,
  AiOutlineMail,
} from 'react-icons/ai';

import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import SearchBox from '../components/SearchBox';
import Modal from 'react-bootstrap/Modal';
import InvoiceListChaNum from './../screens/InvoiceListChaNum';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        invoicesTOT: action.payload,
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
export default function AccountUserScreen() {
  const [
    { loading, error, invoicesTOT, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [invoices, setInvoices] = useState([]);

  const [invId, setInvId] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [ordNum, setOrdNum] = useState('');
  const [invDat, setInvDat] = useState('');

  const params = useParams();
  const { id: userId } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REQUEST' });

        const { data } = await axios.get(`/api/invoices/ctaS/${userId} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
        let kiki = data?.filter((data) => data.user === userId);
        setInvoices(kiki);

        console.log(kiki);
        console.log(invoice);

        calculatotal();
      } catch (err) {
        dispatch({
          type: 'TOTAL_FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  const handleShow = (invoice) => {
    //setInvoices(invoice);
    //setShow(true);
  };

  const deleteHandler = async (invoice) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/invoices/${invoice._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('invoice deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const calculatotal = () => {};

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      navigate(`/admin/invoicer`);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sale Invoices</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Sale Invoices</h1>
        </Col>

        <Col>
          <h3>Total: ${invoices?.reduce((a, c) => a + c.totalPrice * 1, 0)}</h3>
        </Col>
        <Col>
          <SearchBox />
        </Col>

        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Sale Invoice
            </Button>
          </div>
        </Col>
      </Row>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>INVOICE</th>
                <th>INVOICE DATE</th>
                <th>RECEIPT</th>
                <th>RECEIPT DATE</th>
                <th>TOTAL</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invNum}</td>
                  <td>{invoice.invDat}</td>
                  <td>{invoice.recNum}</td>
                  <td>{invoice.recDat}</td>
                  <td>{invoice.totalPrice.toFixed(2)}</td>

                  <td>
                    <Button
                      type="button"
                      title="Imprimir"
                      onClick={() => {
                        navigate(`/invoice/${invoice._id}`);
                      }}
                    >
                      <AiFillPrinter className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Send Email"
                      onClick={() => {
                        navigate(`/invoice/${invoice._id}`);
                      }}
                    >
                      <AiOutlineMail className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Add or Change Invoice or Remit Number"
                      onClick={() => handleShow(invoice)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(invoice._id)}
                    >
                      <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Modal
            size="xl"
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                Change Remit Invoice Number of {invoice._id}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InvoiceListChaNum
                invoice={invoice}
                show={show}
                setShow={setShow}
              />
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
}
