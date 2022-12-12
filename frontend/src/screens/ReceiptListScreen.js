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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import SearchBox from '../components/SearchBox';
import Modal from 'react-bootstrap/Modal';
//import MyModal from '../components/MyModal';
import InvoiceListApliRec from './../screens/InvoiceListApliRec';

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOTAL_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'TOTAL_FETCH_SUCCESS':
      return {
        ...state,
        receiptsT: action.payload,
        loading: false,
      };
    case 'TOTAL_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        receipts: action.payload.receipts,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
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
export default function ReceiptListScreen() {
  const [
    {
      loading,
      error,
      receipts,
      receiptsT,
      pages,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [recNum, setRecNum] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'TOTAL_FETCH_REQUEST' });
        const { data } = await axios.get(`/api/receipts/S`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'TOTAL_FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'TOTAL_FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/receipts/adminS?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const handleShow = (receipt) => {
    setRecNum(receipt.recNum);
    setUserId(receipt.user._id);
    setFullscreen('xxl-down');
    setShow(true);
  };

  const deleteHandler = async (receipt) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/receipts/${receipt._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('receipt deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      navigate(`/admin/invoicerRec`);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Sale Receipts</title>
      </Helmet>
      <Row>
        <Col>
          <h1>Sale Receipts</h1>
        </Col>
        <Col>
          <h3>
            Total: ${receiptsT?.reduce((a, c) => a + c.totalPrice * 1, 0)}
          </h3>
        </Col>

        <Col>
          <SearchBox />
        </Col>

        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Sale Receipt
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
                <th>RECIBO</th>
                <th>FECHA</th>
                <th>CLIENTE</th>
                <th>PAGADA</th>
                <th>FORMA PAGO</th>
                <th>TOTAL</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {receipts?.map((receipt) => (
                <tr key={receipt._id}>
                  <td>{receipt.recNum}</td>
                  <td>{receipt.recDat.substring(0, 10)}</td>
                  <td>{receipt.user ? receipt.user.name : 'DELETED USER'}</td>
                  <td>
                    {receipt.isPaid ? receipt.paidAt.substring(0, 10) : 'No'}
                  </td>
                  <td>{receipt.desval}</td>
                  <td>{receipt.totalPrice.toFixed(2)}</td>

                  <td>
                    <Button
                      type="button"
                      title="Imprimir"
                      onClick={() => {
                        navigate(`/receipt/${receipt._id}`);
                      }}
                    >
                      <AiFillPrinter className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Send Email"
                      onClick={() => {
                        navigate(`/receipt/${receipt._id}`);
                      }}
                    >
                      <AiOutlineMail className="text-black-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Cambiar Nro. Remito o Factura"
                      onClick={() => handleShow(receipt)}
                    >
                      <AiOutlineEdit className="text-blue-500 font-bold text-xl" />
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      title="Delete"
                      onClick={() => deleteHandler(receipt)}
                    >
                      <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/invoicesRec?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
          <Modal
            show={show}
            fullscreen={fullscreen}
            onHide={() => setShow(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Invoices To Apply Receipt N° {recNum} {userId}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InvoiceListApliRec
                recNum={recNum}
                userId={userId}
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
