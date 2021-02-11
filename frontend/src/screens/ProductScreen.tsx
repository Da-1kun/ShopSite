import React, { useState, useEffect } from 'react';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { Link, RouteComponentProps } from 'react-router-dom';
import Rating from '../components/Rating';
import Product from '../components/Product';
import django from '../django';

interface MatchParams {
  id: string;
}

interface ProductScreenProps extends RouteComponentProps<MatchParams> {}

export const ProductScreen: React.FC<ProductScreenProps> = ({ match }) => {
  const [product, setproduct] = useState<Product>();

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await django.get(`/api/products/${match.params.id}`);
      setproduct(data);
    }

    fetchProduct();
  }, []);

  if (product) {
    return (
      <div>
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>

              <ListGroup.Item>
                <Rating
                  value={product.rating}
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

                <ListGroup.Item>
                  <Button
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
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};
