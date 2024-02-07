import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import styled from 'styled-components';
import {useRecoilState} from 'recoil';
import { boardState } from './atoms';
import Board from './components/Board';
import { useForm } from 'react-hook-form';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 300px;
  gap: 10px;
`;

const DeleteDiv = styled.div`
  margin-top: 10px;
  width: 100%;
`;
  
const Delete = styled.div<{$isDraggingOver:boolean}>`
  height: 50px;
  background-color: ${props => props.$isDraggingOver ? "#d63031" : "#e17055"};
  border-radius: 5px;
  text-align: center;
  span{
    line-height: 50px;
    font-weight: bold;
    color: ${props => props.theme.boardColor};
  }
`;

const BoardInput = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
  form{
    display: flex;
    justify-content: center;
    width: 100%;
    input{
      width: 50%;
      border: none;
      border-radius: 5px;
      padding: 10px;
    }
  }
`;

interface IForm{
  board:string;
}

function App() {
  const {register, setValue, handleSubmit} = useForm<IForm>();
  const [boards, setBoards] = useRecoilState(boardState);

  const onDragEnd = (info:DropResult) => {
    console.log(info)

    const {destination, source, draggableId} = info;

    if(!destination) return ; 
    debugger;
    // Boards
    if(source.droppableId === "allBoards" && source.droppableId === destination.droppableId){
      setBoards(boards => {
        let allBoardCopy = [...boards];
        const sourceBoardCopy = {...allBoardCopy[source.index]};
        allBoardCopy.splice(source.index, 1);
        allBoardCopy.splice(destination.index, 0, sourceBoardCopy);
        return allBoardCopy;
      });
    }
    // Todos
    else{
      if(destination.droppableId === 'delete'){
        setBoards(boards => {
          const allBoardCopy = [...boards];
          const boardIdx = allBoardCopy.findIndex(board => board.id.toString() === source.droppableId);
          let boardCopy = {...allBoardCopy[boardIdx]};
          const todosCopy = [...boardCopy.todos];
          todosCopy.splice(source.index, 1);
          boardCopy = {...boardCopy, todos: todosCopy};
          allBoardCopy.splice(boardIdx, 1, boardCopy);
          return allBoardCopy;
        });
      }
      else if(destination?.droppableId === source.droppableId){
        setBoards(boards => {
          const allBoardCopy = [...boards];
          const boardIdx = allBoardCopy.findIndex(board => board.id.toString() === source.droppableId);
          let boardCopy = {...allBoardCopy[boardIdx]};
          const todosCopy = [...boardCopy.todos];
          const grabTodo = todosCopy[source.index];
          todosCopy.splice(source.index, 1);
          todosCopy.splice(destination.index, 0, grabTodo);

          boardCopy = {...boardCopy, todos: todosCopy};
          allBoardCopy.splice(boardIdx, 1, boardCopy);
          return allBoardCopy;
        });
      }
      else{
        setBoards(boards => {
          const allBoardCopy = [...boards];
          const sourceBoardIdx = allBoardCopy.findIndex(board => board.id.toString() === source.droppableId);
          const targetBoardIdx = allBoardCopy.findIndex(board => board.id.toString() === destination.droppableId);
          let sourceBoardCopy = {...allBoardCopy[sourceBoardIdx]};
          let targetBoardCopy = {...allBoardCopy[targetBoardIdx]};
          const sourceTodosCopy = [...sourceBoardCopy.todos];
          const targetTodosCopy = [...targetBoardCopy.todos];
          const grabTodo = sourceTodosCopy[source.index];
          sourceTodosCopy.splice(source.index, 1);
          targetTodosCopy.splice(destination.index, 0, grabTodo);

          sourceBoardCopy = {...sourceBoardCopy, todos: sourceTodosCopy};
          targetBoardCopy = {...targetBoardCopy, todos: targetTodosCopy};
          allBoardCopy.splice(sourceBoardIdx, 1, sourceBoardCopy);
          allBoardCopy.splice(targetBoardIdx, 1, targetBoardCopy);
          return allBoardCopy;
        });
      }
    }

  };

  const onBoardSubmit = ({board}:IForm) => {
    setBoards(boards => {
      return [
        ...boards,
        {id: Date.now(), name: board, todos: []},
      ];
    });
    setValue("board", "");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <BoardInput>
          <form onSubmit={handleSubmit(onBoardSubmit)}>
            <input type="text" placeholder='Add Board...' {...register("board", {required: true})}/>
          </form>
        </BoardInput>
        <Droppable droppableId="allBoards" type='boards'>
          {(magic, info) => 
            <Boards
              ref={magic.innerRef} 
              {...magic.droppableProps}
            >
              {boards.map((board, index) => <Board key={board.id} boardId={board.id} todos={board.todos} boardNm={board.name} index={index} />)}
              {magic.placeholder}
            </Boards>
          }
        </Droppable>
        <Droppable droppableId="delete">
          {(magic, info) => 
            <DeleteDiv
              ref={magic.innerRef} 
              {...magic.droppableProps}
            >
              <Delete 
                  $isDraggingOver={info.isDraggingOver}
              >
                  <span>Delete</span>
              </Delete>
              {magic.placeholder}
            </DeleteDiv>
          }
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
