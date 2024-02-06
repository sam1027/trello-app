import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const {persistAtom} = recoilPersist();

export interface ITodo{
    id:number;
    text:string;
}
interface ITodoState{
    [key: string]: ITodo[];
}

interface IBoard{
    id: number;
    name: string;
    todos: ITodo[];
}

export const boardState = atom<IBoard[]>({
    key: "boards",
    default: [
        {id: 1, name: 'To Do', todos: []}, 
        {id: 2, name: 'Doing', todos: []}, 
        {id: 3, name: 'Done', todos: []}, 
    ],
    // effects_UNSTABLE: [persistAtom],
})

export const todoState = atom<ITodoState>({
    key: "todo",
    default: {
        "To Do": [],
        Doing: [],
        Done: [],
    },
    // effects_UNSTABLE: [persistAtom],
})