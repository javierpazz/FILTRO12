import React, { useContext, useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../../../Store';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
  quantityInv,
  setQuantityInv,
  price,
  setPrice,
  amount,
  setAmount,
  list,
  setList,
  total,
  setTotal,
}) {
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

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    invoice: { invoiceItems },
  } = state;

  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = state;
  const [productss, setProductss] = useState([]);
  const [productR, setProductR] = useState('');
  const [stock, setStock] = useState(0);

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
      setAmount(quantityInv * price);
    };

    calculateAmount(amount);
  }, [codPro, amount, price, quantityInv, setAmount]);

  // Calculate total amount of items in table
  useEffect(() => {
    let rows = document.querySelectorAll('.amount');
    let sum = 0;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i].className === 'amount') {
        sum += isNaN(rows[i].innerHTML) ? 0 : parseInt(rows[i].innerHTML);
        setTotal(sum);
      }
    }
  });

  const addToCartHandler = async (itemInv) => {
    ctxDispatch({
      type: 'INVOICE_ADD_ITEM',
      payload: { ...itemInv, quantityInv },
    });
    console.log(invoiceItems);
  };

  const removeItemHandler = (itemInv) => {
    ctxDispatch({ type: 'INVOICE_REMOVE_ITEM', payload: itemInv });
  };

  // Submit form function

  const searchProduct = (codPro) => {
    const productRow = productss.find((prod) => prod._id === codPro);
    setProductR(productRow);
    console.log(productRow.name);
    console.log(productR.name);
  };

  const stockControl = (e) => {
    if (e.target.value <= stock) {
      setQuantityInv(e.target.value);
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
                        onChange={(e) => handleChange(e)}
                      >
                        {productss.map((elemento) => (
                          <option key={elemento._id} value={elemento._id}>
                            {elemento._id}+{elemento.name}+
                            {elemento.countInStock}
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
                      value={quantityInv}
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
                    <Button onClick={() => addToCartHandler(productR)}>
                      <AiOutlineEdit className="text-green-500 font-bold text-xl" />
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
          </tr>
        </thead>

        {invoiceItems.map((itemInv) => (
          <React.Fragment key={itemInv._id}>
            <tbody>
              <tr className="h-10">
                <td>{itemInv._id}</td>
                <td>{itemInv.name}</td>
                <td>{itemInv.quantityInv}</td>
                <td>{itemInv.price}</td>
                <td>
                  <button onClick={() => removeItemHandler(itemInv)}>
                    <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                  </button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          Total..: $ {total.toLocaleString()}
        </h2>
      </div>
    </>
  );
}
