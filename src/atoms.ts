import { atom, selector } from "recoil";

interface ITodoState{
    [key: string]: string[];
}

export const todoState = atom<ITodoState>({
    key: "todo",
    default: {
        "To Do": ["a", "b"],
        Doing: ["c", "d", "e"],
        Done: ["f"],
    },
})