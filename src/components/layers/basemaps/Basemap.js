import React from 'react';
import PropTypes from 'prop-types';
import './Basemap.css';

const Basemap = ({ id, img, name, isSelected, onClick }) => {
    const borderStyle = {
        outline: isSelected ? '3px solid orange' : '1px solid #999',
    };

    return (
        <div className="Basemap" title={name} onClick={() => onClick(id)}>
            <div className="Basemap-image-container" style={borderStyle}>
                {img ? (
                    <img src={img} className="Basemap-image" />
                ) : (
                    <div className="Basemap-no-image">External basemap</div>
                )}
            </div>
            <div className="Basemap-name">{name}</div>
        </div>
    );
};

Basemap.propTypes = {
    id: PropTypes.string.isRequired,
    img: PropTypes.string,
    name: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

Basemap.defaultProps = {
    title: '',
};

export default Basemap;
