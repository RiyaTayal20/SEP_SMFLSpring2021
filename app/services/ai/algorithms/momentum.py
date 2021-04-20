import pandas as pd
import numpy as np
import yfinance as yf
import pandas_datareader as pdr
import datetime as dt
from dateutil.relativedelta import relativedelta

tickers = ['EDIT', 'SPCE', 'HMBL', 'FUTU', 'KSU', 'SHW', 'TDUP']

# Get last 3 months of data
now = dt.datetime.now()
start = now + relativedelta(months=-3)
for t in tickers: 
    df = pdr.get_data_yahoo(t, start, now)

    # DataFrame layout
    df['Up Move'] = np.nan
    df['Down Move'] = np.nan
    df['Average Up'] = np.nan
    df['Average Down'] = np.nan
    df['RS'] = np.nan
    df['RSI'] = np.nan
    df['Long Tomorrow'] = np.nan
    df['Buy Signal'] = np.nan
    df['Sell Signal'] = np.nan
    df['Buy RSI'] = np.nan
    df['Sell RSI'] = np.nan
    df['Strategy'] = np.nan

    ## Calculate Up Move & Down Move
    for x in range(1, len(df)):
        df['Up Move'][x] = 0
        df['Down Move'][x] = 0
        if df['Adj Close'][x] > df['Adj Close'][x-1]:
            df['Up Move'][x] = df['Adj Close'][x] - df['Adj Close'][x-1]
        if df['Adj Close'][x] < df['Adj Close'][x-1]:
            df['Down Move'][x] = abs(df['Adj Close'][x] - df['Adj Close'][x-1])  
            
    ## Calculate Average Up and Down for 14 day RSI
    df['Average Up'][14] = df['Up Move'][1:15].mean()
    df['Average Down'][14] = df['Down Move'][1:15].mean()
    df['RS'][14] = df['Average Up'][14] / df['Average Down'][14]
    df['RSI'][14] = 100 - (100/(1+df['RS'][14]))

    ## Calculate rest of Average Up and Down/ RSI
    for x in range(15, len(df)):
        df['Average Up'][x] = (df['Average Up'][x-1]*13+df['Up Move'][x])/14
        df['Average Down'][x] = (df['Average Down'][x-1]*13+df['Down Move'][x])/14
        df['RS'][x] = df['Average Up'][x] / df['Average Down'][x]
        df['RSI'][x] = 100 - (100/(1+df['RS'][x]))

    ## Calculate buy and sell ratings
    for x in range(15, len(df)):
        if ((df['RSI'][x] <= 40) & (df['RSI'][x-1]>40) ):
            df['Long Tomorrow'][x] = True
        elif ((df['Long Tomorrow'][x-1] == True) & (df['RSI'][x] <= 70)):
            df['Long Tomorrow'][x] = True
        else:
            df['Long Tomorrow'][x] = False
            
        if ((df['Long Tomorrow'][x] == True) & (df['Long Tomorrow'][x-1] == False)):
            df['Buy Signal'][x] = df['Adj Close'][x]
            df['Buy RSI'][x] = df['RSI'][x]
            
        if ((df['Long Tomorrow'][x] == False) & (df['Long Tomorrow'][x-1] == True)):
            df['Sell Signal'][x] = df['Adj Close'][x]
            df['Sell RSI'][x] = df['RSI'][x]

    '''        
    ## Calculate strategy performance
    df['Strategy'][15] = df['Adj Close'][15]
    for x in range(16, len(df)):
        if df['Long Tomorrow'][x-1] == True:
            df['Strategy'][x] = df['Strategy'][x-1]* (df['Adj Close'][x] / df['Adj Close'][x-1])
        else:
            df['Strategy'][x] = df['Strategy'][x-1]
    '''

    if not np.isnan(df['Buy Signal'][len(df)-1]):
        print('Buy')
    elif not np.isnan(df['Sell Signal'][len(df)-1]):
        print('Sell')
    else:
        print('Hold')
        