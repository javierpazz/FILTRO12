import { useContext, useState, useRef, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClientDetails from './ClientDetails';
import Dates from './Dates';
import Footer from './Footer';
import Header from './Header';
import MainDetails from './MainDetails';
import Notes from './Notes';
import Table from './Table';
import { toast } from 'react-toastify';
import TableForm from './TableForm';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Store } from '../../../Store';
import ReactToPrint from 'react-to-print';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../../components/LoadingBox';
import { getError } from '../../../utils';

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

    case 'SUPPLIER_FETCH_REQUEST':
      return { ...state, loading: true };
    case 'SUPPLIER_FETCH_SUCCESS':
      return {
        ...state,
        suppliers: action.payload.supliers,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'SUPPLIER_FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

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

function AppBuy() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingVal,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    loadingVal: true,
    error: '',
  });

  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    invoice: { invoiceItems },
  } = state;

  const { invoice, userInfo, values } = state;

  const [codUse, setCodUse] = useState('');
  const [name, setName] = useState('');
  const [remNum, setRemNum] = useState('');
  const [invNum, setInvNum] = useState('');
  const [invDat, setInvDat] = useState('');
  const [recNum, setRecNum] = useState('');
  const [recDat, setRecDat] = useState('');
  const [codVal, setCodVal] = useState('');
  const [desVal, setDesVal] = useState('');
  const [userss, setUserss] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [codSup, setCodSup] = useState('');
  const [valuess, setValuess] = useState([]);
  const [codPro, setCodPro] = useState('');
  const [codPro1, setCodPro1] = useState('');
  const [address, setAddress] = useState('Direccion Usuario');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [website, setWebsite] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [dueDat, setDueDat] = useState('');
  const [notes, setNotes] = useState('');
  const [desPro, setDesPro] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);
  const [showInvoice, setShowInvoice] = useState(false);

  const componentRef = useRef();
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/users/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUserss(data);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataVal = async () => {
      try {
        const { data } = await axios.get(`/api/suppliers/`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSuppliers(data);
        dispatch({ type: 'SUPPLIER_FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };
    fetchDataVal();
  }, []);

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
    if (window.innerWidth < width) {
      alert('Place your phone in landscape mode for the best experience');
    }
  }, [width]);

  const searchSup = (codSup) => {
    const supplierRow = suppliers.find((row) => row._id === codSup);
    setCodSup(supplierRow._id);
    setName(supplierRow.name);
  };

  const handleChange = (e) => {
    searchSup(e.target.value);
  };

  const searchValue = (codVal) => {
    const valuesRow = valuess.find((row) => row._id === codVal);
    setCodVal(valuesRow.codVal);
    setDesVal(valuesRow.desVal);
  };

  const handleValueChange = (e) => {
    searchValue(e.target.value);
  };

  const placeCancelInvoiceHandler = async () => {};

  const placeInvoiceHandler = async () => {
    if (invNum && invDat && codSup) {
      //    list.map((item) => stockHandler({ item }));
      invoiceItems.map((item) => stockHandler({ item }));

      const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23
      invoice.itemsPrice = round2(
        invoice.invoiceItems.reduce((a, c) => a + c.quantity * c.price, 0)
      );
      invoice.shippingPrice = invoice.itemsPrice > 100 ? round2(0) : round2(10);
      invoice.taxPrice = round2(0.15 * invoice.itemsPrice);
      invoice.totalPrice =
        invoice.itemsPrice + invoice.shippingPrice + invoice.taxPrice;
      invoice.codSup = codSup;
      invoice.remNum = remNum;
      invoice.invNum = invNum;
      invoice.invDat = invDat;
      invoice.recNum = recNum;
      invoice.recDat = recDat;
      invoice.desVal = desVal;
      invoice.notes = notes;

      orderHandler();
      setShowInvoice(true);
      //      handlePrint();
    }
  };

  /////////////////////////////////////////////

  const stockHandler = async (item) => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.put(
        `/api/products/upstock/${item.item._id}`,
        {
          quantitys: item.item.quantity,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  const orderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/invoices',

        {
          invoiceItems: invoice.invoiceItems,
          shippingAddress: invoice.shippingAddress,
          paymentMethod: invoice.paymentMethod,
          itemsPrice: invoice.itemsPrice,
          shippingPrice: invoice.shippingPrice,
          taxPrice: invoice.taxPrice,
          totalPrice: invoice.totalPrice,

          codSup: invoice.codSup,

          remNum: invoice.remNum,
          invNum: invoice.invNum,
          invDat: invoice.invDat,
          recNum: invoice.recNum,
          recDat: invoice.recDat,
          desVal: invoice.desVal,
          notes: invoice.notes,
          salbuy: 'BUY',
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      ctxDispatch({ type: 'INVOICE_CLEAR' });
      dispatch({ type: 'CREATE_SUCCESS' });
      localStorage.removeItem('invoiceItems');
      //navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
      toast.error(getError(err));
    }
  };

  /////////////////////////////////////////////

  return (
    <>
      <Helmet>
        <title>Buy Invoice</title>
      </Helmet>

      <main>
        {!showInvoice ? (
          <>
            {/* name, address, email, phone, bank name, bank account number, website client name, client address, invoice number, invoice date, due date, notes */}
            <div>
              <div className="bordeTable">
                <Row>
                  <Col md={4}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Supplier Code</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Supplier Code"
                            value={codSup}
                            onChange={(e) => setCodSup(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={8}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Supplier Name</Form.Label>
                          <Form.Select
                            className="input"
                            onClick={(e) => handleChange(e)}
                          >
                            {suppliers.map((elemento) => (
                              <option key={elemento._id} value={elemento._id}>
                                {elemento.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Invoice Number</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Invoice Number"
                            value={invNum}
                            onChange={(e) => setInvNum(e.target.value)}
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
                          <Form.Label>Invoice Date</Form.Label>
                          <Form.Control
                            className="input"
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
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Due Date</Form.Label>
                          <Form.Control
                            className="input"
                            type="date"
                            placeholder="Due Date"
                            value={dueDat}
                            onChange={(e) => setDueDat(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={2}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Receipt Number</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Receipt Number"
                            value={recNum}
                            onChange={(e) => setRecNum(e.target.value)}
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
                          <Form.Label>Receipt Date</Form.Label>
                          <Form.Control
                            className="input"
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
                  <Col md={3}>
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
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Remit Number</Form.Label>
                          <Form.Control
                            className="input"
                            placeholder="Remit Number"
                            value={remNum}
                            onChange={(e) => setRemNum(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                  <Col md={6}>
                    <Card.Body>
                      <Card.Title>
                        <Form.Group className="input" controlId="name">
                          <Form.Label>Additional Notes</Form.Label>
                          <textarea
                            className="input"
                            placeholder="Additional notes to the client"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          ></textarea>
                        </Form.Group>
                      </Card.Title>
                    </Card.Body>
                  </Col>
                </Row>
              </div>
              <div className="bordeTable">
                <div className="bordeTableinput">
                  <Row>
                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeCancelInvoiceHandler}
                          disabled={
                            invoiceItems.length === 0 ||
                            !invNum ||
                            !invDat ||
                            !codSup ||
                            !desVal
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeInvoiceHandler}
                          disabled={
                            invoiceItems.length === 0 ||
                            !invNum ||
                            !invDat ||
                            !codSup ||
                            !desVal
                          }
                        >
                          Save Invoice
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </Col>

                    <Col md={4} sm={3} xs={12}>
                      <Card.Body>
                        <Card.Title>
                          <ListGroup.Item>
                            <h3>
                              Total: $
                              {invoiceItems.reduce(
                                (a, c) => a + c.price * c.quantity,
                                0
                              )}
                            </h3>
                          </ListGroup.Item>
                        </Card.Title>
                      </Card.Body>
                    </Col>
                  </Row>
                </div>

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
              </div>
            </div>
          </>
        ) : (
          <>
            <ReactToPrint
              trigger={() => <Button type="button">Print / Download</Button>}
              content={() => componentRef.current}
            />
            <Button onClick={() => setShowInvoice(false)}>New Invoice</Button>

            {/* Invoice Preview */}

            <div ref={componentRef} className="p-5">
              <Header handlePrint={handlePrint} />

              <MainDetails codUse={codUse} name={name} address={address} />

              <ClientDetails
                clientName={clientName}
                clientAddress={clientAddress}
              />

              <Dates invNum={invNum} invDat={invDat} dueDat={dueDat} />

              <Table
                desPro={desPro}
                quantity={quantity}
                price={price}
                amount={amount}
                invoiceItems={invoiceItems}
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
          </>
        )}
      </main>
    </>
  );
}

export default AppBuy;