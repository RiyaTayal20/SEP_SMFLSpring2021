import yfinance as yf
import datetime as dt
import pandas as pd
import pandas_datareader as pdr
from dateutil.relativedelta import relativedelta
import sys

pd.set_option("display.max_rows", None, "display.max_columns", None)

equity = yf.Ticker(sys.argv[1])
data = equity.history(period='1y')
df = data[['Close']]

sma = df.rolling(window=20).mean().dropna()
rstd = df.rolling(window=20).std().dropna()

upper_band = sma + 2 * rstd
lower_band = sma - 2 * rstd

upper_band = upper_band.rename(columns={'Close': 'upper'})
lower_band = lower_band.rename(columns={'Close': 'lower'})

bb = df.join(upper_band).join(lower_band)
bb = bb.dropna()

buyers = bb[bb['Close'] <= bb['lower']]
sellers = bb[bb['Close'] >= bb['upper']]

data = pd.merge(sma, lower_band, on='Date')
# data = data.rename(columns={'Close': 'sma'})
data = pd.merge(data, upper_band, on='Date')
data = pd.merge(data, buyers['Close'], how="outer", on='Date')
data = pd.merge(data, sellers['Close'], how="outer", on='Date')
# data = data.rename(columns={'Close_x': 'buyers'})
# data = data.rename(columns={'Close_y': 'sellers'})

print(data)