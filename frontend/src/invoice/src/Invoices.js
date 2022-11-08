import React from 'react';
import { ScrollToTop } from './pages';
import Invoice from './components/App';
//import AuthContext from "./context/auth"
import { Header, Footer, Error } from './pages';

export default function Invoices() {
  //  const { user } = useContext(AuthContext)

  return (
    <>
      <ScrollToTop />
      <Header />
      <Invoice />
    </>
  );
}
