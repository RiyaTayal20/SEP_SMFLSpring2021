import pandas as pd
import numpy as np
import yfinance as yf
import pandas_datareader as pdr
import datetime as dt
from dateutil.relativedelta import relativedelta
import sys

pd.options.mode.chained_assignment = None 
pd.set_option("display.max_rows", None, "display.max_columns", None)

now = dt.datetime.now()
start = now + relativedelta(months=-12)
df = pdr.get_data_yahoo(sys.argv[1], start, now)

df['Up Move'] = np.nan
df['Down Move'] = np.nan
df['Avg Up'] = np.nan
df['Avg Down'] = np.nan
df['RS'] = np.nan
df['RSI'] = np.nan
df['Buy RSI'] = np.nan
df['Sell RSI'] = np.nan

for i in range(1, len(df)):
    df['Up Move'][i] = 0
    df['Down Move'][i] = 0
    if df['Adj Close'][i] > df['Adj Close'][i-1]:
        df['Up Move'][i] = df['Adj Close'][i] - df['Adj Close'][i-1]
    if df['Adj Close'][i] < df['Adj Close'][i-1]:
        df['Down Move'][i] = abs(df['Adj Close'][i] - df['Adj Close'][i-1])  
        

df['Avg Up'][14] = df['Up Move'][1:15].mean()
df['Avg Down'][14] = df['Down Move'][1:15].mean()
df['RS'][14] = df['Avg Up'][14] / df['Avg Down'][14]
df['RSI'][14] = 100 - (100/(1+df['RS'][14])) 

for i in range(15, len(df)):
    df['Avg Up'][i] = (df['Avg Up'][i-1]*13+df['Up Move'][i])/14
    df['Avg Down'][i] = (df['Avg Down'][i-1]*13+df['Down Move'][i])/14
    df['RS'][i] = df['Avg Up'][i] / df['Avg Down'][i]
    df['RSI'][i] = 100 - (100/(1+df['RS'][i]))

for i in range(15, len(df)): 
  if df['RSI'][i] >= 70:
    df['Sell RSI'][i] = df['RSI'][i]
  elif df['RSI'][i] <= 30:
    df['Buy RSI'][i] = df['RSI'][i]

df = df.iloc[15:]
data = pd.merge(df['RSI'], df['Buy RSI'], on='Date')
data = pd.merge(data, df['Sell RSI'], on='Date')
print(data)
