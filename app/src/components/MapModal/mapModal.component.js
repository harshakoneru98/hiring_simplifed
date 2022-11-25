import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import './mapModal.scss';

export default function MapModal({ state, show, handleClose, stateData }) {
    console.log('State Data : ', stateData);

    return (
        <Modal
            show={show}
            backdrop={true}
            keyboard={false}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>State Statistics</Modal.Title>
            </Modal.Header>
            <Modal.Body>Welcome to {state}</Modal.Body>
        </Modal>
    );
}
