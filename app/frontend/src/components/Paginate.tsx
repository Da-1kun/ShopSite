import React from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

interface PaginateProps {
  page?: number;
  pages?: number;
  keyword?: string;
  isAdmin?: boolean;
}

const Paginate: React.FC<PaginateProps> = ({
  page,
  pages,
  keyword = '',
  isAdmin = false,
}) => {
  if (keyword) {
    keyword = keyword.split('?keyword=')[1].split('&')[0];
  }

  return (
    <Pagination>
      {[...Array(pages).keys()].map(x => (
        <LinkContainer
          key={x + 1}
          to={
            !isAdmin
              ? `/?keyword=${keyword}&page=${x + 1}`
              : `/admin/productlist/?keyword=${keyword}&page=${x + 1}`
          }
        >
          <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
        </LinkContainer>
      ))}
    </Pagination>
  );
};

export default Paginate;
