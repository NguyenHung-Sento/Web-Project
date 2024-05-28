import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ revenue }) => {
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'DOANH THU CỬA HÀNG',
            },
        },
    };

    const labels = [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ];


    let dataValues = labels.map(() => Math.floor(Math.random() * revenue));


    const sum = dataValues.reduce((total, value) => total + value, 0);

    if (sum > revenue) {
        const ratio = revenue / sum;
        dataValues = dataValues.map(value => Math.floor(value * ratio));
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Doanh thu tháng',
                data: dataValues,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return <Bar options={options} data={data} />;
};

export default memo(BarChart)