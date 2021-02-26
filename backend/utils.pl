% Utils

% get_list_value(+List, +Pos, -Value) - Get the Value of the element at index Pos of the List 
get_list_value(L, Pos, Value) :- nth0(Pos,L,Value).

% get_matrix_value(+Matrix, +Row, +Col, -Value) - Get the Value of the element at cell [Row, Col] of the Matrix 
get_matrix_value(M, Row, Col, Value) :-
    nth0(Row, M, L),
    get_list_value(L, Col, Value).


% set_list_value(+List, +Pos, +Value, -NewList) - Set the Value of the element at index Pos of the List 
set_list_value([_|T], 0, Value, [Value|T]).

set_list_value([H|T], Pos, Value, [H|R]) :-
    Pos > 0,
    Pos1 is Pos - 1,
    set_list_value(T, Pos1, Value, R).

% set_matrix_value(+Matrix,  +Row, +Col, +Value, -NewMatrix) - Set the Value of the element at cell [Row, Col] of the Matrix 
set_matrix_value([H|T], 0, Col, Value, [R|T]) :-
    set_list_value(H, Col, Value, R).

set_matrix_value([H|T], Row, Col, Value, [H|R]) :-
    Row > 0,
    Row1 is Row - 1,
    set_matrix_value(T, Row1, Col, Value, R).


% check_right(+Matrix, +Row, +Col, +Pieces) - True if the cell on the right of Matrix[Row, Col] is in Pieces
check_right(Matrix, Row, Col, Pieces):-
	Right is Col + 1, Right =< 9,
    get_matrix_value(Matrix, Row, Right, Value),
    member(Value, Pieces).

% check_left(+Matrix, +Row, +Col, +Pieces) - True if the cell on the left of Matrix[Row, Col] is in Pieces
check_left(Matrix, Row, Col, Pieces):-
	Left is Col - 1, Left >= 0,
	get_matrix_value(Matrix, Row, Left, Value),
	member(Value, Pieces).

% check_top(+Matrix, +Row, +Col, +Pieces) - True if the cell on top of Matrix[Row, Col] is in Pieces
check_top(Matrix, Row, Col, Pieces):-
	Top is Row - 1, Top >= 0,
	get_matrix_value(Matrix, Top, Col, Value),
	member(Value, Pieces).

% check_bottom(+Matrix, +Row, +Col, +Pieces) - True if the cell below Matrix[Row, Col] is in Pieces
check_bottom(Matrix, Row, Col, Pieces):-
	Bottom is Row + 1, Bottom =< 9,
	get_matrix_value(Matrix, Bottom, Col, Value),
	member(Value, Pieces).

% check_top_left(+Matrix, +Row, +Col, +Pieces) - True if the top left cell of Matrix[Row, Col] is in Pieces
check_top_left(Matrix, Row, Col, Pieces):-
    Top is Row - 1, Top >= 0,
    Left is Col - 1, Left >= 0,
	get_matrix_value(Matrix, Top, Left, Value),
	member(Value, Pieces).

% check_top_right(+Matrix, +Row, +Col, +Pieces) - True if the top right cell of Matrix[Row, Col] is in Pieces
check_top_right(Matrix, Row, Col, Pieces):-
    Top is Row - 1, Top >= 0,
    Right is Col + 1, Right =< 9,
	get_matrix_value(Matrix, Top, Right, Value),
	member(Value, Pieces).

% check_bottom_left(+Matrix, +Row, +Col, +Pieces) - True if the bottom left cell of Matrix[Row, Col] is in Pieces
check_bottom_left(Matrix, Row, Col, Pieces):-
    Bottom is Row + 1, Bottom =< 9,
    Left is Col - 1, Left >= 0,
	get_matrix_value(Matrix, Bottom, Left, Value),
	member(Value, Pieces).

% check_bottom_right(+Matrix, +Row, +Col, +Pieces) - True if the bottom right cell of Matrix[Row, Col] is in Pieces
check_bottom_right(Matrix, Row, Col, Pieces):-
    Bottom is Row + 1, Bottom =< 9,
    Right is Col + 1, Right =< 9,
	get_matrix_value(Matrix, Bottom, Right, Value),
	member(Value, Pieces).


% empty_cell(+Matrix, +Row, +Col) - Check if a cell [Row, Col] is empty
empty_cell(Matrix, Row, Col) :-
	get_matrix_value(Matrix, Row, Col, empty).

% bonus_cell(+Matrix, +Row, +Col) - Check if a cell [Row, Col] has a bonus
bonus_cell(Matrix, Row, Col):-
	get_matrix_value(Matrix, Row, Col, bonus).

% get_bonus_at(+Matrix, +Row, +Col, -Bonus) - Get the bonus in the cell [Row, Col]
get_bonus_at(Matrix, Row, Col, 3):-
    bonus_cell(Matrix, Row, Col), !.

get_bonus_at(_, _, _, 0).

% count_pieces(+GameState, +Piece, -N) - Count all occurrences of the Piece in the current Board
count_pieces(GameState, Piece, N) :- 
	findall(Row-Col, 
		(between(1,8,Row), between(1,8,Col),
        get_matrix_value(GameState, Row, Col, Piece)), 
		ListOfPieces),
    length(ListOfPieces, N).

% player(+PlayerId, -Name, -Piece, -OpponentPiece)
player(1, 'BLACK', black, white). 
player(-1, 'WHITE', white, black).