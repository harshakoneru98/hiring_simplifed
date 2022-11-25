import React, { Fragment, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { state_names } from '../../config';
import './mapModal.scss';

export default function MapModal({ state, show, handleClose, stateData }) {
    let selected_state = stateData.filter((s) => s.state_code === state);

    const state_name = state_names.filter((s) => s.name === state)[0]?.fullName;

    return (
        <Modal
            show={show}
            backdrop={true}
            keyboard={false}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>{state_name} State Statistics</Modal.Title>
            </Modal.Header>
            {selected_state.length === 0 && (
                <Modal.Body>
                    Sorry, we couldn't find any statistics for {state_name} in
                    Top 100 Recommendations
                </Modal.Body>
            )}
            {selected_state.length !== 0 && (
                <Modal.Body>
                    {selected_state?.map((sel_state) => {
                        return (
                            <div>
                                <h6>{sel_state.job_role} Salary Stats</h6>
                                <p>
                                    There
                                    {sel_state.state_count > 1
                                        ? ' are ' +
                                          sel_state.state_count +
                                          ' jobs'
                                        : ' is only ' +
                                          sel_state.state_count +
                                          ' job'}{' '}
                                    for {sel_state.job_role} role in Top 100
                                    Recommendations
                                </p>
                                {sel_state.avg_salary !==
                                    sel_state.max_salary && (
                                    <Fragment>
                                        <p>
                                            Minimum Salary :{' '}
                                            {sel_state.min_salary}
                                        </p>
                                        <p>
                                            Maximum Salary :{' '}
                                            {sel_state.max_salary}
                                        </p>
                                    </Fragment>
                                )}

                                <p>Average Salary : {sel_state.avg_salary}</p>
                                <hr />
                            </div>
                        );
                    })}
                </Modal.Body>
            )}
        </Modal>
    );
}
