import pandas as pd
import numpy as np
import yfinance as yf
import pandas_datareader as pdr
import datetime as dt
from dateutil.relativedelta import relativedelta
import sys

pd.set_option("display.max_rows", None, "display.max_columns", None)

equity = yf.Ticker(sys.argv[1])
data = equity.history(period='1y')
df = data[['Close']]

sma = df.rolling(window=20).mean().dropna()

data = pd.merge(sma, df, on='Date')

print(data)