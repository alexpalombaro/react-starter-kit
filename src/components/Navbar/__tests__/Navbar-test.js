/* global jest, describe, it, expect */

/* eslint-disable strict */
'use strict';

jest.dontMock('../Navbar');

describe('Navbar', function() {

  it('sets class name', function() {
    var React = require('react/addons');
    var TestUtils = React.addons.TestUtils;

    var Navbar = require('../Navbar');
    var Component = TestUtils.renderIntoDocument(React.createElement(Navbar));

    var element = TestUtils.findRenderedDOMComponentWithClass(Component, 'navbar-top');
    expect(element).toBeDefined();
  });

});
