% Game

% valid_moves(+GameState, +Player, -ListOfMoves) - Get the ordered list of possible moves
valid_moves(GameState, Player, ListOfMoves):-
	setof([Val, Row, Col, WouldTurn], 
		get_move(GameState, Player, Val, Row, Col, WouldTurn), 
		ListOfMoves), !.

valid_moves(_, _, []).


get_move(GameState, Player, Val, Row, Col, WouldTurn):-
	between(1,8,Row), between(1,8,Col),
	valid_move(GameState, Player, Row, Col, S-WouldTurn),
	get_bonus_at(GameState, Row, Col, Bonus),
	Val is S + Bonus.


valid_move(GameState, Player, Row, Col, WouldTurn):-
	% cell is empty or with bonus
	(empty_cell(GameState, Row, Col); bonus_cell(GameState, Row, Col)),
	% gets the player's piece and the opponent's piece
	player(Player, _, PlayerPiece, OpponentPiece),
	% get all the opponent cells that would be turned
	would_turn(GameState, Row, Col, PlayerPiece, OpponentPiece, WouldTurnList),
	length(WouldTurnList, N), N > 0,
	WouldTurn = N-WouldTurnList.


% Make an already verified move and get new game state
move(GameState, Player, Row, Col, WouldTurn, BlackPoints, WhitePoints,  NewBP, NewWP, NewGameState):-
	player(Player, _, Piece, _),
	% place the piece
	set_matrix_value(GameState, Row, Col, Piece, NGS1),
	% turn opponent's pieces
	turn_pieces(NGS1, WouldTurn, Piece, NewGameState),
	% finally update the points
	update_points(GameState, Row, Col, Player, BlackPoints, WhitePoints, NewBP, NewWP).

move(_, _, _, _, _, _, _, _, _):- write('\n ERROR: Invalid move!\n'), fail.


% get_total_points(+GameState-BlackPoints-Wh , TotalBp, TotalWp) - Counts the Total Black or White Points
get_total_points(GameState, BlackPoints, WhitePoints, TotalBp, TotalWp):-
	count_pieces(GameState, black, Bp),
	count_pieces(GameState, white, Wp),
	TotalBp is BlackPoints + Bp,
	TotalWp is WhitePoints + Wp.


% update_points(+GameState, +Row, +Col, +Player, +BlackPoints, +WhitePoints, -NewBP, -NewWP) - Updates both players' points
update_points(GameState, Row, Col, Player, BlackPoints, WhitePoints, NewBP, NewWP) :-
	bonus_cell(GameState, Row, Col), !,
	update_points(Player, BlackPoints, WhitePoints, NewBP, NewWP).

update_points(_, _, _, _, BlackPoints, WhitePoints, BlackPoints, WhitePoints).

update_points(1, BlackPoints, WhitePoints, NewBP, WhitePoints) :-
	NewBP is BlackPoints + 3.

update_points(_, BlackPoints, WhitePoints, BlackPoints, NewWP) :-
	NewWP is WhitePoints + 3.


/* would_turn(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, -WouldTurn) - 
get all the cells that would be turned if the player put his piece in the position [Row,Col] */
would_turn(GameState, Row, Col, PlayerPiece, OpponentPiece, WouldTurn):-
	would_turn_right(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnR),
	would_turn_left(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnL),
	would_turn_top(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnT),
	would_turn_bottom(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnB),
	would_turn_top_right(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnTR),
	would_turn_top_left(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnTL),
	would_turn_bottom_right(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnBR),
	would_turn_bottom_left(GameState, Row, Col, PlayerPiece, OpponentPiece, [], WouldTurnBL),
	append([WouldTurnR, WouldTurnL, WouldTurnT, WouldTurnB, WouldTurnTR, WouldTurnTL, WouldTurnBR, WouldTurnBL], WouldTurn).


/* would_turn_right(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the right of [Row,Col] */
would_turn_right(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check right for an opponent
	check_right(GameState, Row, Col, [OpponentPiece]),
	Right is Col + 1, Right =< 9,
	append(Acc, [[Row, Right]], NewAcc),
	% check right pieces
	would_turn_right(GameState, Row, Right, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_right(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check right for a joker or player piece
	check_right(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_right(GameState, Row, Col, _, _, _, []):-
	% right is a wall, bonus or empty
	check_right(GameState, Row, Col, [empty, wall, bonus]).


/* would_turn_left(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the left of [Row,Col] */
would_turn_left(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check left for an opponent
	check_left(GameState, Row, Col, [OpponentPiece]),
	Left is Col - 1, Left >= 0,
	append(Acc, [[Row, Left]], NewAcc),
	% check left pieces
	would_turn_left(GameState, Row, Left, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_left(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check left for a joker or player piece
	check_left(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_left(GameState, Row, Col, _, _, _,[]):-
	% left is a wall, bonus or empty
	check_left(GameState, Row, Col, [empty, wall, bonus]).


/* would_turn_top(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the top of [Row,Col] */
would_turn_top(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check top for an opponent
	check_top(GameState, Row, Col, [OpponentPiece]),
	Top is Row - 1, Top >= 0,
	append(Acc, [[Top, Col]], NewAcc),
	% check top pieces
	would_turn_top(GameState, Top, Col, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_top(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check top for a joker or player piece
	check_top(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_top(GameState, Row, Col, _, _, _, []):-
	% top is a wall, bonus or empty
	check_top(GameState, Row, Col, [empty, wall, bonus]).

/* would_turn_bottom(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the bottom of [Row,Col] */
would_turn_bottom(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check bottom for an opponent
	check_bottom(GameState, Row, Col, [OpponentPiece]),
	Bottom is Row + 1, Bottom =< 9,
	append(Acc, [[Bottom, Col]], NewAcc),
	% check bottom pieces
	would_turn_bottom(GameState, Bottom, Col, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_bottom(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check bottom for a joker or player piece
	check_bottom(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_bottom(GameState, Row, Col, _, _, _, []):-
	% bottom is a wall, bonus or empty
	check_bottom(GameState, Row, Col, [empty, wall, bonus]).


/* would_turn_top_right(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the top_right of [Row,Col] */
would_turn_top_right(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check top_right for an opponent
	check_top_right(GameState, Row, Col, [OpponentPiece]),
	Top is Row - 1, Top >= 0,
	Right is Col + 1, Right =< 9,
	append(Acc, [[Top, Right]], NewAcc),
	% check top_right pieces
	would_turn_top_right(GameState, Top, Right, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_top_right(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check top_right for a joker or player piece
	check_top_right(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_top_right(GameState, Row, Col, _, _, _, []):-
	% top_right is a wall, bonus or empty
	check_top_right(GameState, Row, Col, [empty, wall, bonus]).


/* would_turn_top_left(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the top_left of [Row,Col] */
would_turn_top_left(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check top_left for an opponent
	check_top_left(GameState, Row, Col, [OpponentPiece]),
	Top is Row - 1, Top >= 0,
	Left is Col - 1, Left >= 0,
	append(Acc, [[Top, Left]], NewAcc),
	% check top_left pieces
	would_turn_top_left(GameState, Top, Left, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_top_left(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check top_left for a joker or player piece
	check_top_left(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_top_left(GameState, Row, Col, _, _, _, []):-
	% top_left is a wall, bonus or empty
	check_top_left(GameState, Row, Col, [empty, wall, bonus]).


/* would_turn_bottom_right(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the bottom_right of [Row,Col] */
would_turn_bottom_right(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check bottom_right for an opponent
	check_bottom_right(GameState, Row, Col, [OpponentPiece]),
	Bottom is Row + 1, Bottom =< 9,
	Right is Col + 1, Right =< 9,
	append(Acc, [[Bottom, Right]], NewAcc),
	% check bottom_right pieces
	would_turn_bottom_right(GameState, Bottom, Right, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_bottom_right(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check bottom_right for a joker or player piece
	check_bottom_right(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_bottom_right(GameState, Row, Col, _, _, _, []):-
	% bottom_right is a wall, bonus or empty
	check_bottom_right(GameState, Row, Col, [empty, bonus, wall]).


/* would_turn_bottom_left(+GameState, +Row, +Col, +PlayerPiece, +OpponentPiece, +Acc, -WouldTurn) - 
get all the cells that would be turned on the bottom_left of [Row,Col] */
would_turn_bottom_left(GameState, Row, Col, PlayerPiece, OpponentPiece, Acc, WouldTurn):-
	% check bottom_left for an opponent
	check_bottom_left(GameState, Row, Col, [OpponentPiece]),
	Bottom is Row + 1, Bottom =< 9,
	Left is Col - 1, Left >= 0,
	append(Acc, [[Bottom, Left]], NewAcc),
	% check bottom_left pieces
	would_turn_bottom_left(GameState, Bottom, Left, PlayerPiece, OpponentPiece, NewAcc, WouldTurn).

would_turn_bottom_left(GameState, Row, Col, PlayerPiece, _, Acc, Acc):-
	% check bottom_left for a joker or player piece
	check_bottom_left(GameState, Row, Col, [joker, PlayerPiece]).

would_turn_bottom_left(GameState, Row, Col, _, _, _, []):-
	% bottom left is a wall, bonus or empty
	check_bottom_left(GameState, Row, Col, [empty, wall, bonus]).


/* turn_pieces(+GameState, +WouldTurn, +Piece, -NewGameState) - 
turn all pieces in WouldTurn by giving them their new value (the current Player Piece) and returning a new board */
turn_pieces(GameState, [], _, GameState).
turn_pieces(GameState, [[Row,Col]|WouldTurn], Piece, NewGameState):-
	set_matrix_value(GameState, Row, Col, Piece, NGS1),
	turn_pieces(NGS1, WouldTurn, Piece, NewGameState).