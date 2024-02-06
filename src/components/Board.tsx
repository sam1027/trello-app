import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { boardState, ITodo, todoState } from '../atoms';
import DraggableCard from './DraggableCard';
import {useRecoilState} from 'recoil';

const Wrapper = styled.div`
    width: 300px;
    padding: 10px 0px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps{
    $isDraggingOver: boolean;
    $draggingFromThisWith: boolean;
}

const Area = styled.div<IAreaProps>`
    background-color: ${props => props.$isDraggingOver
        ? "#dfe6e9"
        : props.$draggingFromThisWith
        ? "#b2bec3"
        : "transparent"};
    flex-grow: 1;
    transition: background-color 0.3s ease-in-out;
    padding: 20px;
`;

const Form = styled.form`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    input {
        width: 90%;
        border: none;
        border-radius: 3px;
        padding: 5px;
    }
`;

interface IBoard{
    todos: ITodo[];
    boardId: number;
    boardNm: string;
    index:number;
}

interface IForm{
    todo: string;
}

function Board({todos, boardId, boardNm, index}:IBoard) {
    const [boards, setBoards] = useRecoilState(boardState);
    const {register, setValue, handleSubmit} = useForm<IForm>();
    const onValid = ({todo}:IForm) => {
        const newTodo = {
            id: Date.now(),
            text: todo,
        }
        setBoards(boards => {
            const boardCopy = [...boards];
            const targetIdx = boardCopy.findIndex((board) => board.id === boardId);
            const targetBoardTodos = [...boardCopy[targetIdx].todos, newTodo];
            boardCopy.splice(targetIdx, 1);

            const newBoard = {
                id: boardId,
                name: boardNm,
                todos: targetBoardTodos,
            }
            boardCopy.splice(targetIdx, 0, newBoard);

            return boardCopy;
        })
        setValue("todo", "");
    };
    return (
        <Draggable key={boardId} draggableId={boardId.toString()} index={index}>
            {(magic, snapshot) => 
                <Wrapper
                    ref={magic.innerRef} 
                    {...magic.draggableProps}
                    {...magic.dragHandleProps}
                >
                    <Title>{boardNm}</Title>
                    <Form onSubmit={handleSubmit(onValid)}>
                        <input 
                            type="text" 
                            placeholder={`Add Task on ${boardNm}`}
                            {...register("todo", {required: true})} 
                        />
                    </Form>
                    <Droppable droppableId={boardId.toString()}>
                        {(magic, info) => 
                        <Area 
                            $isDraggingOver={info.isDraggingOver} 
                            $draggingFromThisWith={Boolean(info.draggingFromThisWith)} 
                            ref={magic.innerRef} 
                            {...magic.droppableProps}
                        >
                            {todos.map((todo, index) => 
                                <DraggableCard key={todo.id} todo={todo} index={index} />
                            )}
                            {magic.placeholder}
                        </Area>
                        }
                    </Droppable>
                </Wrapper>
            }
        </Draggable>
    );
}

export default Board;