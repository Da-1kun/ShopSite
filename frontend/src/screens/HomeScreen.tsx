import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Product from '../components/Product';
import { RootState } from '../redux/rootReducer';
import { fetchProductList } from '../redux/product/productListSlice';

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state: RootState) => state.productList);
  const { error, loading, products } = productList;

  useEffect(() => {
    dispatch(fetchProductList());
  }, [dispatch]);

  return (
    <div>
      <h1>Latest Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeScreen;
