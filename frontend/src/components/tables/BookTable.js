import React from 'react';
import PropTypes from 'prop-types';

export default function BookTable(props) {
    const {
        books,
        onDelete,
        onModify,
        bookTypes,
        withoutTypes = false,
        readOnly = false
    } = props;

    function renderTableRows() {
        return books.map((bk) =>
            <tr key={bk.ID}>
                <th>{bk.ID}</th>
                <th>{bk.NAME}</th>
                <th>{bk.COUNT}</th>
                {!withoutTypes && <th>{bk.TYPE_ID}</th>}
                {!withoutTypes && <th>{getTypeNameById(bk.TYPE_ID)}</th>}
                {!readOnly &&
          <th>
              {onDelete &&
              <button
                  type="button"
                  className="btn btn-outline-danger btn-sm mx-2"
                  onClick={() => onDelete(bk.ID)}
              >
                Delete
              </button>
              }
              {onModify &&
              <button
                  type="button"
                  className="btn btn-outline-warning btn-sm "
                  onClick={() => onModify(bk)}
              >
                Edit
              </button>
              }
          </th>
                }
            </tr>
        );
    }

    function getTypeNameById(id) {
        const result = bookTypes.find((bt) => bt.ID === id);
        if (!result) return '';
        return result.NAME;
    }

    return (
        <div className="table-responsive">
            <table className="table table-sm table-bordered table-hover">
                <thead>
                    <tr className="table-warning">
                        <th className="bold">ID</th>
                        <th className="bold">Book Name</th>
                        <th className="bold">Count</th>
                        {!withoutTypes && <th className="bold">Type ID</th>}
                        {!withoutTypes && <th className="bold">Type</th>}
                        {!withoutTypes && <th className="bold" />}
                    </tr>
                </thead>
                <tbody>{renderTableRows()}</tbody>
            </table>
        </div>
    );
}

BookTable.propTypes = {
    books: PropTypes.array,
    onDelete: PropTypes.func,
    onModify: PropTypes.func,
    bookTypes: PropTypes.array,
    withoutTypes: PropTypes.bool,
    readOnly: PropTypes.bool,
};