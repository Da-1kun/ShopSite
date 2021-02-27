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

interface MatchParams {
  id: string;
}

interface OrderScreenProps extends RouteComponentProps<MatchParams> {}

const OrderScreen: React.FC<OrderScreenProps> = ({ match, history }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state: RootState) => state.orderDetails);
  const { orderInfo, errorMessage, isLoading } = orderDetails;

  const orderPay = useSelector((state: RootState) => state.orderPay);
  const { isLoading: loadingPay, success: successPay } = orderPay;

  // const orderDeliver = useSelector(state => state.orderDeliver)
  // const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  let itemsPrice = '0';
  if (!isLoading && !errorMessage && orderInfo) {
    itemsPrice = orderInfo.orderItems
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

    if (!orderInfo || successPay || orderInfo._id !== Number(orderId)) {
      dispatch(orderPayReset());

      dispatch(getOrderDetails(orderId));
    } else if (!orderInfo.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderInfo, orderId, successPay]);

  const successPaymentHandler = (paymentResult: any) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  return isLoading ? (
    <Loader />
  ) : errorMessage ? (
    <Message variant="danger">{errorMessage}</Message>
  ) : (
    <div>
      <h1>Order: {orderInfo?._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {orderInfo?.user.name}
              </p>
              <p>
                <strong>Email: </strong>
                {orderInfo?.user.email}
              </p>
              <p>
                <strong>Shipping: </strong>
                {orderInfo?.shippingAddress.address},{' '}
                {orderInfo?.shippingAddress.city}
                {'  '}
                {orderInfo?.shippingAddress.postalCode},{'  '}
                {orderInfo?.shippingAddress.country}
              </p>

              {orderInfo?.isDelivered ? (
                <Message variant="success">
                  Delivered on {orderInfo?.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {orderInfo?.paymentMethod}
              </p>
              {orderInfo?.isPaid ? (
                <Message variant="success">Paid on {orderInfo?.paidAt}</Message>
              ) : (
                <Message variant="warning">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {orderInfo?.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {orderInfo?.orderItems.map((item, index) => (
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
                  <Col>${orderInfo?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${orderInfo?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${orderInfo?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!orderInfo?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={orderInfo?.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>

            {userInfo &&
              userInfo.isAdmin &&
              orderInfo?.isPaid &&
              !orderInfo?.isDelivered && (
                <ListGroup.Item>
                  <Button type="button" className="btn btn-block">
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
