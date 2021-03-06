# Federal Reserve Economic Data and S&P Sectors Dashboard

## Project Description: 
This project focuses on four key time series economic datasets maintained by the Federal Reserve (FRED) compared with the performance of the S&P 500 (eleven individual sectors and the sector considered as a whole) beginning with year 2000.


![image](https://user-images.githubusercontent.com/51388767/70550754-46562c00-1b44-11ea-9e0b-c2912b339395.png)


## Data: 
The two datasets to create the visuals came from https://fred.stlouisfed.org/fred-addin/ for the Federal Reserve portion and https://finance.yahoo.com/ for the S&P sector portion. This data was housed in SQLite.

## Dashboard Visuals: 
The visuals were created using d3 & JavaScript including the jQuery library.


![image](https://user-images.githubusercontent.com/51388767/70550447-c4fe9980-1b43-11ea-8d20-0d27b1555a09.png)
![image](https://user-images.githubusercontent.com/51388767/70552212-ea40d700-1b46-11ea-804d-d0a6f13d69a7.png)

## Observable Trends & Conclusions:
(1) The U.S. Unemployment Rate appears to be inversely correlated to the U.S. Case Schiller Home Price Index on a long term trend.

(2) The U.S. Consumer Price Index (CPI), a measure of inflation, typically moves higher annually.

(3) Communication Services ($XLC) has moved steadily higher with CPI over the period analyzed.

(4) U.S. Housing Starts peaked in 2006 preceding the Great Recession and bottomed out in 2009 after it began.

(5) Financials ($XLF) is closely aligned with U.S. Housing Starts from late 2007 through 2016, but outperformed significantly since 2016.

(6) Volume is super heavy for the S&P 500 ($SPY) and Financials ($XLF) from late 2007 through late 2011.

![image](https://user-images.githubusercontent.com/51388767/70565079-5cbdb100-1b5f-11ea-93dc-65f23688d27e.png)



## Webpage Access:
https://fredticker.herokuapp.com
