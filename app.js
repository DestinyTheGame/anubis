import React, { Component } from 'react';
import { render } from 'react-dom';

class Application extends Component {
  render() {
    return <div>Hello from electron</div>;
  }
}

render(<Application />, document.getElementById('root'));
