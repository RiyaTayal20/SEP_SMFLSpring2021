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
df['Average Up'] = np.nan
df['Average Down'] = np.nan
df['RS'] = np.nan
df['RSI'] = np.nan
df['Buy RSI'] = np.nan
df['Sell RSI'] = np.nan

for x in range(1, len(df)):
    df['Up Move'][x] = 0
    df['Down Move'][x] = 0
    if df['Adj Close'][x] > df['Adj Close'][x-1]:
        df['Up Move'][x] = df['Adj Close'][x] - df['Adj Close'][x-1]
    if df['Adj Close'][x] < df['Adj Close'][x-1]:
        df['Down Move'][x] = abs(df['Adj Close'][x] - df['Adj Close'][x-1])  
        

df['Average Up'][14] = df['Up Move'][1:15].mean()
df['Average Down'][14] = df['Down Move'][1:15].mean()
df['RS'][14] = df['Average Up'][14] / df['Average Down'][14]
df['RSI'][14] = 100 - (100/(1+df['RS'][14]))

for x in range(15, len(df)):
    df['Average Up'][x] = (df['Average Up'][x-1]*13+df['Up Move'][x])/14
    df['Average Down'][x] = (df['Average Down'][x-1]*13+df['Down Move'][x])/14
    df['RS'][x] = df['Average Up'][x] / df['Average Down'][x]
    df['RSI'][x] = 100 - (100/(1+df['RS'][x]))

for x in range(15, len(df)):
  if df['RSI'][x] >= 70:
    df['Sell RSI'][x] = df['RSI'][x]
  elif df['RSI'][x] <= 30:
    df['Buy RSI'][x] = df['RSI'][x]

df = df.iloc[15:]
data = pd.merge(df['RSI'], df['Buy RSI'], on='Date')
data = pd.merge(data, df['Sell RSI'], on='Date')
print(data)
