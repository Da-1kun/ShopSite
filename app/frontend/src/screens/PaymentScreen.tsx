import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../redux/rootReducer';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { cartSavePaymentMethod } from '../redux/cartSlice';

const PaymentScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(cartSavePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />

      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="paypal"
              name="paymentMethod"
              checked
              onChange={e => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
