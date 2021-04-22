import pandas as pd
import datetime as dt
from pandas_datareader import data as pdr
import yfinance as yf
from datetime import datetime
from dateutil.relativedelta import relativedelta
import talib
import numpy as np

yf.pdr_override

tickers = ['CNI', 'MO', 'UAL','OBCI','HOG','JNJ','LND', 'AAPL']

now = dt.datetime.now()
start = now + relativedelta(months=-12)

for t in tickers:
  df = pdr.get_data_yahoo(t, start, now)

  patterns = talib.get_function_groups()['Pattern Recognition']

  patterns_detected = []
  df_candlesticks = pd.DataFrame()
  for p in patterns:
      df_candlesticks[p] = getattr(talib, p)(df['Open'], df['High'], df['Low'], df['Close'])
      if (df_candlesticks[p].any()!=0):
        patterns_detected.append(p)
  
  df.drop(['Volume', 'Adj Close'], axis=1)
  df_candlesticks["Detection"] = df_candlesticks.select_dtypes(include=['int32']).sum(axis=1)
  df_candlesticks["Bearish"] = df_candlesticks["Detection"] > 0
  df_candlesticks["Inconclusive"] = df_candlesticks["Detection"] = 0

  column_names = ["Uptrend_200", "Uptrend_100", "Uptrend_50", "Uptrend_20", "Uptrend_10"]
  df_trend = pd.DataFrame(columns = column_names)

  df['SMA200'] = talib.MA(df['Close'],timeperiod=200)
  df['SMA200'] = df['SMA200'].fillna(0) 
  df_trend['Uptrend_200'] = df['SMA200'] < df['Close']

  df['SMA100'] = talib.MA(df['Close'],timeperiod=100)
  df['SMA100'] = df['SMA100'].fillna(0) 
  df_trend['Uptrend_100'] = df['SMA100'] < df['Close']

  df['SMA50'] = talib.MA(df['Close'],timeperiod=50)
  df['SMA50'] = df['SMA50'].fillna(0) 
  df_trend['Uptrend_50'] = df['SMA50'] < df['Close']

  df['SMA20'] = talib.MA(df['Close'],timeperiod=20)
  df['SMA20'] = df['SMA20'].fillna(0) 
  df_trend['Uptrend_20'] = df['SMA20'] < df['Close']

  df['SMA10'] = talib.MA(df['Close'],timeperiod=20)
  df['SMA10'] = df['SMA10'].fillna(0) 
  df_trend['Uptrend_10'] = df['SMA10'] < df['Close']

  df_trend["Majority"] = df_trend.select_dtypes(include=['bool']).sum(axis=1)
  df_trend["Buy_Signal"] = df_trend["Majority"] >= 3

  if (df_trend['Buy_Signal'][len(df)-1] and df_candlesticks['Bearish'][len(df)-1]):
    print('Buy')
  elif (df_candlesticks['Inconclusive'][len(df)-1]):
    print('Hold')
  else:
    print('Sell')