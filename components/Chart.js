import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const ChartRender = (req) => {
    const canvasRef = useRef(null);
        
    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                {
                    label: 'Total Sales',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: req.table_data,
                },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, []);
    
    return <canvas width={350} height={300  } ref={canvasRef} />;
};

export default ChartRender;