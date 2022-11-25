import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { AiFillPlusCircle, AiOutlineSearch } from "react-icons/ai";
import EditModal from "../components/EditModal";
import GoalTodo from "../components/GoalTodo";
import { Database, Todo } from "../types/database";

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  const [themeString, setThemeString] = useState("valentine");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const reloadComponent = async () => {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("inserted_at");

    if (data) setTodos(data.reverse());
  };

  const toggleTheme = () => {
    setThemeString((prev) => (prev === "valentine" ? "night" : "valentine"));
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", themeString);
  }, [themeString]);

  const getTodos = useCallback(async () => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("inserted_at");

    if (error) throw error;

    if (data.length === 0) {
      // Since supabase doesn't make raise a single authentication error, i have to do this :)
      router.push("/login");
    }

    if (data) setTodos(data.reverse());
  }, [supabase, router]);

  useEffect(() => {
    try {
      getTodos();
    } catch {
      router.push("/login");
    }
  }, [supabase, session, getTodos, router]);

  return (
    <div className="w-screen h-screen py-8">
      <EditModal
        checked={addModalOpen}
        setChecked={setAddModalOpen}
        modalId={"my-modal-4"}
        executeOnFinish={reloadComponent}
      />
      <section className="flex items-center justify-center w-full">
        <label
          className="transition text-info hover:opacity-80"
          htmlFor="my-modal-4"
        >
          <AiFillPlusCircle className="text-4xl xl:text-5xl" />
        </label>

        <div className="ml-1 mr-1 xl:ml-4 xl:mr-2 form-control">
          <label className="input-group input-group-lg">
            <span>
              <AiOutlineSearch size={18} />
            </span>
            <input
              type="text"
              className="w-[40vw] input input-bordered input-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="toggle xl:toggle-lg toggle-primary"
              onChange={() => toggleTheme()}
              checked={themeString === "night"}
            />
          </label>
        </div>

        <div className="ml-2 text-2xl transition lg:text-4xl">
          {themeString === "night" ? "😈" : "🥰"}
        </div>
      </section>
      <section className="flex justify-center w-screen">
        <ul>
          {todos.map((todo, index) => {
            if (
              themeString === "valentine" &&
              todo.hidden_by_default === true
            ) {
              return;
            }

            if (
              searchQuery !== "" &&
              !todo.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              return;
            }

            return (
              <GoalTodo
                key={"todo " + index}
                todo={todo}
                executeOnSuccessfulEdit={reloadComponent}
              />
            );
          })}
        </ul>
      </section>
    </div>
  );
}
