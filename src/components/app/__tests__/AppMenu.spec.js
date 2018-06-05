import React from 'react';
import { shallow } from 'enzyme';
import i18n from '@dhis2/d2-i18n';
import { Toolbar } from 'material-ui/Toolbar';
import Button from 'material-ui/FlatButton';
import { AppMenu } from '../AppMenu';

describe('AppMenu', () => {
    jest.spyOn(i18n, 't').mockImplementation(text => text);

    it('renders a MUI Toolbar', () => {
        const wrapper = shallow(<AppMenu openAboutDialog={jest.fn()} />);
        expect(wrapper.find(Toolbar).length).toBe(1);
    });

    it('call openAboutDialog function if About button is clicked', () => {
        const openAboutDialog = jest.fn();
        const wrapper = shallow(<AppMenu openAboutDialog={openAboutDialog} />);
        wrapper.find(Button).simulate('click');
        expect(openAboutDialog).toHaveBeenCalledTimes(1);
    });
});