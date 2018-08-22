import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/d2-ui-core';
import EventDialog from './EventDialog';
import TrackedEntityDialog from './TrackedEntityDialog';
import FacilityDialog from './FacilityDialog';
import ThematicDialog from './thematic/ThematicDialog';
import BoundaryDialog from './BoundaryDialog';
import EarthEngineDialog from './EarthEngineDialog';
import { loadLayer, cancelLayer } from '../../actions/layers';

const layerType = {
    event: EventDialog,
    trackedEntity: TrackedEntityDialog,
    facility: FacilityDialog,
    thematic: ThematicDialog,
    boundary: BoundaryDialog,
    earthEngine: EarthEngineDialog,
};

const layerName = {
    event: 'event',
    trackedEntity: 'tracked entity',
    facility: 'facility',
    thematic: 'thematic',
    boundary: 'boundary',
    earthEngine: 'Earth Engine',
};

const styles = {
    content: {
        minWidth: 400,
        maxWidth: 600,
    },
    title: {
        padding: '16px 24px 0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    body: {
        padding: '0 24px',
        minHeight: 300,
    },
};

class LayerEdit extends Component {
    static propTypes = {
        layer: PropTypes.object,
        loadLayer: PropTypes.func.isRequired,
        cancelLayer: PropTypes.func.isRequired,
    };

    componentDidUpdate() {
        const { layer, loadLayer } = this.props;

        if (layer && layer.layer === 'external') {
            // External layers has no edit widget
            loadLayer({ ...layer });
        }
    }

    loadLayer() {
        const { layer, loadLayer } = this.props;

        if (this.layerContainer.getWrappedInstance().validate()) {
            // TODO: Better pattern?
            loadLayer(layer);

            this.closeDialog();
        }
    }

    closeDialog() {
        this.props.cancelLayer();
    }

    render() {
        const { layer, cancelLayer } = this.props;

        if (!layer) {
            return null;
        }

        const type = layer.layer;
        const name = layerName[type];
        const LayerDialog = layerType[type];

        if (!LayerDialog) {
            return null;
        }

        const title = i18n.t(
            layer.id ? `Edit ${name} layer` : `Add new ${name} layer`
        );

        return (
            <Dialog
                title={title}
                contentStyle={styles.content}
                bodyStyle={styles.body}
                titleStyle={styles.title}
                open={true}
                actions={[
                    <Button
                        key="cancel"
                        color="primary"
                        onClick={() => cancelLayer()}
                        selector="cancel"
                    >
                        {i18n.t('Cancel')}
                    </Button>,
                    <Button
                        key="update"
                        color="primary"
                        onClick={() => this.loadLayer()}
                        selector="update"
                    >
                        {i18n.t(
                            layer.id
                                ? i18n.t('Update layer')
                                : i18n.t('Add layer')
                        )}
                    </Button>,
                ]}
            >
                <LayerDialog
                    {...layer}
                    ref={container => (this.layerContainer = container)}
                />
            </Dialog>
        );
    }
}

export default connect(
    state => ({
        layer: state.layerEdit,
    }),
    { loadLayer, cancelLayer }
)(LayerEdit);
