import { BoardProvider, useBoard, type BoardContextType, type Card, type List } from "./trello-context";
import styles from './styles.module.scss'
import { flushSync } from "react-dom";
import { useRef } from "react";

export function TrelloClone({initialState}: {initialState: BoardContextType}) {
    return (
        <div>
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
        const id = title.split(' ').join('-').toLowerCase() + '-' + new Date().getTime();

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
    const itemRef = useRef<HTMLDivElement>(null);
    function onDragStart(e: React.DragEvent) {
        console.log(e)
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text/plain", JSON.stringify(card));
    }

   async function onDelete(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();

        const transition = document.startViewTransition(() => {
            flushSync(() => {
                dispatch({ type: 'DELETE_CARD', payload: { cardId: card.id }
            })
        })})

     await transition.ready;
    }

    // function onView(e: React.MouseEvent<HTMLButtonElement>) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // if (itemRef.current) itemRef.current.style.viewTransitionName = `none`

    //     document.startViewTransition(() => {
    //         flushSync(() => {
    //             if (dialogRef.current) {
    //                 if (dialogRef) dialogRef.current.style.viewTransitionClass = 'card';
    //                 if (dialogRef) dialogRef.current.style.viewTransitionName = `card-${card.id}`;


    //                 dialogRef.current.showModal();
    //             }
    //         })
    //     })
    // }
    console.log(card)

    return (
        <div ref={itemRef} className={`${styles.card} card`} onDrag={() => {}} draggable onDragStart={onDragStart} style={{ viewTransitionName: `card-${card.id}`}}>
            <h3>{card.title}</h3>
            <button onClick={onDelete}>Delete</button>
            {/* <button onClick={onView}>View</button> */}
        </div>
    )
}