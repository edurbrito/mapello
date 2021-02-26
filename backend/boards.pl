% Initial Boards

% initial(+Key, -Board) - Creates the initial Game State identified by Key
% Create default initial board
initial(default, [
    [wall,  wall,  wall,  wall,  joker, wall,  wall,  wall,  wall, wall],
    [wall,  wall,  empty, bonus, empty, empty, bonus, empty, wall, wall],
    [wall,  empty, empty, empty, empty, empty, wall,  empty, empty, wall],
    [joker, bonus, wall,  empty, empty, empty, empty, empty, bonus, joker],
    [joker, empty, empty, empty, black, white, empty, empty, empty, wall],
    [wall,  empty, empty, empty, white, black, empty, empty, bonus, wall],
    [wall,  bonus, empty, empty, empty, empty, empty, wall,  empty, joker],
    [joker, empty, empty, wall,  empty, empty, empty, empty, empty, wall],
    [wall,  wall,  empty, bonus, empty, empty, empty, bonus, wall,  wall],
    [wall,  wall,  wall,  joker, wall,  wall,  wall,  joker, wall,  wall]
    ]).

% Create random board
initial(random, Board) :- 
    empty(Empty),
    random_jokers(Empty, B1, 8), 
    random_walls(B1, B2, 8), 
    random_bonus(B2, Board, 8).

% random_jokers(+Board, -NewBoard, +N) - Places N random jokers in Board, returning a NewBoard
random_jokers(Board, Board, 0).

random_jokers(Board, NewBoard, N) :-
    N > 0,
    findall(Row-Col,(between(0,9,Row), between(0,9,Col), get_matrix_value(Board, Row, Col, wall)), Walls),
    random_member(Row-Col, Walls),
    set_matrix_value(Board, Row, Col, joker, B1),
    N1 is N - 1,
    random_jokers(B1, NewBoard, N1).

% random_walls(+Board, -NewBoard, +N) - Places N random walls in Board, returning a NewBoard
random_walls(Board, Board, 0).

random_walls(Board, NewBoard, N) :-
    N > 0,
    findall(Row-Col,(between(1,8,Row), between(1,8,Col), get_matrix_value(Board, Row, Col, empty)), Empties),
    random_member(Row-Col, Empties),
    set_matrix_value(Board, Row, Col, wall, B1),
    N1 is N - 1,
    random_walls(B1, NewBoard, N1).

% random_bonus(+Board, -NewBoard, +N) - Places N random bonus in Board, returning a NewBoard
random_bonus(Board, Board, 0).

random_bonus(Board, NewBoard, N) :-
    N > 0,
    findall(Row-Col,(between(1,8,Row), between(1,8,Col), get_matrix_value(Board, Row, Col, empty)), Empties),
    random_member(Row-Col, Empties),
    set_matrix_value(Board, Row, Col, bonus, B1),
    N1 is N - 1,
    random_bonus(B1, NewBoard, N1).


% empty(-Board) - Returns an empty Board
empty([
[wall,  wall,  wall,  wall,  wall, wall,  wall,  wall,  wall, wall],
[wall,  empty, empty, empty, empty, empty, empty, empty, empty, wall],
[wall,  empty, empty, empty, empty, empty, empty, empty, empty, wall],
[wall, empty, empty, empty, empty, empty, empty, empty, empty, wall],
[wall, empty, empty, empty, black, white, empty, empty, empty, wall],
[wall,  empty, empty, empty, white, black, empty, empty, empty, wall],
[wall,  empty, empty, empty, empty, empty, empty, empty,  empty, wall],
[wall, empty, empty, empty, empty, empty, empty, empty, empty, wall],
[wall,  empty, empty, empty, empty, empty, empty, empty, empty, wall],
[wall,  wall,  wall,  wall, wall,  wall,  wall,  wall, wall,  wall]
]).
