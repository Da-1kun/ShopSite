import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import django from '../django';
import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { RootState } from '../redux/rootReducer';
import {
  productUpdateReset,
  updateProduct,
} from '../redux/product/productUpdateSlice';
import { fetchProductDetails } from '../redux/product/productDetailsSlice';

interface MatchParams {
  id: string;
}
interface ProductEditScreenProps extends RouteComponentProps<MatchParams> {}

const ProductEditScreen: React.FC<ProductEditScreenProps> = ({
  history,
  match,
}) => {
  const productId = match.params.id;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('0');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const productDetails = useSelector(
    (state: RootState) => state.productDetails
  );
  const { errorMessage, isLoading, product } = productDetails;

  const productUpdate = useSelector((state: RootState) => state.productUpdate);
  const {
    errorMessage: errorUpdate,
    isLoading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch(productUpdateReset());
      history.push('/admin/productlist');
    } else {
      if (!product?.name || product._id !== Number(productId)) {
        dispatch(fetchProductDetails(Number(productId)));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, history, successUpdate]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: Number(productId),
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e: any) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('image', file);
    formData.append('product_id', productId);

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await django.post(
        '/api/products/upload/',
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <div>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <Message variant="danger">{errorMessage}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={e => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={e => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={e => setImage(e.target.value)}
                disabled
              ></Form.Control>

              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countinstock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock"
                value={countInStock}
                onChange={e => setCountInStock(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={e => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
    </div>
  );
};

export default ProductEditScreen;
