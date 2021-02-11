import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import django from '../django';

const HomeScreen: React.FC = () => {
  const [products, setproducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await django.get('/api/products');
      setproducts(data);
    }

    fetchProducts();
  }, []);

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
