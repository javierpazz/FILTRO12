import React, { useContext, useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../../../Store';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function TableForm({
  codPro,
  setCodPro,
  desPro,
  setDesPro,
  quantity,
  setQuantity,
  price,
  setPrice,
  amount,
  setAmount,
  list,
  setList,
  total,
  setTotal,
  valueeR,
  desval,
  numval,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    invoice: { invoiceItems },
    receipt: { receiptItems },
    userInfo,
  } = state;

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [productss, setProductss] = useState([]);
  const [productR, setProductR] = useState('');
  const [stock, setStock] = useState(0);

  const [amountval, setAmountval] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProductss(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(quantity * price);
    };

    calculateAmount(amount);
  }, [codPro, amount, price, quantity, setAmount]);

  useEffect(() => {
    const calculateAmountval = (amountval) => {
      setAmountval(invoiceItems?.reduce((a, c) => a + c.amount * 1, 0));
    };

    calculateAmountval(amountval);
  }, [codPro, amountval, price, quantity, setAmountval]);

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault();
    addToCartHandler();
  };

  /////////////////////////////////////////////

  const addToValueHandler = (itemVal) => {
    //    setAmountval(invoiceItems?.reduce((a, c) => a + c.amount * 1, 0));
    //setAmountval(10000);

    // console.log(amountval);
    // console.log(receiptItems);
    // console.log(valueeR);
    // console.log(invoiceItems);

    if (desval && amountval > 0) {
      ctxDispatch({
        type: 'RECEIPT_CLEAR',
      });
      localStorage.removeItem('receiptItems');
      ctxDispatch({
        type: 'RECEIPT_ADD_ITEM',
        payload: { ...itemVal, desval, amountval, numval },
      });
    }
  };

  /////////////////////////////////////////////

  const addToCartHandler = async (itemInv) => {
    if (codPro && quantity > 0) {
      ctxDispatch({
        type: 'INVOICE_ADD_ITEM',
        payload: { ...itemInv, quantity, amount, price },
      });
      ////
      addToValueHandler(valueeR);
      ////
    }
  };

  const removeItemHandler = (itemInv) => {
    ctxDispatch({ type: 'INVOICE_REMOVE_ITEM', payload: itemInv });
  };

  // Edit function

  const searchProduct = (codPro) => {
    const productRow = productss.find((row) => row._id === codPro);
    setProductR(productRow);
    setCodPro(productRow._id);
    setDesPro(productRow.name);
    setQuantity(1);
    setPrice(productRow.price);
    setAmount(productRow.price);
    setStock(productRow.countInStock);
  };

  const stockControl = (e) => {
    if (e.target.value <= stock) {
      setQuantity(e.target.value);
    } else {
      toast.error('This Product does not have stock enough');
    }
  };

  const handleChange = (e) => {
    searchProduct(e.target.value);
  };

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <div className="bordeTable">
        <form>
          <Row>
            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Product Code</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Product Code"
                      value={codPro}
                      onChange={(e) => setCodPro(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={5}>
              <Card.Body>
                <Card.Title>
                  <Card.Title>
                    <Form.Group className="input" controlId="name">
                      <Form.Label>Product Description</Form.Label>
                      <Form.Select
                        className="input"
                        onClick={(e) => handleChange(e)}
                      >
                        {productss.map((elemento) => (
                          <option key={elemento._id} value={elemento._id}>
                            {elemento._id}+{elemento.name}+
                            {elemento.countInStock}+{elemento.price}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Card.Title>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => stockControl(e)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input" controlId="name">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      className="input"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={1}>
              <Card.Body>
                <Card.Title>
                  <Form.Group className="input">
                    <Form.Label>Amount</Form.Label>
                    <p>{amount}</p>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>

            <Col md={2}>
              <Card.Body>
                <Card.Title>
                  <Form.Group>
                    <Button
                      onClick={() => addToCartHandler(productR)}
                      className="mt-3 mb-1 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                    >
                      {isEditing ? 'Editing Row Item' : 'Add Table Item'}
                    </Button>
                  </Form.Group>
                </Card.Title>
              </Card.Body>
            </Col>
          </Row>
        </form>
      </div>
      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Product Code</td>
            <td className="font-bold">Product Description</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">Amount</td>
            <td className="font-bold">Options</td>
          </tr>
        </thead>
        {invoiceItems.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemInv._id}</td>
                <td>{itemInv.name}</td>
                <td>{itemInv.quantity}</td>
                <td>{itemInv.price}</td>
                <td className="amount">{itemInv.quantity * itemInv.price}</td>
                <td>
                  <Button
                    className="mt-0 mb-0 bg-yellow-300 text-black py-1 px-1 rounded shadow border-2 border-yellow-300 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
                    onClick={() => removeItemHandler(itemInv)}
                  >
                    <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </>
  );
}
