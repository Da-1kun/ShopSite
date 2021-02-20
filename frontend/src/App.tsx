import { Container } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import { ProductScreen } from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/product/:id" component={ProductScreen} exact />
        <Route path="/cart/:id?" component={CartScreen} />
      </Container>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
