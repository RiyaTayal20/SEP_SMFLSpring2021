import pandas as pd
import numpy as np
import yfinance as yf
import pandas_datareader as pdr
import datetime as dt
from dateutil.relativedelta import relativedelta
import warnings

pd.options.mode.chained_assignment = None 
warnings.filterwarnings("ignore", category=RuntimeWarning) 

tickers = ['CNI', 'MO', 'TSLA','TDC', 'XM', 'EFX', 'JNJ', 'AAPL', 'SNBR', 'SEIC']

# Get last 3 months of data
now = dt.datetime.now()
start = now + relativedelta(months=-3)
for t in tickers: 
    df = pdr.get_data_yahoo(t, start, now)
    df_index = df.index
    
    #Initializing factors
    df_factors = pd.DataFrame(np.nan, index=df_index, columns=['up_move', 'down_move', 'avg_up', 'avg_down', 'rs', 'rsi', 'position_long_next', 'buy_sig', 'sell_sig', 'buy_rsi', 'sell_rsi']);

    df=df.join(df_factors)
    df['up_move']=0
    df['down_move']=0
    
    rsi_days = 14

    #Calculating the moves based on adjusted values
    for i in range(1, len(df)):
        df['up_move'][i] = 0
        df['down_move'][i] = 0
        if df['Adj Close'][i] > df['Adj Close'][i-1]:
            df['up_move'][i] = df['Adj Close'][i] - df['Adj Close'][i-1]
        if df['Adj Close'][i] < df['Adj Close'][i-1]:
            df['down_move'][i] = abs(df['Adj Close'][i] - df['Adj Close'][i-1])  
    
    # Calculate the rsi_days average up and down, rs and rsi
    df['avg_up'][rsi_days] = df['up_move'][1:rsi_days+1].mean()
    df['avg_down'][rsi_days] = df['down_move'][1:rsi_days+1].mean()
    df['rs'][rsi_days] = df['avg_up'][rsi_days] / df['avg_down'][rsi_days]
    df['rsi'][rsi_days] = 100 - (100/(1+df['rs'][rsi_days]))

    # Calculate the rest of average up and down, rs and rsi
    for i in range(rsi_days+1, len(df)):
        df['avg_up'][i] = (df['avg_up'][i-1]*13+df['up_move'][i])/rsi_days
        df['avg_down'][i] = (df['avg_down'][i-1]*13+df['down_move'][i])/rsi_days
        df['rs'][i] = df['avg_up'][i] / df['avg_down'][i]
        df['rsi'][i] = 100 - (100/(1+df['rs'][i]))

    for i in range(15, len(df)):
        if ((df['rsi'][i] <= 40) & (df['rsi'][i-1]>40) ):
            df['position_long_next'][i] = True
        elif ((df['position_long_next'][i-1]) and (df['rsi'][i] <= 70)):
            df['position_long_next'][i] = True
        else:
            df['position_long_next'][i] = False
        
        #Buy Signal
        if ((df['position_long_next'][i]) and (not df['position_long_next'][i-1])):
            df['buy_sig'][i] = df['Adj Close'][i]
            df['buy_rsi'][i] = df['rsi'][i]
        #Sell Signal    
        if ((not df['position_long_next'][i]) and (df['position_long_next'][i-1])):
            df['sell_sig'][i] = df['Adj Close'][i]
            df['sell_rsi'][i] = df['rsi'][i]

    if not np.isnan(df['buy_sig'][len(df)-1]):
        print('Buy')
    elif not np.isnan(df['sell_sig'][len(df)-2]):
        print('Sell')
    else:
        print('Hold')

        