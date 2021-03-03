import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { RootState } from '../redux/rootReducer';
import { fetchProductList } from '../redux/product/productListSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
// import ProductCarousel from '../components/ProductCarousel'

const HomeScreen: React.FC<RouteComponentProps> = ({ history }) => {
  const dispatch = useDispatch();
  const productList = useSelector((state: RootState) => state.productList);
  const { errorMessage, isLoading, products, page, pages } = productList;

  let keyword = history.location.search;

  useEffect(() => {
    dispatch(fetchProductList(keyword));
  }, [dispatch, keyword]);

  return (
    <div>
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : errorMessage ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <div>
          <Row>
            {products.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {pages && pages > 1 && (
            <Paginate page={page} pages={pages} keyword={keyword} />
          )}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
