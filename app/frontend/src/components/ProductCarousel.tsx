import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';

import { RootState } from '../redux/rootReducer';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../redux/product/productTopRatedSlice';

const ProductCarousel: React.FC = ({}) => {
  const dispatch = useDispatch();

  const productTopRated = useSelector(
    (state: RootState) => state.productTopRated
  );
  const { errorMessage, isLoading, products } = productTopRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return isLoading ? (
    <Loader />
  ) : errorMessage ? (
    <Message variant="danger">{errorMessage}</Message>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel.caption">
              <h4>
                {product.name} (${product.price})
              </h4>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
