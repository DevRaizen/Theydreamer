import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="devuser",
    password="1234",
    database="events_db"
)

cursor = db.cursor()

# Create database
cursor.execute("CREATE DATABASE IF NOT EXISTS events_db")
cursor.execute("USE events_db")

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS events_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lat (lat),
    INDEX idx_lng (lng)
)
""")

print("Database and table created successfully in DD format")

db.commit()
cursor.close()
db.close()