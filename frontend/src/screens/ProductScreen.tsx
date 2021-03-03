import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from 'react-bootstrap';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Rating from '../components/Rating';
import { RootState } from '../redux/rootReducer';
import { fetchProductDetails } from '../redux/product/productDetailsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  productCreateReviewReset,
  createProductReview,
} from '../redux/product/productCreateReviewSlice';

interface MatchParams {
  id: string;
}

interface ProductScreenProps extends RouteComponentProps<MatchParams> {}

export const ProductScreen: React.FC<ProductScreenProps> = ({
  match,
  history,
}) => {
  const productId = Number(match.params.id);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const productDetail = useSelector((state: RootState) => state.productDetails);
  const { errorMessage, isLoading, product } = productDetail;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector(
    (state: RootState) => state.productCreateReview
  );
  const {
    isLoading: loadingProductReview,
    errorMessage: errorProductReview,
    success: successProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment('');
      dispatch(productCreateReviewReset());
    }

    dispatch(fetchProductDetails(productId));
  }, [dispatch, match, successProductReview]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(createProductReview({ product: productId, rating, comment }));
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {isLoading || !product ? (
        <Loader />
      ) : errorMessage ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={Number(product.rating)}
                    text={`${product.numReviews} reviews`}
                    color={'#f8e825'}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>

                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col xs="auto" className="my-1">
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={e => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      disabled={product.countInStock == 0}
                      type="button"
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews?.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews?.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={Number(product.rating)} color={'#f8e825'} />
                    <p>{review.createdAt?.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Write a review</h4>

                  {loadingProductReview && <Loader />}
                  {successProductReview && (
                    <Message variant="success">Review Submitted</Message>
                  )}
                  {errorProductReview && (
                    <Message variant="danger">{errorProductReview}</Message>
                  )}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={e => setRating(Number(e.target.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId="comment">
                        <Form.Label>Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message variant="info">
                      Please <Link to="/login">login</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
