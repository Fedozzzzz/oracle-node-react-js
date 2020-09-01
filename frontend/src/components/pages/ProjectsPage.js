import React, { Component } from 'react';
import { Modal, Button, Form, Col, Alert} from 'react-bootstrap';
import Nav from '../Nav/nav';
import { formatDate } from '../../utils';
import _ from 'lodash';


class ProjectsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            showCreate: false,
            showModify: false,
            showDelete: false,

            showSuccessMessage: false,
            showFailedMessage: false,
            error: '',

            name: '',
            cost: 0,
            department: null,
            startDate: null,
            endDate: null,
            realEndDate: null,
            selectedProject: null
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    onCreate() {
        this.setState({
            showCreate: true
        });
    }

    onDelete(id) {
        this.setState({
            showDelete: true,
            selectedProject: id
        });
    }

    onModify(id) {
        this.setState({
            showModify: true,
            selectedProject: id
        })
    }

    hideModals() {
        this.setState({
            showCreate: false,
            showDelete: false,
            showModify: false,

            name: '',
            cost: 0,
            department: null,
            startDate: null,
            endDate: null,
            realEndDate: null,
            selectedProject: null
        });
    }

    hideMessages() {
        this.setState({
            showFailedMessage: false,
            showSuccessMessage: false
        })
    }

    handleFormChange = event => {
        const target = event.target;
        const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    onSubmitCreate() {
        const {name, cost, department, startDate, endDate, realEndDate} = this.state;
        const body = {
            name: name,
            cost: cost,
            department: department,
            startDate: startDate,
            endDate: endDate,
            realEndDate: realEndDate
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // dunno that is it
            body: JSON.stringify(body)
        };

        fetch('/api/projects/create', requestOptions)
            .then(response => this.handleErrors(response))
            .then(response => this.setState({ showSuccessMessage: response === 1}))
            .catch(error => this.setState({ error, showFailedMessage: true }));

        this.hideModals();

        fetch('/api/projects')
            .then(res => res.json())
            .then(projects => this.setState({ projects }));
    }

    onSubmitModify() {
        const {name, cost, department, startDate, endDate, realEndDate, selectedProject, projects} = this.state;
        const values = _.find(projects, project => project.ID === selectedProject);
        const body = {
            name: name === '' ? values.NAME : name,
            cost: cost === 0 ? values.COST : cost,
            department: _.isNil(department) ? values.DEPARTMENT_ID : department,
            startDate: _.isNil(startDate) ? _.split(values.DATE_BEG, 'T', 1)[0] : startDate,
            endDate: _.isNil(endDate) ? _.split(values.DATE_END, 'T', 1)[0] : endDate,
            realEndDate: _.isNil(realEndDate) ? _.split(values.DATE_END_REAL, 'T', 1)[0] : realEndDate,
            id: selectedProject
        }
        console.log(body)

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // dunno that is it
            body: JSON.stringify(body)
        };


        fetch(`/api/projects/${selectedProject}/modify`, requestOptions)
            .then(response => this.handleErrors(response))
            .then(response => this.setState({ showSuccessMessage: response === 1}))
            .catch(error => this.setState({ error, showFailedMessage: true }));

        this.hideModals();

        fetch('/api/projects')
            .then(res => res.json())
            .then(projects => this.setState({ projects }));
    }

    renderCreateModal() {
        const { showCreate, departments } = this.state;
        return (
            <Modal show={showCreate} size="lg" onHide={() => this.hideModals()}>
                <Modal.Header>
                    <Modal.Title>Create new project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="Enter name" onChange={(e) => this.handleFormChange(e)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cost of project</Form.Label>
                            <Form.Control type="number" name="cost" placeholder="Cost $" min="0" onChange={(e) => this.handleFormChange(e)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select" name="department" onChange={(e) => this.handleFormChange(e)}>
                                <option>Choose...</option>
                                {_.map(departments, department => <option value={department.ID}>{department.NAME}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Start date</Form.Label>
                                <Form.Control type="date" name="startDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>End date</Form.Label>
                                <Form.Control type="date" name="endDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Real End date</Form.Label>
                                <Form.Control type="date" name="realEndDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => this.hideModals()}>Close</Button>
                    <Button variant="info" onClick={() => this.onSubmitCreate()} >Create new project</Button>
                </Modal.Footer>
            </Modal>
        );

    }

    renderDeleteModal() {

    }

    renderModifyModal() {
        const { showModify, departments, projects, selectedProject} = this.state;
        const values = _.find(projects, project => project.ID === selectedProject);
        return (
            <Modal show={showModify} size="lg" onHide={() => this.hideModals()}>
                <Modal.Header>
                    <Modal.Title>Modify selected project</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Project name</Form.Label>
                            <Form.Control type="text" defaultValue={values.NAME} name="name" placeholder="Enter name" onChange={(e) => this.handleFormChange(e)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Cost of project</Form.Label>
                            <Form.Control type="number" defaultValue={values.COST} name="cost" placeholder="Cost $" min="0" onChange={(e) => this.handleFormChange(e)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Department</Form.Label>
                            <Form.Control as="select" defaultValue={values.DEPARTMENT_ID} name="department" onChange={(e) => this.handleFormChange(e)}>
                                <option>Choose...</option>
                                {_.map(departments, department => <option value={department.ID}>{department.NAME}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Row>
                            <Form.Group as={Col} md="4">
                                <Form.Label>Start date</Form.Label>
                                <Form.Control type="date" defaultValue={_.split(values.DATE_BEG, 'T', 1)} name="startDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>End date</Form.Label>
                                <Form.Control type="date" defaultValue={_.split(values.DATE_END, 'T', 1)} name="endDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>

                            <Form.Group as={Col} md="4">
                                <Form.Label>Real End date</Form.Label>
                                <Form.Control type="date" defaultValue={_.split(values.DATE_END_REAL, 'T', 1)} name="realEndDate" onChange={(e) => this.handleFormChange(e)}/>
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="outline-info" onClick={() => this.hideModals()}>Close</Button>
                    <Button variant="info" onClick={() => this.onSubmitModify()} >Modify project</Button>
                </Modal.Footer>
            </Modal>
        );

    }

    renderTableRows() {
        const { projects } = this.state;
        const tableRows = projects.map(project => {
            return (
                <tr key={project.ID}>
                    <th>{project.ID}</th>
                    <th>{project.NAME}</th>
                    <th>{project.COST}</th>
                    <th>{project.DEPARTMENT_ID}</th>
                    <th>{formatDate(project.DATE_BEG)}</th>
                    <th>{formatDate(project.DATE_END)}</th>
                    <th>{formatDate(project.DATE_END_REAL)}</th>
                    <th>
                        <button type="button" className="btn btn-outline-info btn-sm mx-2" onClick={() => this.onDelete(project.ID)}>delete</button>
                        <button type="button" className="btn btn-outline-info btn-sm " onClick={() => this.onModify(project.ID)}>modify</button>
                    </th>
                </tr>
            )
        });

        return tableRows;
    }

    renderFailedMessage() {
        const {error} = this.state;

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

    componentDidMount() {
        fetch('/api/projects')
            .then(res => res.json())
            .then(projects => this.setState({ projects }));

        fetch('/api/departments')
            .then(res => res.json())
            .then(departments => this.setState({ departments }));
    };

    render() {
        const { showCreate, showDelete, showModify, showFailedMessage, showSuccessMessage} = this.state;

        return (
            <div className="row">               <Nav />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-5 p-4">
                    <h2 className="pt-4">Projects</h2>

                    {showSuccessMessage ? this.renderSuccessMessage() : null}
                    {showFailedMessage ? this.renderFailedMessage() : null}

                    <button type="button" className="btn btn-outline-info my-3" onClick={() => this.onCreate()}>Create new project</button>

                    <div className="table-responsive">
                        <table className="table table-sm table-bordered table-hover">
                            <thead>
                                <tr className="table-info">
                                    <th className="bold">ID</th>
                                    <th className="bold">Name</th>
                                    <th className="bold">Cost</th>
                                    <th className="bold">Department ID</th>
                                    <th className="bold">Start Date</th>
                                    <th className="bold">End Date</th>
                                    <th className="bold">Real End Date</th>
                                    <th className="bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderTableRows()}
                            </tbody>
                        </table>
                    </div>

                    {showCreate ? this.renderCreateModal() : null}
                    {showDelete ? this.renderDeleteModal() : null}
                    {showModify ? this.renderModifyModal() : null}
                </main>
            </div>
        )
    }
}

export default ProjectsPage;
