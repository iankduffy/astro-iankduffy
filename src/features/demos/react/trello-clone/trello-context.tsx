import { act, createContext, useContext, useMemo, useReducer } from "react";

export interface Card {
    id: string;
    title: string;
}

export interface List {
    id: string;
    title: string;
    cards: Card[];
}

export interface BoardContextType {
    lists: List[];
    dispatch: React.Dispatch<BoardContextActions>;
}

interface MoveCardAction {
    type: 'MOVE_CARD';
    payload: {
        card: Card;
        newListId: string;
    }
}

interface DeleteCardAction {
    type: 'DELETE_CARD';
    payload: {
        cardId: Card['id'];
    }
}

interface AddCardAction {
    type: 'NEW_CARD', 
    payload: {
       card: Card
    }
}

type BoardContextActions = MoveCardAction | DeleteCardAction | AddCardAction

function boardReducer(state: BoardContextType, action: BoardContextActions): BoardContextType {
    switch (action.type) {
        case 'MOVE_CARD':
            const { card, newListId } = action.payload;
            const newLists = state.lists.map(list => {
                if (list.id === newListId) {
                    const existingCard = list.cards.find(c => c.title === card.title);
                    if (!existingCard) {
                        return {
                            ...list,
                            cards: [...list.cards, card]
                        }
                    } else {
                        return list;
                    }
                }
                return {
                    ...list,
                    cards: list.cards.filter(c => c.title !== card.title)
                };
            })
                return {
                    ...state,
                    lists: newLists
                }

        case 'DELETE_CARD': {
            const { cardId } = action.payload;
            const newLists = state.lists.map(list => {
                return {
                    ...list,
                    cards: list.cards.filter(c => c.id !== cardId)
                };
            })
            return {
                ...state,
                lists: newLists
            }
        }
        case 'NEW_CARD': {
            const {card} = action.payload
           const newLists = state.lists.map(list => {
                if (list.id === 'todo') {
                    return {
                        ...list,
                        cards: [...list.cards, card]
                    };
                }
                return list;
            });
            return {
                ...state,
                lists: newLists
            };
        }
        // Define your cases here
        default:
            return state;
    }
}



const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children, initialState }: { children: React.ReactNode, initialState: BoardContextType }) {
    const [board, dispatch] = useReducer(boardReducer, initialState);

    const value = useMemo(() => ({ lists: board.lists, dispatch }), [board]);
    
    return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

export function useBoard() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error("useBoard must be used within a BoardProvider");
    }
    return { ...context };
}