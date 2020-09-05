import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Nav from '../Nav/nav';
import {
    addBook,
    deleteBook,
    editBook,
    fetchBooks,
    fetchThreePopularBooks
} from '../../ajax/books';
import DeleteModal from '../modals/common/DeleteModal';
import AddBookModal from '../modals/AddBookModal';
import { fetchBookTypes } from '../../ajax/bookTypes';
import BookTable from '../tables/BookTable';
import InfoModal from '../modals/common/InfoModal';
import fileDownload from 'js-file-download';

class BooksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            selectedBook: null,
            bookTypes: [],

            showCreate: false,
            showModify: false,
            showInfoDialog: false,
            showDelete: false,

            showSuccessMessage: false,
            showFailedMessage: false,
            error: '',

            threePopularBooks: null,
            name: '',
            count: null,
            typeId: ''
        };
    }

    componentDidMount() {
        this.getBooks().catch((e) => this.setState({ error: e }));
        this.getBookTypes().catch((e) => this.setState({ error: e }));
    }

    async getBooks() {
        const res = await fetchBooks();
        const { books } = res;
        if (books) {
            this.setState({ books });
        }
    }

    async getBookTypes() {
        const res = await fetchBookTypes();
        const { bookTypes } = res;
        if (bookTypes) {
            this.setState({ bookTypes });
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

  onCreate = () => {
      this.setState({
          showCreate: true
      });
  }

  onDelete = (id) => {
      this.setState({
          showDelete: true,
          selectedBook: id
      });
  }

  onModify = (book) => {
      this.setState({
          showModify: true,
          selectedBook: book.ID,
          name: book.NAME,
          count: book.COUNT,
          bookType: book.TYPE_ID
      });
  }

  hideModals = () => {
      this.setState({
          showCreate: false,
          showDelete: false,
          showModify: false,
          showInfoDialog: false,

          name: '',
          count: null,
          typeId: '',
          selectedBook: null,
          error: ''
      });
  }

  handleFormChange = (event) => {
      const target = event.target;
      const value = target.name === 'isGoing' ? target.checked : target.value;
      const name = target.name;

      this.setState({
          [name]: value
      });
  }

  onSubmitCreate = async () => {
      const { name, count, bookType } = this.state;
      const body = {
          name,
          count,
          typeId: bookType
      };
      this.hideModals();

      try {
          const res = await addBook(body);
          if (!res.error) await this.getBooks();
      } catch (e) {
          this.setState({ error: e });
      }
  }

  onSubmitModify = async () => {
      const { name, count, bookType, selectedBook } = this.state;
      const body = {
          name,
          count,
          typeId: bookType,
          bookId: selectedBook
      };
      this.hideModals();

      try {
          const res = await editBook(body);
          if (!res.error) await this.getBooks();
      } catch (e) {
          this.setState({ error: e });
      }
  }

  onSubmitDelete = async () => {
      const { selectedBook } = this.state;

      const body = { bookId: selectedBook };

      this.hideModals();

      try {
          const res = await deleteBook(body);
          if (!res.error) await this.getBooks();
      } catch (e) {
          this.setState({ error: e });
      }
  }

  onGetThreePopularBooks = async () => {
      try {
          const res = await fetchThreePopularBooks();
          console.log(res);
          this.setState({
              threePopularBooks: res.threePopularBooks,
              showInfoDialog: true
          });
      } catch (e) {
          this.setState({ error: e });
      }
  }

  onExport = () => {
      const { threePopularBooks } = this.state;

      if (threePopularBooks)
          fileDownload(JSON.stringify(threePopularBooks), 'threePopularBooks.json');
  }

  renderExportButton = () => {
      return (
          <div>
              <Button variant="info" onClick={this.onExport}>
          Export
              </Button>
          </div>
      );
  }

  render() {
      const {
          showCreate,
          showDelete,
          showModify,
          name,
          count,
          bookType,
          bookTypes,
          books,
          threePopularBooks,
          showInfoDialog
      } = this.state;

      return (
          <div>
              <Nav />
              <main role="main" className="ml-sm-auto px-5 p-4">
                  <h2 className="pt-4">Books</h2>

                  <button
                      type="button"
                      className="btn btn-outline-success my-3"
                      onClick={this.onCreate}
                  >
            +Add Book
                  </button>
                  <button
                      type="button"
                      className="btn btn-outline-danger btn-sm mx-2"
                      onClick={this.onGetThreePopularBooks}
                  >
            Show three Popular Books
                  </button>

                  <BookTable
                      books={books}
                      onDelete={this.onDelete}
                      onModify={this.onModify}
                      bookTypes={bookTypes}
                  />

                  <InfoModal
                      isOpen={showInfoDialog}
                      size={'lg'}
                      onClose={this.hideModals}
                      component={
                          <BookTable
                              bookTypes={bookTypes}
                              books={threePopularBooks}
                              withoutTypes
                              readOnly
                          />
                      }
                      customButton={this.renderExportButton()}
                  />
                  <AddBookModal
                      isOpen={showCreate}
                      onClose={this.hideModals}
                      onSubmit={this.onSubmitCreate}
                      onFieldsChange={this.handleFormChange}
                      name={name}
                      count={count}
                      selectedBookType={bookType}
                      bookTypes={bookTypes}
                  />
                  <DeleteModal
                      isOpen={showDelete}
                      onClose={this.hideModals}
                      onDelete={this.onSubmitDelete}
                      title={'Are you sure that you want to remove this book?'}
                  />
                  <AddBookModal
                      isOpen={showModify}
                      onClose={this.hideModals}
                      onSubmit={this.onSubmitModify}
                      onFieldsChange={this.handleFormChange}
                      name={name}
                      count={count}
                      selectedBookType={bookType}
                      bookTypes={bookTypes}
                      isEdit
                  />
              </main>
          </div>
      );
  }
}

export default BooksPage;
