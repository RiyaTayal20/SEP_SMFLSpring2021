import pandas as pd
import numpy as np
from pandas_datareader import data as pdr
import yfinance as yf
import datetime as dt
from dateutil.relativedelta import relativedelta
import sys
import warnings

pd.set_option("display.max_rows", None, "display.max_columns", None)
warnings.filterwarnings("ignore", category=RuntimeWarning) 

#Candle Stick pattern recognition
now = dt.datetime.now()
start = now + relativedelta(months=-12)
tickers = ['CNI', 'MO', 'TSLA','TDC', 'XM', 'EFX', 'JNJ', 'AAPL', 'SNBR', 'SEIC']

for t in tickers:
  df = pdr.get_data_yahoo(t, start, now)
  df = df.drop(['Volume', 'Adj Close'], axis=1)

  df["Signals"]=0
  t_index = df.index
  for t in range(len(df)-4,len(df)):
    date = t_index[t]
  
    open = df['Open'].iloc[t-2:t+1]
    close = df['Close'].iloc[t-2:t+1]
    low = df['Low'].iloc[t-2:t+1]
    high = df['High'].iloc[t-2:t+1]

    #Bullish Candles
    #---------------
    #Hammer
    hammer = (((high[0] - low[0])>3*(open[0] - close[0])) and ((close[0] - low[0])/(.001 + high[0] - low[0]) > 0.6) and ((open[0] - low[0])/(.001 + high[0] - low[0]) > 0.6))

    #Inverse hammer
    inverted_hammer = (((high[0] - low[0])>3*(open[0] -close[0])) and ((high[0] - close[0])/(.001 + high[0] - low[0] > 0.6) and ((high[0] - open[0])/(.001 + high[0] - low[0]) > 0.6)))

    #Bullish engulfing
    Bullish_Engulfing = (open[1] > close[1]) and (close[0] > open[0]) and (close[0] >= open[1]) and (close[1] >= open[0]) and ((close[0] - open[0]) > (open[1] - close[1] ))

    #Piercing line
    piercing_line_bullish = (close[1] < open[1]) and (close[0] > open[0]) and (open[0] < low[1]) and (close[0] > close[1]) and (close[0]>((open[1] + close[1])/2)) and (close[0] < open[1])

    #Morning star
    morning_star = (close[2] < open[2]) and (min(open[1], close[1]) < close[2]) and (open[0] > min(open[1], close[1])) and (close[0] > open[0])


    #Bearish Candles
    #---------------
    #Hanging man
    Hanging_Man_bearish=(close[1] > open[1]) and (close[0] >((open[1] + close[1])/2)) and (close[0] < open[1]) and hammer

    #Shooting star
    shooting_Star_bearish=(open[1] < close[1]) and (open[0] > close[1]) and ((high[0] - max(open[0], close[0])) >= abs(open[0] - close[0]) * 3) and ((min(close[0], open[0]) - low[0] )<= abs(open[0] - close[0])) and inverted_hammer

    #Bearish engulfing
    Bearish_Engulfing=((close[1] > open[1]) and (open[0] > close[0])) and ((open[0] >= close[1]) and (open[1] >= close[0])) and ((open[0] - close[0]) > (close[1] - open[1] ))

    #Evening star
    evening_star=(close[2] > open[2]) and (min(open[1], close[1]) > close[2]) and (open[0] < min(open[1], close[1])) and (close[0] < open[0] )

    signal=0
    
    if evening_star:
      signal=signal-1
    if morning_star:
      signal=signal+1
    if shooting_Star_bearish:
      signal=signal-1
    if  Bearish_Engulfing:
      signal=signal-1
    if  piercing_line_bullish:
      signal=signal+1
    if  Hanging_Man_bearish:
      signal=signal-1

    df.loc[date,"Signals"] = signal
    
  if (df['Signals'][len(df)-1] > 0):
      print('Buy')
  elif (df['Signals'][len(df)-1] < 0):
      print('Sell')
  else:
      print('Hold')