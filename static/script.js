// 페이지가 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    
    fetch('/api/all_rsi')
        .then(response => response.json())
        .then(all_data => {
            const dashboard = document.getElementById('dashboard');

            for (const ticker in all_data) {
                const chartContainer = document.createElement('div');
                chartContainer.className = 'chart-container';
                
                const canvas = document.createElement('canvas');
                chartContainer.appendChild(canvas);
                dashboard.appendChild(chartContainer);

                // --- [수정] 차트 컨테이너 자체를 인자로 전달 ---
                createRsiChart(chartContainer, canvas, ticker, all_data[ticker]);
            }
        })
        .catch(error => console.error('Error fetching RSI data:', error));
});

/**
 * 차트와 현재 RSI 값을 생성하는 함수
 * @param {HTMLDivElement} chartContainer - 차트와 텍스트를 담을 전체 컨테이너
 * @param {HTMLCanvasElement} canvas - 차트를 그릴 캔버스 요소
 * @param {string} ticker - 코인 티커
 * @param {object} data - 차트에 필요한 데이터
 */
function createRsiChart(chartContainer, canvas, ticker, data) {
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'RSI (14)',
                data: data.rsi_values,
                borderColor: 'purple',
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 0,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `${ticker} RSI (일봉)`,
                    font: { size: 16 }
                },
                legend: { display: false }
            },
            scales: {
                y: {
                    suggestedMin: 20,
                    suggestedMax: 80
                }
            }
        }
    });

    // --- [추가] 현재 RSI 값을 표시하는 로직 ---
    // 1. 데이터 배열에서 마지막 값(가장 최신 값)을 가져오기
    const latestRsi = data.rsi_values[data.rsi_values.length - 1];

    // 2. 값을 표시할 새로운 div 요소 생성
    const rsiDisplay = document.createElement('div');
    rsiDisplay.className = 'current-rsi-display';
    // toFixed(2)는 소수점 둘째 자리까지 표시하라는 의미
    rsiDisplay.innerHTML = `현재 RSI: <strong>${latestRsi.toFixed(2)}</strong>`; 

    // 3. 차트 컨테이너에 새로 만든 요소를 추가
    chartContainer.appendChild(rsiDisplay);
    // -------------------------------------------
}