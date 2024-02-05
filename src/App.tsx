import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import styled from 'styled-components';
import {useRecoilState} from 'recoil';
import { todoState } from './atoms';
import Board from './components/Board';

const Wrapper = styled.div`
  display: flex;
  max-width: 680px;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

function App() {
  const [todo, setTodo] = useRecoilState(todoState);
  const onDragEnd = (info:DropResult) => {
    console.log(info);

    const {destination, source, draggableId} = info;

    if(!destination) return ; 

    if(destination?.droppableId === source.droppableId){
      setTodo(allBoards => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }else{
      setTodo(allBoards => {
        const sourceCopy = [...allBoards[source.droppableId]];
        sourceCopy.splice(source.index, 1);
        const destinationCopy = [...allBoards[destination.droppableId]];
        destinationCopy.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceCopy,
          [destination.droppableId]: destinationCopy,
        };
      });
    }

  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          {Object.keys(todo).map(boardId => <Board key={boardId} boardId={boardId} todos={todo[boardId]}/>)}
        </Boards>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
