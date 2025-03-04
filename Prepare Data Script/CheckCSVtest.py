import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("Prepare Data Script/ecommerce_data.csv", encoding='ISO-8859-1')

print(df['Country'].value_counts())
print(df['Description'].head(10))
print(df['Description'].value_counts())

df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
sales_trend = df.groupby(df['InvoiceDate'].dt.date)['Revenue'].sum()

plt.figure(figsize=(10, 5))
plt.plot(sales_trend.index, sales_trend.values, label='Revenue Trend', color='blue')
plt.title('Daily Sales Trend')
plt.xlabel('Date')
plt.ylabel('Revenue')
plt.grid(True)
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

has_nan = df.isnull().values.any()
print(f"Are there any NaN values? {has_nan}")

nan_rows = df[df.isnull().any(axis=1)]
print("Rows with NaN values:")
print(nan_rows)