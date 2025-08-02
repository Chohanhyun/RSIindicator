from flask import Flask, jsonify, render_template
import pyupbit
import pandas_ta as ta

app = Flask(__name__)

# 기본 페이지 라우팅
@app.route('/')
def index():
    return render_template('index.html')

# 6개 코인 데이터를 모두 보내주는 API
@app.route('/api/all_rsi')
def get_all_rsi_data():
    # --- 6개 코인 목록 ---
    tickers = ["KRW-DOGE", "KRW-SOL", "KRW-BTC", "KRW-TRX", "KRW-ONDO", "KRW-XRP"]
    all_data = {}

    try:
        for ticker in tickers:
            # 각 코인의 일봉 데이터 200개 가져오기
            df = pyupbit.get_ohlcv(ticker, interval="day", count=200)
            if df is None:
                continue # 데이터 못가져오면 건너뛰기

            # RSI 계산
            df['RSI_14'] = ta.rsi(df['close'], length=14)
            df.dropna(inplace=True)

            # 코인별로 데이터 저장
            all_data[ticker] = {
                "labels": [d.strftime('%Y-%m-%d') for d in df.index],
                "rsi_values": df['RSI_14'].tolist()
            }
        
        return jsonify(all_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)