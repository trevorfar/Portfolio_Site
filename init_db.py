import sqlite3

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

# Initialize the tic_tac_toe_boards table
    connection.execute('''
        CREATE TABLE IF NOT EXISTS tic_tac_toe_boards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            board_data TEXT
        )
    ''')

cursor = connection.cursor()

# Insert a default tic-tac-toe board if it doesn't exist
cursor = connection.cursor()
cursor.execute('SELECT COUNT(*) FROM tic_tac_toe_boards')
count = cursor.fetchone()[0]

if count == 0:
    default_board = [['' for _ in range(3)] for _ in range(3)]
    board_data = ','.join([''.join(row) for row in default_board])
    cursor.execute('INSERT INTO tic_tac_toe_boards (board_data) VALUES (?)', (board_data,))




connection.commit()
connection.close()