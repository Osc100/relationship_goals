import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Todo } from "../types/database";

interface EditModalProps {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  modalId: string;
  initialTodo?: Todo;
  executeOnFinish: () => void;
}

const EditModal: FC<EditModalProps> = (props) => {
  const [title, setTitle] = useState(props.initialTodo?.title ?? "");
  const [description, setDescription] = useState(
    props.initialTodo?.description ?? ""
  );
  const [hidden, setHidden] = useState(
    props.initialTodo?.hidden_by_default ?? false
  );
  const supabase = useSupabaseClient();

  const handleSubmit = async () => {
    if (props.initialTodo?.id) {
      const { error } = await supabase
        .from("todos")
        .update({
          title,
          description,
          hidden_by_default: hidden,
        })
        .match({ id: props.initialTodo.id });

      if (error) alert(error.message);
    } else {
      const { data, error } = await supabase.from("todos").insert({
        title,
        description,
        hidden_by_default: hidden,
      });

      if (error) alert(error.message);
    }

    props.executeOnFinish();
    props.setChecked(false);
  };

  return (
    <>
      <input
        type="checkbox"
        id={props.modalId}
        className="modal-toggle"
        checked={props.checked}
        onChange={() => props.setChecked(!props.checked)}
      />
      <label htmlFor={props.modalId} className="cursor-pointer modal">
        <label className="relative modal-box bg-base-200" htmlFor="">
          <div className="form-control">
            <label className="flex justify-center input-group">
              <span className="font-bold">Título</span>
              <input
                type="text"
                className="w-full input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="flex justify-center mt-4 input-group input-group-vertical">
              <span className="py-2 font-bold text-center">Descripción</span>
              <textarea
                className="px-4 py-5 textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center gap-1 mx-1 mt-2">
            <p className="text-2xl">😈</p>
            <input
              type="checkbox"
              className=" checkbox checkbox-secondary checkbox-md"
              checked={hidden}
              onChange={() => setHidden(!hidden)}
            />
            <button
              className="py-1 ml-auto btn-sm btn btn-success"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </label>
      </label>
    </>
  );
};

export default EditModal;
