import React from 'react';
import '../css/App.css';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import { findIndex, without } from 'lodash';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: '',
      lastIndex: 0
    }

    this.updateInfo = this.updateInfo.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.deleteAppointment = this.deleteAppointment.bind(this);
  }

  updateInfo(name, value, aptId) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, { aptId });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts
    });
  }

  searchApts(queryText) {
    this.setState({
      queryText
    })
  }

  changeOrder(orderBy, orderDir) {
    this.setState({
      orderBy,
      orderDir
    });
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay
    })
  }

  addAppointment(apt) {
    const tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts
    });
  }

  componentDidMount() {
    fetch('./data.json')
      .then(response => response.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({ myAppointments: apts });
      })
  }

  render() {

    let order;
    let filteredAppointments = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredAppointments = filteredAppointments.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    })
      .filter(eachItem => {
        return (
          eachItem['petName'] && eachItem['petName']
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem['owerName'] && eachItem['owerName']
            //.toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem['aptNotes'] && eachItem['aptNotes']
            //.toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        )
      });

    return (<main className="page bg-white" id="petratings" >
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointments
                formDisplay={this.state.formDisplay}
                toggleForm={this.toggleForm}
                addAppointment={this.addAppointment}
              />
              <SearchAppointments
                orderBy={this.state.orderBy}
                orderDir={this.state.orderDir}
                changeOrder={this.changeOrder}
                searchApts={this.searchApts}
              />
              <ListAppointments
                appointments={filteredAppointments}
                deleteAppointment={this.deleteAppointment}
                updateInfo={this.updateInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
}

export default App;
