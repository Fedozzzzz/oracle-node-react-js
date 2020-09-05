import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import Nav from '../Nav/nav';
import { fetchBookTypes } from '../../ajax/bookTypes';

class BookTypesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookTypes: [],

            error: '',
        };
    }

    componentDidMount() {
        this.getBookTypes().catch(e => this.setState({ error: e }));
    }

    async getBookTypes() {
        try {
            const res = await fetchBookTypes();
            const { bookTypes } = res;
            if (bookTypes) {
                this.setState({ bookTypes });
            }
        } catch (e) {
            this.setState({ error: e });
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    hideMessages = () => {
        this.setState({
            showFailedMessage: false,
            showSuccessMessage: false,
        });
    };

    renderTableRows() {
        const { bookTypes } = this.state;

        return bookTypes.map(bt =>
            <tr key={bt.ID}>
                <th>{bt.ID}</th>
                <th>{bt.NAME}</th>
                <th>{bt.COUNT}</th>
                <th>{bt.FINE}</th>
                <th>{bt.DAY_COUNT}</th>
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

    renderBooksTypesTable() {
        return (
            <div className="table-responsive">
                <table className="table table-sm table-bordered table-hover">
                    <thead>
                        <tr className="table-secondary">
                            <th className="bold">ID</th>
                            <th className="bold">Type Name</th>
                            <th className="bold">Count</th>
                            <th className="bold">Fine</th>
                            <th className="bold">Day count</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderTableRows()}</tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                <Nav />
                <main role="main" className="ml-sm-auto px-5 p-4">
                    <h2 className="pt-4">Book Types</h2>
                    {this.renderBooksTypesTable()}
                </main>
            </div>
        );
    }
}

export default BookTypesPage;
