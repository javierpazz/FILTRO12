import { useState, useRef, useEffect } from 'react';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import Table from './Table';
import TableForm from './TableForm';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactToPrint from 'react-to-print';
import Form from 'react-bootstrap/Form';

function App() {
  const [codUse, setCodUse] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState('');
  const [codVal, setCodVal] = useState('');
  const [codPro, setCodPro] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [website, setWebsite] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [desPro, setDesPro] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);

  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);

  return (
    <>
      <main>
        <section>
          <div>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, invoice date, due date, notes */}
            <div>
              <Row>
                <Col md={4}>
                  <Card.Body>
                    <Card.Title>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>User Code</Form.Label>
                        <Form.Control
                          placeholder="User Code"
                          value={codUse}
                          onChange={(e) => setCodUse(e.target.value)}
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
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                          value={name}
                          onChange={(e) => setName(e.target.value)}
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
                        <Form.Label>Remito Number</Form.Label>
                        <Form.Control
                          placeholder="Remito Number"
                          value={remNum}
                          onChange={(e) => setRemNum(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Card.Body>
                    <Card.Title>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Invoice Number</Form.Label>
                        <Form.Control
                          placeholder="Invoice Number"
                          value={invNum}
                          onChange={(e) => setInvNum(e.target.value)}
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
                        <Form.Label>Invoice Date</Form.Label>
                        <Form.Control
                          type="date"
                          placeholder="Invoice Date"
                          value={invDat}
                          onChange={(e) => setInvDat(e.target.value)}
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
                        <Form.Label>Values</Form.Label>
                        <Form.Control
                          placeholder="Values"
                          value={codVal}
                          onChange={(e) => setCodVal(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Card.Body>
                    <Card.Title>
                      <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Receipt Number</Form.Label>
                        <Form.Control
                          placeholder="Receipt Number"
                          value={recNum}
                          onChange={(e) => setRecNum(e.target.value)}
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
                        <Form.Label>Receipt Date</Form.Label>
                        <Form.Control
                          type="date"
                          placeholder="Receipt Date"
                          value={recDat}
                          onChange={(e) => setRecDat(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Card.Body>
                    <Card.Title>
                      <label htmlFor="notes">Additional Notes</label>
                      <textarea
                        name="notes"
                        id="notes"
                        cols="120"
                        rows="2"
                        placeholder="Additional notes to the client"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>
              <Row>
                <Col md={10}>
                  <Card.Body>
                    <Card.Title>
                      <ReactToPrint
                        trigger={() => <button>Print / Download</button>}
                        content={() => componentRef.current}
                      />
                    </Card.Title>
                  </Card.Body>
                </Col>
              </Row>

              {/* This is our table form */}
              <article>
                <TableForm
                  codPro={codPro}
                  setCodPro={setCodPro}
                  desPro={desPro}
                  setDesPro={setDesPro}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  price={price}
                  setPrice={setPrice}
                  amount={amount}
                  setAmount={setAmount}
                  list={list}
                  setList={setList}
                  total={total}
                  setTotal={setTotal}
                />
              </article>

              {/* <button
              onClick={() => setShowInvoice(true)}
              className="bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
            >
              Preview Invoice
            </button> */}
            </div>
          </div>
        </section>

        {/* Invoice Preview */}

        <div ref={componentRef} className="p-5">
          <Header handlePrint={handlePrint} />

          <MainDetails name={name} address={address} />

          <ClientDetails
            clientName={clientName}
            clientAddress={clientAddress}
          />

          <Dates
            invoiceNumber={invoiceNumber}
            invoiceDate={invoiceDate}
            dueDate={dueDate}
          />

          <Table
            desPro={desPro}
            quantity={quantity}
            price={price}
            amount={amount}
            list={list}
            setList={setList}
            total={total}
            setTotal={setTotal}
          />

          <Notes notes={notes} />

          <Footer
            name={name}
            address={address}
            website={website}
            email={email}
            phone={phone}
            bankAccount={bankAccount}
            bankName={bankName}
          />
        </div>
        {/* <button
            onClick={() => setShowInvoice(false)}
            className="mt-5 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300"
          >
            Edit Information
          </button> */}
      </main>
    </>
  );
}

export default App;
