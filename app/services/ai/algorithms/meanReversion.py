import yfinance as yf
import datetime as dt
import pandas_datareader as pdr
from dateutil.relativedelta import relativedelta

tickers = ['CNI', 'MO', 'TSLA','TDC', 'XM', 'EFX', 'JNJ', 'AAPL', 'SNBR', 'SEIC']

now = dt.datetime.now()
start = now + relativedelta(days=-30)

for t in tickers:
  # Close prices from the last month
  df = pdr.get_data_yahoo(t, start, now)
  df = df[['Close']]

  # 20-Day Simple Moving Average
  sma = df.rolling(window=20).mean().dropna()
  rstd = df.rolling(window=20).std().dropna()

  sma_val = sma.iloc[len(sma)-1]['Close']
  rstd_val = rstd.iloc[len(rstd)-1]['Close']

  # Bollinger Bands are 2 standard deviations away from simple moving average
  upper_band = sma_val + 2 * rstd_val
  lower_band = sma_val - 2 * rstd_val

  # Determine rating
  if df.iloc[len(df)-1]['Close'] <= lower_band:
    print('Buy')
  elif df.iloc[len(df)-1]['Close'] >= upper_band:
    print('Sell')
  else:
    print('Hold')