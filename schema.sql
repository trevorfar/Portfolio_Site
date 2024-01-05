-- Drop the table if it exists (for testing purposes)
DROP TABLE IF EXISTS tic_tac_toe_boards;

-- Create the tic_tac_toe_boards table
CREATE TABLE tic_tac_toe_boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_data TEXT
);  