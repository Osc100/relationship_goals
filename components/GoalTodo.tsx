import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { FC, useState } from "react";
import { Todo } from "../types/database";
import EditModal from "./EditModal";

interface GoalTodoProps {
  todo: Todo;
  executeOnSuccessfulEdit: () => void;
}

const GoalTodo: FC<GoalTodoProps> = (props) => {
  const [todo, setTodo] = useState(props.todo);

  const supabase = useSupabaseClient();
  const [collapsed, setCollapsed] = useState(false);
  const [checked, setChecked] = useState(props.todo.is_complete);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="collapse w-[96vw] lg:xw-[80vw] xl:w-[60vw] my-4 text-3xl shadow-xl card bg-base-200">
      {modalOpen && (
        <EditModal
          checked={modalOpen}
          setChecked={setModalOpen}
          modalId="editing-modal-owo"
          initialTodo={todo}
          executeOnFinish={props.executeOnSuccessfulEdit}
        />
      )}
      <input
        type="checkbox"
        checked={collapsed}
        onChange={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex justify-between text-xl font-medium collapse-title">
        <h1 className="font-bold truncate">{todo.title}</h1>
        <input
          type="checkbox"
          className="z-50 -mr-4 checkbox checkbox-primary"
          checked={checked}
          onChange={async () => {
            const { data } = await supabase
              .from("todos")
              .update({
                is_complete: !checked,
                completed_at: !checked === true ? new Date() : null,
              })
              .match({ id: todo.id })
              .select("*");

            if (data !== null) {
              setTodo(data[0]);
            }
            setChecked(!checked);
          }}
        />
      </div>
      {
        <div className="collapse-content">
          <p className="text-sm text-[1rem]">{todo.description}</p>
          <div className="flex justify-between w-full mt-4">
            <button
              className="btn btn-xs btn-info"
              onClick={() => setModalOpen(true)}
            >
              Editar
            </button>
            {todo.completed_at && (
              <p className="text-sm">{`Completado el: ${
                todo.completed_at?.split("T")[0]
              } <3`}</p>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default GoalTodo;
