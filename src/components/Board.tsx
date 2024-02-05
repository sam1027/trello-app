import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DraggableCard from './DraggableCard';

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

interface IBoard{
    todos: string[];
    boardId: string;
}

function Board({todos, boardId}:IBoard) {
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {(magic, info) => 
                <Area 
                    $isDraggingOver={info.isDraggingOver} 
                    $draggingFromThisWith={Boolean(info.draggingFromThisWith)} 
                    ref={magic.innerRef} 
                    {...magic.droppableProps}
                >
                    {todos.map((todo, index) => 
                    <DraggableCard key={todo} todo={todo} index={index} />
                    )}
                    {magic.placeholder}
                </Area>
                }
            </Droppable>
        </Wrapper>
    );
}

export default Board;