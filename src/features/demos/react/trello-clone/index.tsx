import { BoardProvider, useBoard, type BoardContextType, type Card, type List } from "./trello-context";
import styles from './styles.module.scss'
import { flushSync } from "react-dom";
import { useRef } from "react";

export function TrelloClone({initialState}: {initialState: BoardContextType}) {
    return (
        <div>
            <h1>Trello Clone</h1>
            <BoardProvider initialState={initialState}>
                <AddItemDialog />
                <Board />
            </BoardProvider>
        </div>
    )
}

export function AddItemDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { dispatch } = useBoard();

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        dialogRef.current?.showModal();
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        // dialogRef.current?.style.viewTransitionName = ''
        const form = e.currentTarget;
        const formData = new FormData(form);
        const title = formData.get('title') as string;
        const id = title.split(' ').join('-').toLowerCase()

        form.style.viewTransitionName = `card-${id}`
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                dispatch({type: 'NEW_CARD', payload: {card: {id, title}}})
                dialogRef.current?.close();
            })
        })
        await transition.ready;
    }

    return (
        <div>
            <button onClick={onClick}>Add Items</button>
            <dialog ref={dialogRef}>
                <form onSubmit={onSubmit}>
                    <input type="text" name='title'/>
                    <button type="submit">Add</button>
                </form>
            </dialog>
        </div>
    )
}

export function Board() {
    const { lists } = useBoard();
    return (
        <div className={styles.board}>

            {lists.map((list: List) => (
                <ListColumn key={list.id} list={list} />
            ))}
        </div>
    )
}

export function ListColumn({ list }: { list: List }) {
    const { dispatch } = useBoard();
    async function onDrop(e: React.DragEvent) {
        e.preventDefault();
        const data = e.dataTransfer.getData("text");
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                dispatch({ type: 'MOVE_CARD', payload: { card: JSON.parse(data), newListId: list.id} });
            })
        })

        await transition.ready
    }

    return (
        <div className={styles.columnWrapper} onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
            <h2>{list.title}</h2>
            <div className={styles.column} >
                {list.cards.map(card => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </div>
    )
}


export function Card({ card }: { card: Card }) {
    const { dispatch } = useBoard();
    const dialogRef = useRef<HTMLDialogElement>(null);
    function onDragStart(e: React.DragEvent) {
        console.log(e)
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text/plain", JSON.stringify(card));
    }

   async function onDelete(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.style.viewTransitionName = 'card-delete';
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                dispatch({ type: 'DELETE_CARD', payload: { cardId: card.id }
            })
        })})

     await transition.ready;
    }

    return (
        <div className={`${styles.card} card`} onDrag={() => {}} draggable onDragStart={onDragStart} style={{ viewTransitionName: `card-${card.id}`}}>
            <h3>{card.title}</h3>
            <button onClick={onDelete}>Delete</button>
            <button onClick={() => document.startViewTransition(() => { flushSync(() => {dialogRef.current?.showModal()        })})}>View</button>
            <dialog ref={dialogRef} style={{ viewTransitionName: `card-${card.id}`, width: '300px', height: '300px'}}>
                <button onClick={() => dialogRef.current?.close()}>Close</button>
                <h2>{card.title}</h2>
            </dialog>
        </div>
    )
}