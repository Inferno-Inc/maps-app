import React from 'react';
import { render } from 'react-dom';
import union from 'lodash/fp/union';
import { init, config, getUserSettings } from 'd2/lib/d2';
import PluginMap from './components/map/PluginMap';
import { mapRequest } from './util/requests';
import { fetchLayer } from './loaders/layers';
import { configI18n } from './util/i18n';
import '../scss/plugin.scss';

// Inspiration:
// pivot: https://github.com/dhis2/pivot-tables-app/blob/master/src/plugin.js
// d2-analysis: https://github.com/dhis2/d2-analysis/blob/master/src/util/Plugin.js

const apiVersion = 29;

const Plugin = () => {
    let _configs = [];

    // https://github.com/dhis2/d2-analysis/blob/master/src/util/Plugin.js#L20
    function add(...configs) {
        configs = Array.isArray(configs[0]) ? configs[0] : configs;

        if (configs.length) {
            _configs = [..._configs, ...configs];
        }
    }

    // https://github.com/dhis2/d2-analysis/blob/master/src/util/Plugin.js#L28
    function load(...configs) {
        add(Array.isArray(configs[0]) ? configs[0] : configs);

        const { url, username, password } = this;

        if (url) {
            config.baseUrl = `${url}/api/${apiVersion}`;
        }

        if (username && password) {
            config.context = {auth: `${username}:${password}`};
        }

        config.schemas = union(config.schemas, [
            'legendSet',
            'map',
            'optionSet',
            'organisationUnitGroup',
            'organisationUnitGroupSet',
            'programStage'
        ]);

        getUserSettings()
            .then(configI18n)
            .then(init)
            .then(onInit);
    }

    function onInit() {
        _configs.forEach(config => {
            if (!config.id) {
                loadLayers(config);
            } else { // Load favorite
                mapRequest(config.id)
                    .then(favorite => loadLayers({
                        ...config,
                        ...favorite,
                    }));
            }
        });
    }

    function loadLayers(config) {
        Promise.all(config.mapViews.map(fetchLayer)).then(mapViews => drawMap({
            ...config,
            mapViews,
        }));
    }

    function drawMap(config) {
        render(<PluginMap {...config} />, document.getElementById(config.el));
    }

    return { // Public properties
        url: null,
        username: null,
        password: null,
        loadingIndicator: false,
        load,
        add,
    };
};

const mapsPlugin = new Plugin();

global.mapsPlugin = mapsPlugin;

export default mapsPlugin;
