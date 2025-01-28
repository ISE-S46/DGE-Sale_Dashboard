import pandas as pd
import mysql.connector
from mysql.connector import Error
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

env_path = Path(__file__).parent / "../.env"
load_dotenv(dotenv_path=env_path)

def import_csv_to_mysql():
    try:
        conn = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'dashboard_user'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME', 'DGE_Dashboard'),
            port=os.getenv('DB_PORT', 3306)
        )
        
        df = pd.read_csv(
            "Prepare Data Script/ecommerce_data.csv",
            parse_dates=['InvoiceDate']
        )
        
        cursor = conn.cursor()
        for _, row in df.iterrows():
            cursor.execute('''
                INSERT INTO sales (
                    InvoiceNo, StockCode, Description, Quantity,
                    InvoiceDate, UnitPrice, CustomerID, Country, Revenue
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                row['InvoiceNo'], 
                row['StockCode'], 
                row['Description'],
                row['Quantity'],
                row['InvoiceDate'],
                row['UnitPrice'],
                row['CustomerID'],
                row['Country'],
                row['Revenue']
            ))
        
        conn.commit()
        print(f"Inserted {len(df)} rows successfully")

    except Error as e:
        print(f"MySQL Error: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    import_csv_to_mysql()