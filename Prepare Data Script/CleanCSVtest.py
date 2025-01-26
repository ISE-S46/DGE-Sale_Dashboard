import pandas as pd

df = pd.read_csv("Prepare Data Script/data.csv", encoding='ISO-8859-1')

df['Revenue'] = (df['Quantity'] * df['UnitPrice']).round(2)

df.to_csv("Prepare Data Script/ecommerce_data.csv", index=False)