import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { RootState } from '../redux/rootReducer';
import { userUpdateReset, updateUser } from '../redux/user/userUpdateSlice';
import { getUserDetails } from '../redux/user/userDetailsSlice';

interface MatchParams {
  id: string;
}
interface UserEditScreenProps extends RouteComponentProps<MatchParams> {}

const UserEditScreen: React.FC<UserEditScreenProps> = ({ match, history }) => {
  const userId = match.params.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state: RootState) => state.userDetails);
  const { errorMessage, isLoading, user } = userDetails;

  const userUpdate = useSelector((state: RootState) => state.userUpdate);
  const {
    errorMessage: errorUpdate,
    isLoading: loadingUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch(userUpdateReset());
      history.push('/admin/userlist');
    } else {
      if (!user?.name || user._id !== Number(userId)) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [user, userId, successUpdate, history]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
    }
  };

  return (
    <div>
      <Link to="/admin/userlist">Go Back</Link>

      <FormContainer>
        <h1>Edit User</h1>
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

            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isadmin">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditScreen;
