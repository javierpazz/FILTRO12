import React, { useState, useEffect } from 'react';
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

    if (!desPro || !quantity || !price) {
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
  }, [codPro, amount, price, quantity, setAmount]);

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
    setCodPro(editingRow.codPro);
    setDesPro(editingRow.desPro);
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

          <Col md={3}>
            <Card.Body>
              <Card.Title>
                <Form.Group className="input" controlId="name">
                  <Form.Label>Product description</Form.Label>
                  <Form.Control
                    className="input"
                    placeholder="Product description"
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
                <Form.Group className="input" controlId="name">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    className="input"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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

          <Col md={2}>
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
            <button type="submit">
              <AiOutlineEdit />
              {isEditing ? 'Editing Row Item' : 'Add Table Item'}
            </button>
          </Col>
        </Row>
      </form>

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
        {list.map(({ id, codPro, desPro, quantity, price, amount }) => (
          <React.Fragment key={id}>
            <tbody>
              <tr className="h-10">
                <td>{codPro}</td>
                <td>{desPro}</td>
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

      <div>
        <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
          Total..: $ {total.toLocaleString()}
        </h2>
      </div>
    </>
  );
}
