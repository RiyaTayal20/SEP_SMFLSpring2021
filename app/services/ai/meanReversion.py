import yfinance as yf
import datetime as dt
import pandas_datareader as pdr
from dateutil.relativedelta import relativedelta

ticker = 'FB'

now = dt.datetime.now()
start = now + relativedelta(days=-30)
df = pdr.get_data_yahoo(ticker, start, now)
df = df[['Close']]

sma = df.rolling(window=20).mean().dropna()
rstd = df.rolling(window=20).std().dropna()

sma_val = sma.iloc[len(sma)-1]['Close']
rstd_val = rstd.iloc[len(rstd)-1]['Close']

upper_band = sma_val + 2 * rstd_val
lower_band = sma_val - 2 * rstd_val

print(df.iloc[len(df)-1]['Close'])

if (df.iloc[len(df)-1]['Close'] <= lower_band):
  print("BUY")
else:
  print("SELL")