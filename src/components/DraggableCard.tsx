import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { ITodo } from '../atoms';

const Card = styled.div<{$isDragging:boolean}>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.$isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) => props.$isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.5)" : "none"};
`;

interface IDraggableCard {
    todo: ITodo,
    index: number,
}

function DraggableCard({todo, index}:IDraggableCard) {
    return (
        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
            {(magic, snapshot) => 
                <Card 
                $isDragging={snapshot.isDragging}
                ref={magic.innerRef} 
                {...magic.draggableProps}
                {...magic.dragHandleProps}
                >
                {todo.text}
                </Card>
            }
        </Draggable>
    );
}

export default React.memo(DraggableCard);