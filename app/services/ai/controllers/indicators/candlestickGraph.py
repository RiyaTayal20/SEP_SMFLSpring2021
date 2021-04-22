import pandas as pd
import datetime as dt
from pandas_datareader import data as pdr
import yfinance as yf
from datetime import datetime
from dateutil.relativedelta import relativedelta
import numpy as np
import sys

pd.set_option("display.max_rows", None, "display.max_columns", None)

now = dt.datetime.now()
start = now + relativedelta(months=-3)
df = pdr.get_data_yahoo(sys.argv[1], start, now)

df = df.drop(['Volume', 'Adj Close'], axis=1)

print(df)