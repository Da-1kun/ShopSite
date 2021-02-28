import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';

interface Product {
  _id: number;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string;
  price: string;
  countInStock: number;
  rating?: string;
  numReviews?: number;
}

interface Props {
  product: Product;
}

const Product: React.FC<Props> = ({ product }: Props) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={Number(product.rating)}
              text={`${product.numReviews} reviews`}
              color={'#f8e825'}
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
