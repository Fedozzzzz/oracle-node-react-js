import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import Nav from '../Nav/nav';
import { fetchClients } from '../../ajax/clients';
import DeleteModal from '../modals/common/DeleteModal';
import {
    addJournalNote,
    deleteJournalNote,
    editJournalNote,
    fetchJournal,
} from '../../ajax/journal';
import { fetchBooks, getDayCount } from '../../ajax/books';
import AddJournalNoteModal from '../modals/AddJournalNoteModal';
import { fetchBookTypes } from '../../ajax/bookTypes';

class JournalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            journal: [],
            books: [],
            clients: [],
            bookTypes: [],

            showCreate: false,
            showModify: false,
            showDelete: false,

            selectedJournalRow: null,
            showSuccessMessage: false,
            showFailedMessage: false,
            error: '',

            bookId: null,
            clientId: null,
            dateBegin: '',
            dateEnd: '',
            dateReturn: '',
        };
    }

    componentDidMount() {
        this.getJournalData().catch(e => this.setState({ error: e }));
        this.getClientsData().catch(e => this.setState({ error: e }));
        this.getBooksData().catch(e => this.setState({ error: e }));
        this.getBookTypesData().catch(e => this.setState({ error: e }));
    }

    async getClientsData() {
        const res = await fetchClients();
        const { clients } = res;
        if (clients) {
            this.setState({ clients });
        }
    }

    async getBookTypesData() {
        const res = await fetchBookTypes();
        const { bookTypes } = res;
        if (bookTypes) {
            this.setState({ bookTypes });
        }
    }

    async getBooksData() {
        const res = await fetchBooks();
        const { books } = res;
        if (books) {
            this.setState({ books });
        }
    }

    async getJournalData() {
        const res = await fetchJournal();
        const { journal } = res;
        if (journal) {
            this.setState({ journal });
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
            showCreate: true,
        });
    };

    onDelete = id => {
        this.setState({
            showDelete: true,
            selectedJournalRow: id,
        });
    };

    onModify = journal => {
        console.log(journal.DATE_BEG);
        this.setState({
            showModify: true,
            selectedJournalRow: journal.ID,
            clientId: journal.CLIENT_ID,
            bookId: journal.BOOK_ID,
            firstName: journal.FIRST_NAME,
            lastName: journal.LAST_NAME,
            patherName: journal.PATHER_NAME,
            dateBegin: journal.DATE_BEG,
            dateEnd: journal.DATE_END,
            dateReturn: journal.DATE_RET,
        });
    };

    hideModals = () => {
        this.setState({
            showCreate: false,
            showDelete: false,
            showModify: false,

            selectedJournalRow: null,
            clientId: null,
            bookId: null,
            firstName: null,
            lastName: null,
            patherName: null,
            dateBegin: null,
            dateEnd: null,
            dateReturn: null,
        });
    };

    hideMessages = () => {
        this.setState({
            showFailedMessage: false,
            showSuccessMessage: false,
        });
    };

    handleFormChange = event => {
        const target = event.target;
        const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };

    onSubmitCreate = async () => {
        const { bookId, clientId } = this.state;
        const { dayCount } = await getDayCount({ bookId });
        const body = {
            bookId,
            clientId,
            dateBeg: new Date(),
            dateEnd: new Date(new Date().setDate(new Date().getDate() + dayCount)),
        };
        this.hideModals();

        try {
            const res = await addJournalNote(body);
            if (!res.error) await this.getJournalData();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onSubmitModify = async () => {
        const { selectedJournalRow, dateReturn } = this.state;
        const body = {
            journalRowId: selectedJournalRow,
            dateRet: new Date(dateReturn),
        };
        this.hideModals();

        try {
            const res = await editJournalNote(body);
            if (!res.error) await this.getJournalData();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onSubmitDelete = async () => {
        const { selectedJournalRow } = this.state;

        const body = { journalRowId: selectedJournalRow };

        this.hideModals();

        try {
            const res = await deleteJournalNote(body);
            if (!res.error) await this.getJournalData();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    renderTableRows() {
        const { journal } = this.state;

        return journal.map(j =>
            <tr key={j.ID}>
                <th>{j.ID}</th>
                <th>{j.BOOK_ID}</th>
                <th>{j.CLIENT_ID}</th>
                <th>{`${j.FIRST_NAME} ${j.LAST_NAME} ${j.PATHER_NAME}`}</th>
                <th>{j.BOOK_NAME}</th>
                <th>{j.DATE_BEG}</th>
                <th>{j.DATE_END}</th>
                <th>{j.DATE_RET}</th>
                <th className="flex-column justify-content-center">
                    <button
                        type="button"
                        className="col btn btn-outline-danger btn-sm"
                        onClick={() => this.onDelete(j.ID)}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="col btn btn-outline-warning btn-sm"
                        onClick={() => this.onModify(j)}
                    >
                        Edit
                    </button>
                </th>
            </tr>
        );
    }

    renderFailedMessage() {
        const { error } = this.state;

        return (
            <Alert variant="danger" onClose={() => this.hideMessages()} dismissible>
                {`Operation denied: ${error}`}
            </Alert>
        );
    }

    renderSuccessMessage() {
        return (
            <Alert variant="success" onClose={() => this.hideMessages()} dismissible>
                Operation finished successfully!
            </Alert>
        );
    }

    renderJournalTable() {
        return (
            <div className="table-responsive">
                <table className="table table-sm table-bordered table-hover">
                    <thead>
                        <tr className="table-primary">
                            <th className="bold">ID</th>
                            <th className="bold">Book ID</th>
                            <th className="bold">Client ID</th>
                            <th className="bold">Client Full Name</th>
                            <th className="bold">Book Name</th>
                            <th className="bold">Date Begin</th>
                            <th className="bold">Date End</th>
                            <th className="bold">Date Return</th>
                            <th className="bold" />
                        </tr>
                    </thead>
                    <tbody>{this.renderTableRows()}</tbody>
                </table>
            </div>
        );
    }

    render() {
        const {
            showCreate,
            showDelete,
            showModify,
            dateBegin,
            dateEnd,
            dateReturn,
            books,
            clients,
            bookId,
            clientId,
        } = this.state;

        return (
            <div>
                <Nav />
                <main role="main" className="ml-sm-auto px-5 p-4">
                    <h2 className="pt-4">Journal</h2>
                    <button
                        type="button"
                        className="btn btn-outline-success my-3"
                        onClick={this.onCreate}
                    >
                        +Add note
                    </button>

                    {this.renderJournalTable()}

                    <AddJournalNoteModal
                        isOpen={showCreate}
                        onClose={this.hideModals}
                        onSubmit={this.onSubmitCreate}
                        onFieldsChange={this.handleFormChange}
                        books={books}
                        clients={clients}
                        clientId={clientId}
                        bookId={bookId}
                        dateBegin={dateBegin}
                        dateEnd={dateEnd}
                        dateReturn={dateReturn}
                    />
                    <DeleteModal
                        isOpen={showDelete}
                        onClose={this.hideModals}
                        onDelete={this.onSubmitDelete}
                        title={
                            'Are you sure that you want to delete this journal note?'
                        }
                    />
                    <AddJournalNoteModal
                        isOpen={showModify}
                        onClose={this.hideModals}
                        onSubmit={this.onSubmitModify}
                        onFieldsChange={this.handleFormChange}
                        books={books}
                        clients={clients}
                        clientId={clientId}
                        bookId={bookId}
                        dateBegin={dateBegin}
                        dateEnd={dateEnd}
                        dateReturn={dateReturn}
                        isEdit
                    />
                </main>
            </div>
        );
    }
}

export default JournalPage;
