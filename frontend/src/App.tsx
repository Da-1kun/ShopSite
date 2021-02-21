import { Container } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import { ProductScreen } from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <Container>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/login" component={LoginScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/profile" component={ProfileScreen} />
        <Route path="/product/:id" component={ProductScreen} exact />
        <Route path="/cart/:id?" component={CartScreen} />
      </Container>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
