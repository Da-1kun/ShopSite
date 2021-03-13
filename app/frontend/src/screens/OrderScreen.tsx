import React, { useState, useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PayPalButton } from 'react-paypal-button-v2';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { RootState } from '../redux/rootReducer';
import { orderPayReset, payOrder } from '../redux/order/orderPaySlice';
import { getOrderDetails } from '../redux/order/orderDetailsSlice';
import {
  deliverOrder,
  orderDeliverReset,
} from '../redux/order/orderDeliverSlice';

interface MatchParams {
  id: string;
}

interface OrderScreenProps extends RouteComponentProps<MatchParams> {}

const OrderScreen: React.FC<OrderScreenProps> = ({ match, history }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state: RootState) => state.orderDetails);
  const { orderInfo: order, errorMessage, isLoading } = orderDetails;

  const orderPay = useSelector((state: RootState) => state.orderPay);
  const { isLoading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state: RootState) => state.orderDeliver);
  const { isLoading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  let itemsPrice = '0';
  if (!isLoading && !errorMessage && order) {
    itemsPrice = order.orderItems
      .reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
      .toFixed(2);
  }

  const CLIENT_ID =
    'AUIgKlmasvyhN9n5MXCHfN_Xp45Vqz-2FBTrH7RuUd1v-A702bR94zVFUuVxDPd8cE5ki_bR8R15Xy9G';

  const addPayPalScript = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }

    if (
      !order ||
      successPay ||
      order._id !== Number(orderId) ||
      successDeliver
    ) {
      dispatch(orderPayReset());
      dispatch(orderDeliverReset());

      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay]);

  const successPaymentHandler = (paymentResult: any) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    if (order) {
      dispatch(deliverOrder(order));
    }
  };

  return isLoading ? (
    <Loader />
  ) : errorMessage ? (
    <Message variant="danger">{errorMessage}</Message>
  ) : (
    <div>
      <h1>Order: {order?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order?.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                <a href={`mailto:${order?.user.email}`}>{order?.user.email}</a>
              </p>
              <p>
                <strong>Shipping: </strong>
                {order?.shippingAddress.address}, {order?.shippingAddress.city}
                {'  '}
                {order?.shippingAddress.postalCode},{'  '}
                {order?.shippingAddress.country}
              </p>

              {order?.isDelivered ? (
                <Message variant="success">
                  Delivered on {order?.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant="success">Paid on {order?.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order?.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order?.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * Number(item.price)).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${order?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order?.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order?.isPaid &&
              !order?.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
