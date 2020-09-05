import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import Nav from '../Nav/nav';
import {
    addClient,
    deleteClient,
    editClient,
    fetchClientBooksCount,
    fetchClients,
    getClientFine,
} from '../../ajax/clients';
import DeleteModal from '../modals/common/DeleteModal';
import CreateClientModal from '../modals/CreateClientModal';
import InfoModal from '../modals/common/InfoModal';

class ClientsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            showCreate: false,
            showModify: false,
            showDelete: false,
            showInfoMessage: false,

            selectedClient: null,
            showSuccessMessage: false,
            showFailedMessage: false,
            error: '',

            firstName: '',
            lastName: '',
            patherName: '',
            passportSeria: '',
            passportNum: '',
            clientBookCount: null,
        };
    }

    componentDidMount() {
        this.getClients().catch(e => this.setState({ error: e }));
    }

    async getClients() {
        const res = await fetchClients();
        const { clients } = res;
        if (clients) {
            this.setState({ clients });
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
            selectedClient: id,
        });
    };

    onModify = client => {
        this.setState({
            showModify: true,
            selectedClient: client.ID,
            firstName: client.FIRST_NAME,
            lastName: client.LAST_NAME,
            patherName: client.PATHER_NAME,
            passportSeria: client.PASSPORT_SERIA,
            passportNum: client.PASSPORT_NUM,
        });
    };

    hideModals = () => {
        this.setState({
            showCreate: false,
            showDelete: false,
            showModify: false,

            firstName: '',
            lastName: '',
            patherName: '',
            passportSeria: '',
            passportNum: '',
            showInfoMessage: false,
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
        const {
            firstName,
            lastName,
            patherName,
            passportSeria,
            passportNum,
        } = this.state;
        const body = {
            firstName,
            lastName,
            patherName,
            passportSeria,
            passportNum,
        };
        this.hideModals();

        try {
            const res = await addClient(body);
            if (!res.error) await this.getClients();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onSubmitModify = async () => {
        const {
            firstName,
            lastName,
            patherName,
            passportSeria,
            passportNum,
            selectedClient,
        } = this.state;
        const body = {
            clientId: selectedClient,
            firstName,
            lastName,
            patherName,
            passportSeria,
            passportNum,
        };
        this.hideModals();

        try {
            const res = await editClient(body);
            if (!res.error) await this.getClients();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onSubmitDelete = async () => {
        const { selectedClient } = this.state;

        const body = { userId: selectedClient };

        this.hideModals();

        try {
            const res = await deleteClient(body);
            if (!res.error) await this.getClients();
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onShowBooksCount = async clientId => {
        try {
            const res = await fetchClientBooksCount({ clientId });
            this.setState({
                infoMessage: `This client has ${
                    res.clientBooksCount !== 0 ? res.clientBooksCount : 'no'
                } books`,
                showInfoMessage: true,
            });
        } catch (e) {
            this.setState({ error: e });
        }
    };

    onShowClientFine = async clientId => {
        try {
            const res = await getClientFine({ clientId });
            const { clientFine } = res;
            if (clientFine !== undefined) {
                if (clientFine !== 0) {
                    this.setState({
                        infoMessage: `This client fine is ${clientFine} rubles`,
                        showInfoMessage: true,
                    });
                } else {
                    this.setState({
                        infoMessage: 'This client has no fine',
                        showInfoMessage: true,
                    });
                }
            }
        } catch (e) {
            this.setState({ error: e });
        }
    };

    renderTableRows() {
        const { clients } = this.state;

        return clients.map(cl => (
            <tr key={cl.ID}>
                <th>{cl.ID}</th>
                <th>{cl.FIRST_NAME}</th>
                <th>{cl.LAST_NAME}</th>
                <th>{cl.PATHER_NAME}</th>
                <th>{cl.PASSPORT_SERIA}</th>
                <th>{cl.PASSPORT_NUM}</th>
                <th>
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm mx-2"
                        onClick={() => this.onDelete(cl.ID)}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-warning btn-sm mx-2"
                        onClick={() => this.onModify(cl)}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning btn-sm mx-2"
                        onClick={() => this.onShowBooksCount(cl.ID)}
                    >
                        Show Books Count
                    </button>
                </th>
            </tr>
        ));
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

    renderClientsTable() {
        return (
            <div className="table-responsive">
                <table className="table table-sm table-bordered table-hover">
                    <thead>
                        <tr className="table-primary">
                            <th className="bold">ID</th>
                            <th className="bold">First Name</th>
                            <th className="bold">Last Name</th>
                            <th className="bold">Pather Name</th>
                            <th className="bold">Passport seria</th>
                            <th className="bold">Passport number</th>
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
            infoMessage,
            firstName,
            lastName,
            patherName,
            passportSeria,
            passportNum,
            showInfoMessage,
        } = this.state;

        return (
            <div>
                <Nav />
                <main role="main" className=" ml-sm-auto px-5 p-4">
                    <h2 className="pt-4">Clients</h2>

                    <button
                        type="button"
                        className="btn btn-outline-success my-3"
                        onClick={this.onCreate}
                    >
                        +Add client
                    </button>

                    {this.renderClientsTable()}

                    <CreateClientModal
                        isOpen={showCreate}
                        onClose={this.hideModals}
                        onSubmit={this.onSubmitCreate}
                        onFieldsChange={this.handleFormChange}
                        firstName={firstName}
                        lastName={lastName}
                        patherName={patherName}
                        passportSeria={passportSeria}
                        passportNum={passportNum}
                    />
                    <InfoModal
                        isOpen={showInfoMessage}
                        message={infoMessage}
                        onClose={this.hideModals}
                    />
                    <DeleteModal
                        isOpen={showDelete}
                        onClose={this.hideModals}
                        onDelete={this.onSubmitDelete}
                        title={'Are you sure that you want to delete this client?'}
                    />
                    <CreateClientModal
                        isOpen={showModify}
                        onClose={this.hideModals}
                        onSubmit={this.onSubmitModify}
                        onFieldsChange={this.handleFormChange}
                        firstName={firstName}
                        lastName={lastName}
                        patherName={patherName}
                        passportSeria={passportSeria}
                        passportNum={passportNum}
                        isEdit
                    />
                </main>
            </div>
        );
    }
}

export default ClientsPage;
