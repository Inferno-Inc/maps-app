import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';
import MapProvider from '../../map/MapProvider';

console.log('App', App);

describe('App', () => {
    it('renders a MapProvider', () => {
        expect(shallow(<App />).find(MapProvider).length).toBe(1);
    });
});
