import pandas as pd

df = pd.read_csv('data.csv', encoding='ISO-8859-1')

df['Revenue'] = (df['Quantity'] * df['UnitPrice']).round(2)

df.to_csv('ecommerce_data.csv', index=False)