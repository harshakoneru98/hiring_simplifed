import React from 'react';
import './dashboard.scss';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { useSelector } from 'react-redux';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export const data = {
    labels: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
    datasets: [
        {
            label: 'Frequency',
            data: [25, 29, 23, 25, 24],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
};

export default function DashboardView() {
    const userInfo = useSelector((state) => state?.userData?.value);

    console.log('UserInfo : ', userInfo);
    return (
        <Container>
            <Row></Row>
            <Row></Row>
            <Row>
                <Col xs={6}>
                    <Radar data={data} />
                </Col>
                <Col xs={6}></Col>
            </Row>
            <Row></Row>
        </Container>
    );
}
