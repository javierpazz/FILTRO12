import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

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
}) {
  const [isEditing, setIsEditing] = useState(false);

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!codPro || !desPro || !quantity || !price) {
      toast.error('Please fill in all inputs');
    } else {
      const newItems = {
        id: uuidv4(),
        codPro,
        desPro,
        quantity,
        price,
        amount,
      };
      setCodPro('');
      setDesPro('');
      setQuantity('');
      setPrice('');
      setAmount('');
      setList([...list, newItems]);
      setIsEditing(false);
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount(quantity * price);
    };

    calculateAmount(amount);
  }, [amount, price, quantity, setAmount]);

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

  // Edit function
  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id);
    setList(list.filter((row) => row.id !== id));
    setIsEditing(true);
    setDesPro(editingRow.description);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
  };

  // Delete function
  const deleteRow = (id) => setList(list.filter((row) => row.id !== id));

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>P. Code</Form.Label>
                  <Form.Control
                    placeholder="Product Code"
                    value={codPro}
                    onChange={(e) => setCodPro(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={4}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    placeholder="Product Description"
                    value={desPro}
                    onChange={(e) => setDesPro(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={1}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>
          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Amount</Form.Label>
                  <p>{amount}</p>
                </Form.Group>
              </Card.Title>
            </Card.Body>
          </Col>

          <Col md={2}>
            <Card.Body>
              <Card.Title>
                <button type="submit">
                  {isEditing ? 'Editing Row Item' : 'Add Table Item'}
                </button>
              </Card.Title>
            </Card.Body>
          </Col>
        </Row>
      </form>
      <Row>
        <Col md={12}>
          <Card.Body>
            <Card.Title>
              <h2>Total $.: {total.toLocaleString()}</h2>
            </Card.Title>
          </Card.Body>
        </Col>
      </Row>

      {/* Table items */}

      <table width="100%" className="mb-10">
        <thead>
          <tr className="bg-gray-100 p-1">
            <td className="font-bold">Code</td>
            <td className="font-bold">Description</td>
            <td className="font-bold">Quantity</td>
            <td className="font-bold">Price</td>
            <td className="font-bold">Amount</td>
          </tr>
        </thead>
        {list.map(({ id, description, quantity, price, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr className="h-10">
                <td>{description}</td>
                <td>{quantity}</td>
                <td>{price}</td>
                <td className="amount">{amount}</td>
                <td>
                  <button onClick={() => editRow(id)}>
                    <AiOutlineEdit className="text-green-500 font-bold text-xl" />
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteRow(id)}>
                    <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                  </button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </>
  );
}
