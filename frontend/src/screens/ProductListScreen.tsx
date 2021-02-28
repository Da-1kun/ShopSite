import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { RootState } from '../redux/rootReducer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  productCreateReset,
  createProduct,
} from '../redux/product/productCreateSlice';
import { fetchProductList } from '../redux/product/productListSlice';
import { deleteProduct } from '../redux/product/productDeleteSlice';
// import Paginate from '../components/Paginate'

interface ProductListScreenProps extends RouteComponentProps {}

const ProductListScreen: React.FC<ProductListScreenProps> = ({ history }) => {
  const dispatch = useDispatch();

  const productList = useSelector((state: RootState) => state.productList);
  const { isLoading, errorMessage, products } = productList;

  const productDelete = useSelector((state: RootState) => state.productDelete);
  const {
    isLoading: loadingDelete,
    errorMessage: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state: RootState) => state.productCreate);
  const {
    isLoading: loadingCreate,
    errorMessage: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(productCreateReset());

    if (!userInfo?.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct?._id}/edit`);
    } else {
      dispatch(fetchProductList());
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {isLoading ? (
        <Loader />
      ) : errorMessage ? (
        <Message variant="danger">{errorMessage}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>

                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* <Paginate pages={pages} page={page} isAdmin={true} /> */}
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
